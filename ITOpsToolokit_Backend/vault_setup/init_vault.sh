#!/bin/bash

# Start Vault server in the background
vault server -config=/vault/config/vault.hcl &

# Wait for Vault to come up (adjust sleep time if necessary)
sleep 5 

# Now perform init/unseal using inherited VAULT_ADDR and VAULT_CACERT
vault status || vault operator init -key-shares=5 -key-threshold=3 > /vault/init.txt

# Unseal using first 3 keys
grep 'Unseal Key' /vault/init.txt | head -n 3 | awk '{print $NF}' | while read key; do
  vault operator unseal "$key"
done

# Save root token
grep 'Initial Root Token' /vault/init.txt | awk '{print $NF}' > /vault/.vault_token

# Keep the container running (wait for the background process)
wait
