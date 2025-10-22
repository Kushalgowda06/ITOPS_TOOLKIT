#!/bin/bash
set -e

echo "Starting Vault server (background)..."
vault server -config=/vault/config/vault.hcl &
VAULT_PID=$!
sleep 5

if ! vault status >/dev/null 2>&1; then
  echo "Initializing Vault..."
  vault operator init -key-shares=5 -key-threshold=3 > /vault/init.txt
else
  echo "Vault already initialized."
fi

echo "Unsealing Vault..."
grep 'Unseal Key' /vault/init.txt | head -n 3 | awk '{print $NF}' | while read key; do
  vault operator unseal "$key"
done

grep 'Initial Root Token' /vault/init.txt | awk '{print $NF}' > /vault/.vault_token

echo "Vault initialized and unsealed successfully!"
kill $VAULT_PID
sleep 2

echo "Starting Vault in foreground..."
exec vault server -config=/vault/config/vault.hcl
