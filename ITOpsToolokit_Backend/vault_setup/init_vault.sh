#!/bin/bash
set -e

# Paths
VAULT_CONFIG_FILE="/vault/vault.hcl"
VAULT_LOG_FILE="/vault/vault.log"
VAULT_TLS_DIR="/opt/vault/tls"

# Generate TLS if not exists
if [ ! -f "$VAULT_TLS_DIR/tls.crt" ] || [ ! -f "$VAULT_TLS_DIR/tls.key" ]; then
    echo "Generating TLS certificate..."
    mkdir -p "$VAULT_TLS_DIR"
    chmod +x /vault/generate_tls.sh
    /vault/generate_tls.sh "$VAULT_TLS_DIR"
fi

# Start Vault in background
echo "Starting Vault server..."
vault server -config="$VAULT_CONFIG_FILE" > "$VAULT_LOG_FILE" 2>&1 &
VAULT_PID=$!

# Set client env
export VAULT_ADDR="https://3.6.96.101:8200"
export VAULT_CACERT="$VAULT_TLS_DIR/tls.crt"

# Wait for Vault to be ready
RETRIES=30
until vault status &>/dev/null; do
    if [ $RETRIES -le 0 ]; then
        echo "Vault failed to start. Logs:"
        cat "$VAULT_LOG_FILE"
        kill $VAULT_PID || true
        exit 1
    fi
    echo "Vault is not ready yet. Retrying in 2 seconds..."
    sleep 2
    ((RETRIES--))
done

echo "Vault is up and running!"

# Initialize and unseal if needed
INIT_FILE="/vault/init.json"
TOKEN_FILE="/vault/.vault_token"

if ! vault status | grep -q 'Initialized.*true'; then
    echo "Initializing Vault..."
    vault operator init -key-shares=5 -key-threshold=3 -format=json > "$INIT_FILE"
fi

if vault status | grep -q 'Sealed.*true'; then
    echo "Unsealing Vault..."
    for i in 0 1 2; do
        KEY=$(jq -r ".unseal_keys_b64[$i]" "$INIT_FILE")
        vault operator unseal "$KEY"
    done
fi

ROOT_TOKEN=$(jq -r '.root_token' "$INIT_FILE")
echo "$ROOT_TOKEN" > "$TOKEN_FILE"
echo "Root Token saved to $TOKEN_FILE"
echo "Root Token: $ROOT_TOKEN"

# Bring Vault to foreground
kill $VAULT_PID || true
exec vault server -config="$VAULT_CONFIG_FILE"
