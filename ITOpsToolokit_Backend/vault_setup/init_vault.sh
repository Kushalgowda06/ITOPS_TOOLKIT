#!/bin/bash
set -e

echo "**** Starting Vault Deployment ****"

# Directories & files
VAULT_TLS_DIR="/opt/vault/tls"
VAULT_CONFIG_FILE="/vault/vault.hcl"
VAULT_INIT_FILE="/vault/init.json"
VAULT_LOG_FILE="/vault/vault.log"

# Ensure TLS directory exists
mkdir -p "$VAULT_TLS_DIR"

# Generate TLS if missing
if [ ! -f "$VAULT_TLS_DIR/tls.crt" ] || [ ! -f "$VAULT_TLS_DIR/tls.key" ]; then
    echo "Generating TLS certificates..."
    /vault/generate_tls.sh
fi

# Start Vault server in background and log output
echo "Starting Vault server..."
vault server -config="$VAULT_CONFIG_FILE" > "$VAULT_LOG_FILE" 2>&1 &
VAULT_PID=$!

# Set Vault client environment
export VAULT_ADDR="https://127.0.0.1:8200"
export VAULT_CACERT="$VAULT_TLS_DIR/tls.crt"

# Wait until Vault is ready
echo "Waiting for Vault to become ready..."
RETRIES=30
until vault status &>/dev/null; do
    if [ $RETRIES -le 0 ]; then
        echo "Vault failed to start. Check logs:"
        cat "$VAULT_LOG_FILE"
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

# Unseal Vault with first 3 keys
echo "Unsealing Vault..."
for i in 0 1 2; do
    KEY=$(jq -r ".unseal_keys_b64[$i]" "$VAULT_INIT_FILE")
    vault operator unseal "$KEY"
done

# Display root token
echo "**** Vault Root Token ****"
jq -r '.root_token' "$VAULT_INIT_FILE"

echo "**** Vault Deployment Complete ****"

# Keep container running
tail -f /dev/null
