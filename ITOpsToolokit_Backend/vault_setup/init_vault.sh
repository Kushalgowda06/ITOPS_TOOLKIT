#!/bin/bash
set -e

echo "**** Starting Vault Deployment ****"

# Set Vault environment variables
export VAULT_ADDR="https://127.0.0.1:8200"
export VAULT_CACERT="/opt/vault/tls/tls.crt"

# Start Vault server in background
vault server -config=/vault/config/vault.hcl > /vault/vault.log 2>&1 &
VAULT_PID=$!

# Wait until Vault is ready
echo "Waiting for Vault to become ready..."
RETRIES=30
until vault status &>/dev/null; do
    if [ $RETRIES -le 0 ]; then
        echo "Vault failed to start. Check logs:"
        cat /vault/vault.log
        kill $VAULT_PID 2>/dev/null || true
        exit 1
    fi
    echo "Vault is not ready yet. Retrying in 2 seconds..."
    sleep 2
    ((RETRIES--))
done

echo "Vault is up and running!"

# Initialize Vault if not already initialized
if ! vault status | grep -q 'Initialized.*true'; then
    echo "Initializing Vault..."
    vault operator init -key-shares=5 -key-threshold=3 -format=json > /vault/init.json
fi

# Unseal Vault if sealed
if vault status | grep -q 'Sealed.*true'; then
    echo "Unsealing Vault..."
    for i in 0 1 2; do
        KEY=$(jq -r ".unseal_keys_b64[$i]" /vault/init.json)
        vault operator unseal "$KEY"
    done
fi

ROOT_TOKEN=$(jq -r '.root_token' /vault/init.json)
echo "$ROOT_TOKEN" > /vault/.vault_token

echo "Vault Deployment Complete"
echo "Root Token saved to /vault/.vault_token"
echo "Root Token: $ROOT_TOKEN"

# Keep Vault running in foreground
wait $VAULT_PID
