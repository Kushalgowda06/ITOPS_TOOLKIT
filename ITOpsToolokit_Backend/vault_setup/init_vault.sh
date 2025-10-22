#!/bin/bash
set -e

# Generate TLS if missing
if [ ! -f /opt/vault/tls/tls.crt ]; then
  ./generate_tls.sh
fi

# Start Vault server
vault server -config=/vault/vault.hcl &

# Wait for Vault to be ready
sleep 10

export VAULT_ADDR='https://0.0.0.0:8200'
export VAULT_CACERT='/opt/vault/tls/tls.crt'

# Initialize Vault if not already initialized
if ! vault status | grep -q 'Initialized.*true'; then
  echo "Initializing Vault..."
  vault operator init -key-shares=5 -key-threshold=3 -format=json > /vault/init.json
fi

# Unseal Vault with first 3 keys
for i in 0 1 2; do
  KEY=$(jq -r ".unseal_keys_b64[$i]" /vault/init.json)
  vault operator unseal $KEY
done

# Print initial root token
echo "Vault Root Token:"
jq -r '.root_token' /vault/init.json
