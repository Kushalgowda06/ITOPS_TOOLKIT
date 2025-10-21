#!/bin/sh

# Wait for Vault to be ready
sleep 5

export VAULT_ADDR=https://vault.local:8200
export VAULT_CACERT=/opt/vault/tls/tls.crt

# Initialize Vault if not already initialized
if vault status | grep -q 'Initialized.*false'; then
  echo "Initializing Vault..."
  vault operator init -key-shares=5 -key-threshold=3 -format=json > /opt/vault/init.json
  cat /opt/vault/init.json | jq -r '.unseal_keys_b64[0]' | xargs vault operator unseal
  cat /opt/vault/init.json | jq -r '.unseal_keys_b64[1]' | xargs vault operator unseal
  cat /opt/vault/init.json | jq -r '.unseal_keys_b64[2]' | xargs vault operator unseal
fi
