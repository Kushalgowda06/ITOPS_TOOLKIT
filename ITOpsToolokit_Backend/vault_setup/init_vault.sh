#!/bin/bash
set -e

VAULT_CONFIG_FILE="/vault/vault.hcl"
VAULT_LOG_FILE="/vault/vault.log"
VAULT_INIT_FILE="/vault/init.json"
VAULT_TOKEN_FILE="/vault/.vault_token"

# Start Vault server in background
echo "Starting Vault server..."
vault server -config="$VAULT_CONFIG_FILE" > "$VAULT_LOG_FILE" 2>&1 &
VAULT_PID=$!

export VAULT_ADDR="https://127.0.0.1:8200"
export VAULT_CACERT="/opt/vault/tls/tls.crt"

# Wait for Vault to be ready
RETRIES=30
until vault status &>/dev/null; do
    ((RETRIES--))
    [ $RETRIES -le 0 ] && { cat "$VAULT_LOG_FILE"; kill $VAULT_PID; exit 1; }
    echo "Vault is not ready yet. Retrying in 2 seconds..."
    sleep 2
done

echo "Vault is ready!"

# Initialize Vault if not initialized
if ! vault status | grep -q 'Initialized.*true'; then
    vault operator init -key-shares=5 -key-threshold=3 -format=json > "$VAULT_INIT_FILE"
fi

# Unseal Vault
if vault status | grep -q 'Sealed.*true'; then
    for i in 0 1 2; do
        KEY=$(jq -r ".unseal_keys_b64[$i]" "$VAULT_INIT_FILE")
        vault operator unseal "$KEY"
    done
fi

# Save root token
jq -r '.root_token' "$VAULT_INIT_FILE" > "$VAULT_TOKEN_FILE"
echo "Root token saved at $VAULT_TOKEN_FILE"

# Stop temporary background server
kill $VAULT_PID
sleep 2

# Launch Vault in foreground
exec vault server -config="$VAULT_CONFIG_FILE"
