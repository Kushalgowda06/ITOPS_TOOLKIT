#!/bin/bash
set -e

# Paths
VAULT_CONFIG_FILE="/vault/config/vault.hcl"
VAULT_LOG_FILE="/vault/vault.log"
VAULT_TLS_DIR="/opt/vault/tls"
VAULT_INIT_FILE="/vault/init.json"
VAULT_TOKEN_FILE="/vault/.vault_token"

# Generate TLS if not exists
if [ ! -f "$VAULT_TLS_DIR/tls.crt" ] || [ ! -f "$VAULT_TLS_DIR/tls.key" ]; then
    echo "Waiting for TLS certificate..."
    /vault/setup/generate_tls.sh
fi

# Start Vault in background
echo "Starting Vault server..."
vault server -config="$VAULT_CONFIG_FILE" > "$VAULT_LOG_FILE" 2>&1 &
VAULT_PID=$!

# Set Vault client environment
export VAULT_ADDR="https://172.31.17.17:8200"
export VAULT_CACERT="$VAULT_TLS_DIR/tls.crt"

# Wait until Vault is ready
RETRIES=30
until vault status &>/dev/null; do
    if [ $RETRIES -le 0 ]; then
        echo "Vault failed to start. Check logs:"
        cat "$VAULT_LOG_FILE"
        kill $VAULT_PID || true
        exit 1
    fi
    echo "Vault is not ready yet. Retrying in 2 seconds..."
    sleep 2
    ((RETRIES--))
done

echo "Vault is up and running!"

# Initialize Vault if not already initialized
if ! vault status | grep -q 'Initialized.*true'; then
    echo "Initializing Vault..."
    vault operator init -key-shares=5 -key-threshold=3 -format=json > "$VAULT_INIT_FILE"
fi

# Unseal Vault
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
echo "Root Token saved to $VAULT_TOKEN_FILE"

# Kill background process and start Vault in foreground
kill $VAULT_PID || true
sleep 2
exec vault server -config="$VAULT_CONFIG_FILE"
