#!/bin/bash
set -e

# Directories
TLS_DIR=/vault/certs
DATA_DIR=/vault/data

mkdir -p $TLS_DIR
mkdir -p $DATA_DIR

# Generate TLS certs if not exist
if [ ! -f $TLS_DIR/tls.crt ] || [ ! -f $TLS_DIR/tls.key ]; then
    echo "Generating TLS certificates..."
    openssl req -out $TLS_DIR/tls.crt -new -keyout $TLS_DIR/tls.key \
      -newkey rsa:4096 -nodes -sha256 -x509 \
      -subj "/O=VaultCompany/CN=vault.local" \
      -addext "subjectAltName = IP:0.0.0.0,DNS:vault.local" \
      -days 365
fi

# Vault configuration
VAULT_CONFIG=/vault/vault.hcl
cat > $VAULT_CONFIG <<EOF
ui = true
storage "file" {
  path = "$DATA_DIR"
}
listener "tcp" {
  address       = "0.0.0.0:8200"
  tls_cert_file = "$TLS_DIR/tls.crt"
  tls_key_file  = "$TLS_DIR/tls.key"
}
EOF

# Start Vault in background
vault server -config=$VAULT_CONFIG &

# Wait for Vault to start
echo "Waiting for Vault to start..."
sleep 10

# Set environment variables
export VAULT_ADDR="https://0.0.0.0:8200"
export VAULT_CACERT="$TLS_DIR/tls.crt"

# Check if already initialized
if vault status | grep -q "Initialized.*false"; then
    echo "Initializing Vault..."
    INIT_OUTPUT=$(vault operator init -key-shares=5 -key-threshold=3 -format=json)
    echo $INIT_OUTPUT > /vault/init_output.json

    UNSEAL_KEYS=$(echo $INIT_OUTPUT | jq -r '.unseal_keys_b64[]')
    ROOT_TOKEN=$(echo $INIT_OUTPUT | jq -r '.root_token')

    # Auto-unseal with first 3 keys
    for key in $(echo $UNSEAL_KEYS | head -3); do
        vault operator unseal $key
    done

    # Save root token
    echo $ROOT_TOKEN > /vault/.vault_root_token
    echo "Vault initialized and unsealed. Root token saved to /vault/.vault_root_token"
else
    echo "Vault already initialized."
fi

# Keep container running
tail -f /dev/null
