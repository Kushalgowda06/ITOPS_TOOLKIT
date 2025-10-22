#!/bin/bash
set -e

VAULT_ADDR="https://127.0.0.1:8200"
VAULT_CERT="./tls/tls.crt"

export VAULT_ADDR
export VAULT_CACERT="$VAULT_CERT"

echo "Checking Vault status..."
vault status || true

# Initialize Vault only if not already initialized
if ! vault operator init -check; then
  echo "Initializing Vault..."
  vault operator init -key-shares=5 -key-threshold=3 -format=json > vault_init.json

  UNSEAL_KEYS=$(jq -r '.unseal_keys_b64[]' vault_init.json)
  ROOT_TOKEN=$(jq -r '.root_token' vault_init.json)

  echo "Unsealing Vault..."
  for key in $UNSEAL_KEYS; do
    vault operator unseal $key || true
  done

  echo "Vault initialized and unsealed."
  echo "Root Token: $ROOT_TOKEN"
else
  echo "Vault is already initialized."
fi
