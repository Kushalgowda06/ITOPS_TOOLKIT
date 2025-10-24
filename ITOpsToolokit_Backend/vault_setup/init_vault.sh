#!/bin/bash
set -e

# Paths inside container
VAULT_CONFIG_FILE="/vault/vault.hcl"
TLS_DIR="/opt/vault/tls"
INIT_FILE="/vault/init.json"
TOKEN_FILE="/vault/.vault_token"

# Step 1: Ensure TLS exists
echo "Checking TLS certificates..."
if [ ! -f "$TLS_DIR/tls.crt" ] || [ ! -f "$TLS_DIR/tls.key" ]; then
    echo "TLS certificates not found, generating..."
    bash /vault/generate_tls.sh
else
    echo "TLS certificates found."
fi

# Step 2: Start Vault server in background
echo "Starting Vault server in background..."
vault server -config="$VAULT_CONFIG_FILE" >/vault/vault.log 2>&1 &
VAULT_PID=$!

# Step 3: Set Vault environment
export VAULT_ADDR="https://0.0.0.0:8200"
export VAULT_CACERT="$TLS_DIR/tls.crt"

# Step 4: Wait for Vault to be ready
echo "Waiting for Vault to become ready..."
RETRIES=30
until vault status &>/dev/null; do
    if [ $RETRIES -le 0 ]; then
        echo "Vault failed to start. Check logs:"
        cat /vault/vault.log
        kill $VAULT_PID || true
        exit 1
    fi
    echo "Vault not ready yet. Retrying in 2 seconds..."
    sleep 2
    ((RETRIES--))
done
echo "Vault is up!"

# Step 5: Initialize Vault if needed
if ! vault status | grep -q 'Initialized.*true'; then
    echo "Initializing Vault..."
    vault operator init -key-shares=5 -key-threshold=3 -format=json > "$INIT_FILE"
else
    echo "Vault already initialized."
fi

# Step 6: Unseal Vault if sealed
if vault status | grep -q 'Sealed.*true'; then
    echo "Unsealing Vault..."
    for i in 0 1 2; do
        KEY=$(jq -r ".unseal_keys_b64[$i]" "$INIT_FILE")
        vault operator unseal "$KEY"
    done
fi

# Step 7: Save root token
ROOT_TOKEN=$(jq -r '.root_token' "$INIT_FILE")
echo "$ROOT_TOKEN" > "$TOKEN_FILE"
echo "Root token saved at $TOKEN_FILE"

# Step 8: Stop background Vault
kill $VAULT_PID || true
sleep 2

# Step 9: Start Vault in foreground (final process)
echo "Launching Vault in foreground..."
exec vault server -config="$VAULT_CONFIG_FILE"
