#!/bin/bash
set -e

# Vault paths
VAULT_CONFIG_FILE="/vault/config/vault.hcl"
VAULT_TLS_DIR="/opt/vault/tls"
VAULT_DATA_DIR="/opt/vault/data"
VAULT_INIT_FILE="/vault/init.json"
VAULT_TOKEN_FILE="/vault/.vault_token"

# Ensure TLS exists
while [ ! -f "$VAULT_TLS_DIR/tls.crt" ]; do
    echo "Waiting for TLS certificate..."
    sleep 2
done

# Start Vault in background
echo "Starting Vault server..."
vault server -config="$VAULT_CONFIG_FILE" > /vault/vault.log 2>&1 &
VAULT_PID=$!

# Set Vault client environment
export VAULT_ADDR="https://127.0.0.1:8200"
export VAULT_CACERT="$VAULT_TLS_DIR/tls.crt"

# Wait until Vault is ready
RETRIES=30
until vault status &>/dev/null; do
    if [ $RETRIES -le 0 ]; then
        echo "Vault failed to start. Check logs:"
        cat /vault/vault.log
        kill $VAULT_PID || true
        exit 1
    fi
    echo "Vault is not ready yet. Retrying in 2 seconds..."
    sleep 2
    ((RETRIES--))
done

echo "Vault is up!"

# Initialize Vault if not already
if ! vault status | grep -q 'Initialized.*true'; then
    echo "Initializing Vault..."
    vault operator init -key-shares=5 -key-threshold=3 -format=json > "$VAULT_INIT_FILE"
fi

# Unseal Vault if sealed
if vault status | grep -q 'Sealed.*true'; then
    echo "Unsealing Vault..."
    for i in 0 1 2; do
        KEY=$(jq -r ".unseal_keys_b64[$i]" "$VAULT_INIT_FILE")
        vault operator unseal "$KEY"
    done
fi

# Save root token
ROOT_TOKEN=$(jq -r '.root_token' "$VAULT_INIT_FILE")
echo "$ROOT_TOKEN" > "$VAULT_TOKEN_FILE"

echo "Vault root token saved to $VAULT_TOKEN_FILE"

# Kill temporary server
kill $VAULT_PID || true
sleep 2

# Start Vault in foreground
exec vault server -config="$VAULT_CONFIG_FILE"
