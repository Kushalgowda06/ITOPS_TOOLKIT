#!/bin/bash
set -e

echo "**** Starting Vault Deployment ****"

# Directories & files
VAULT_CONFIG_FILE="/vault/config/vault.hcl"
VAULT_LOG_FILE="/vault/vault.log"
VAULT_TLS_DIR="/opt/vault/tls"
VAULT_INIT_FILE="/vault/init.json"
VAULT_TOKEN_FILE="/vault/.vault_token"

# --- Phase 1: Start Vault in background ---
echo "Starting Vault server in background..."
vault server -config="$VAULT_CONFIG_FILE" > "$VAULT_LOG_FILE" 2>&1 &
VAULT_PID=$!

# Set Vault client environment
export VAULT_ADDR="https://127.0.0.1:8200"
export VAULT_CACERT="$VAULT_TLS_DIR/tls.crt"

# --- Phase 2: Wait for Vault to become ready ---
echo "Waiting for Vault to become ready..."
RETRIES=30
until vault status &>/dev/null; do
    if [ $RETRIES -le 0 ]; then
        echo "Vault failed to start. Check logs:"
        cat "$VAULT_LOG_FILE"
        if ps -p $VAULT_PID > /dev/null 2>&1; then
            kill $VAULT_PID
        fi
        exit 1
    fi
    echo "Vault is not ready yet. Retrying in 2 seconds..."
    sleep 2
    ((RETRIES--))
done

echo "Vault is up and running!"

# --- Phase 3: Initialize Vault if not already ---
if ! vault status | grep -q 'Initialized.*true'; then
    echo "Initializing Vault..."
    vault operator init -key-shares=5 -key-threshold=3 -format=json > "$VAULT_INIT_FILE"
fi

# --- Phase 4: Unseal Vault if sealed ---
if vault status | grep -q 'Sealed.*true'; then
    echo "Unsealing Vault..."
    for i in 0 1 2; do
        KEY=$(jq -r ".unseal_keys_b64[$i]" "$VAULT_INIT_FILE")
        vault operator unseal "$KEY"
    done
fi

# --- Phase 5: Save root token ---
ROOT_TOKEN=$(jq -r '.root_token' "$VAULT_INIT_FILE")
echo "$ROOT_TOKEN" > "$VAULT_TOKEN_FILE"

echo "**** Vault Deployment Complete ****"
echo "Root Token saved to $VAULT_TOKEN_FILE"

# --- Phase 6: Kill background Vault and start final foreground server ---
if ps -p $VAULT_PID > /dev/null 2>&1; then
    kill $VAULT_PID
    sleep 2
fi

exec vault server -config="$VAULT_CONFIG_FILE"
