#!/bin/bash
set -e

# Start Vault in background to initialize
vault server -config=/vault/config/vault.hcl &
VAULT_PID=$!
sleep 5

# Initialize Vault if not already initialized
if ! vault status >/dev/null 2>&1; then
  echo "Initializing Vault..."
  vault operator init -key-shares=5 -key-threshold=3 > /vault/init.txt
else
  echo "Vault already initialized."
fi

# Unseal using first 3 keys
grep 'Unseal Key' /vault/init.txt | head -n 3 | awk '{print $NF}' | while read key; do
  vault operator unseal "$key"
done

# Save root token
grep 'Initial Root Token' /vault/init.txt | awk '{print $NF}' > /vault/.vault_token

# Kill background Vault process
kill $VAULT_PID
sleep 2

# Start Vault in foreground (keeps container alive)
exec vault server -config=/vault/config/vault.hcl
