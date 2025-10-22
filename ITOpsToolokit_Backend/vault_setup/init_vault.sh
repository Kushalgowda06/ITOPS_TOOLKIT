#!/bin/sh

# Set Vault config path
export VAULT_ADDR="https://0.0.0.0:8200"
export VAULT_CACERT="/opt/vault/tls/tls.crt"

# Start Vault in server mode
vault server -config=/vault/config/vault.hcl &
VAULT_PID=$!

# Wait for Vault to start
sleep 10

# Check Vault status
vault status

# Keep container running
wait $VAULT_PID
