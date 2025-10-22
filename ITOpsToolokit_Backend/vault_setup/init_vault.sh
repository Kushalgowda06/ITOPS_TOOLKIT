#!/bin/bash

# Start Vault server in the background for initialization
vault server -config=/vault/config/vault.hcl &
VAULT_PID=$!
sleep 5

# Initialize Vault if not already initialized
vault status || vault operator init -key-shares=5 -key-threshold=3 > /vault/init.txt

# Unseal using first 3 keys
grep 'Unseal Key' /vault/init.txt | head -n 3 | awk '{print $NF}' | while read key; do
  vault operator unseal "$key"
done

# Save root token
grep 'Initial Root Token' /vault/init.txt | awk '{print $NF}' > /vault/.vault_token

# Kill the temporary background server process
kill $VAULT_PID
sleep 2

# FIX: Launch the Vault server in the FOREGROUND using 'exec' to run as PID 1
exec vault server -config=/vault/config/vault.hcl
