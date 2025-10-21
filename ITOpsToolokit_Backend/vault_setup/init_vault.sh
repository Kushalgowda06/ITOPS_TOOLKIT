#!/bin/bash

export VAULT_ADDR='https://vault.local:8200'
export VAULT_CACERT='/opt/vault/tls/tls.crt'

echo "Initializing Vault..."
vault operator init -key-shares=5 -key-threshold=3 > /opt/vault/init.txt

# Extract unseal keys and root token
keys=$(grep 'Unseal Key' /opt/vault/init.txt | awk '{print $NF}')
token=$(grep 'Initial Root Token' /opt/vault/init.txt | awk '{print $NF}')

echo "Unsealing Vault..."
i=0
for key in $keys; do
  vault operator unseal $key
  i=$((i+1))
  [ $i -eq 3 ] && break
done

echo "Logging in with root token..."
vault login $token

echo "Enabling KV secrets engine..."
vault secrets enable -path=secret kv

echo "Adding secrets..."
vault kv put secret/Platform_SNOW snow_user=your_user snow_password=your_pass
vault kv put secret/cfs_problem_tickets db_user=db_user db_password=db_pass

echo "Vault initialization complete."
