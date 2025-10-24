#!/bin/bash
set -e

CERT_DIR="/opt/vault/tls"
DATA_DIR="/opt/vault/data"
INIT_FILE="/vault/init.json"
TOKEN_FILE="/vault/.vault_token"

mkdir -p "$CERT_DIR" "$DATA_DIR"

# Generate TLS cert if it doesn't exist
if [ ! -f "$CERT_DIR/tls.crt" ] || [ ! -f "$CERT_DIR/tls.key" ]; then
    echo "Generating TLS certificate..."
    EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 || echo "127.0.0.1")
    openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
      -keyout "$CERT_DIR/tls.key" -out "$CERT_DIR/tls.crt" \
      -subj "/O=Company/CN=VaultServer" \
      -addext "subjectAltName = IP:${EC2_IP},IP:127.0.0.1,DNS:localhost"
fi

export VAULT_ADDR="https://0.0.0.0:8200"
export VAULT_CACERT="$CERT_DIR/tls.crt"

# Start Vault in background
vault server -config=/vault/config/vault.hcl > /vault/vault.log 2>&1 &
VAULT_PID=$!

# Wait for Vault to be ready
echo "Waiting for Vault to become ready..."
RETRIES=30
until vault status &>/dev/null; do
    if [ $RETRIES -le 0 ]; then
        echo "Vault failed to start. Check /vault/vault.log"
        kill $VAULT_PID || true
        exit 1
    fi
    echo "Vault is not ready yet. Retrying in 2 seconds..."
    sleep 2
    ((RETRIES--))
done

# Initialize Vault if not already initialized
if ! vault status | grep -q 'Initialized.*true'; then
    echo "Initializing Vault..."
    vault operator init -key-shares=5 -key-threshold=3 -format=json > "$INIT_FILE"
fi

# Unseal Vault using first 3 keys
if vault status | grep -q 'Sealed.*true'; then
    echo "Unsealing Vault..."
    for i in 0 1 2; do
        KEY=$(jq -r ".unseal_keys_b64[$i]" "$INIT_FILE")
        vault operator unseal "$KEY"
    done
fi

# Save root token
ROOT_TOKEN=$(jq -r '.root_token' "$INIT_FILE")
echo "$ROOT_TOKEN" > "$TOKEN_FILE"

echo "Vault is up and unsealed!"
echo "Root token saved to $TOKEN_FILE"
# Optional: display token (remove in production)
echo "Root Token: $ROOT_TOKEN"

# Stop background server and restart in foreground
kill $VAULT_PID || true
exec vault server -config=/vault/config/vault.hcl
