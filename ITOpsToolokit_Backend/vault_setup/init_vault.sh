#!/bin/sh

export VAULT_ADDR=https://3.6.96.101:8200
export VAULT_CACERT=/opt/vault/tls/certfile.pem

# Wait for Vault to be ready
sleep 5

# Initialize Vault if not already initialized
if vault status 2>&1 | grep -q 'Initialized.*false'; then
  echo "Initializing Vault..."
  vault operator init -key-shares=5 -key-threshold=3 -format=json > /opt/vault/init.json

  cat /opt/vault/init.json | jq -r '.unseal_keys_b64[0]' | xargs vault operator unseal
  cat /opt/vault/init.json | jq -r '.unseal_keys_b64[1]' | xargs vault operator unseal
  cat /opt/vault/init.json | jq -r '.unseal_keys_b64[2]' | xargs vault operator unseal

  echo "Vault initialized and unsealed."

  echo "Logging in with root token..."
  export VAULT_TOKEN=$(cat /opt/vault/init.json | jq -r '.root_token')

  echo "Enabling KV secrets engine..."
  vault secrets enable -path=secret kv

  echo "Adding secrets..."
  vault kv put secret/Platform_SNOW snow_user=admin snow_password=changeme
  vault kv put secret/cfs_problem_tickets db_user=dbadmin db_password=dbpass
else
  echo "Vault is already initialized. Skipping initialization."
fi
