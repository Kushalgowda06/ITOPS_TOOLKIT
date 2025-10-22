#!/bin/bash

# NOTE: The previous script started Vault in the background (&) and then ran 
# initialization. This is prone to error and container shutdown.

# To simplify and ensure the container runs, we'll try to initialize first 
# while Vault is still sealing/uninitialized, and then launch the final server.

# Start Vault server in the background for initialization
vault server -config=/vault/config/vault.hcl &
VAULT_PID=$! # Capture the Vault server process ID
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

# *** CHANGE 1: Launch the Vault server in the FOREGROUND using 'exec'. ***
# This replaces the shell process with the Vault process, keeping the container running indefinitely.
exec vault server -config=/vault/config/vault.hcl
