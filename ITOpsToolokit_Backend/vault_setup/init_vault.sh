#!/bin/bash
set -e

VAULT_ADDR="https://rba.cognizantgoc.com:8200"
TLS_DIR="/vault/certs"
DATA_DIR="/vault/data"

# Generate TLS certs if missing
if [ ! -f "$TLS_DIR/tls.crt" ] || [ ! -f "$TLS_DIR/tls.key" ]; then
    echo "Generating TLS certificates..."
    mkdir -p $TLS_DIR
    openssl req -out $TLS_DIR/tls.crt -new -keyout $TLS_DIR/tls.key \
        -newkey rsa:4096 -nodes -sha256 -x509 \
        -subj "/O=Cognizant/CN=RBAServer" \
        -addext "subjectAltName = IP:0.0.0.0,DNS:rba.cognizantgoc.com" \
        -days 365
fi

# Start Vault in server mode in the background
vault server -config=/vault/config/vault.hcl &

# Wait for Vault to be up
echo "Waiting for Vault to start..."
sleep 10

export VAULT_ADDR=$VAULT_ADDR
export VAULT_CACERT="$TLS_DIR/tls.crt"

# Check if Vault is already initialized
if ! vault status | grep -q "Initialized.*true"; then
    echo "Initializing Vault..."
    vault operator init -key-shares=5 -key-threshold=3 > /vault/init_output.txt
    cat /vault/init_output.txt

    # Unseal Vault automatically using first 3 keys
    KEYS=$(grep 'Unseal Key' /vault/init_output.txt | awk '{print $4}')
    i=0
    for key in $KEYS; do
        if [ $i -lt 3 ]; then
            vault operator unseal $key
            i=$((i+1))
        fi
    done
fi

echo "Vault is initialized and unsealed."
tail -f /vault/logs/vault.log
