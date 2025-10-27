#!/bin/bash
set -euo pipefail

# Paths
VAULT_CONFIG="/vault/vault.hcl"
TLS_DIR="/opt/vault/tls"

# Optional env for TLS generation
export TLS_IPS="${TLS_IPS:-}"
export TLS_DNS="${TLS_DNS:-}"
export TLS_CN="${TLS_CN:-}"

echo "Checking TLS certificates..."
if [ ! -f "$TLS_DIR/tls.crt" ] || [ ! -f "$TLS_DIR/tls.key" ]; then
  echo "TLS certificates not found, generating..."
  /vault/generate_tls.sh
fi

# Set Vault addresses
export VAULT_API_ADDR=${VAULT_API_ADDR:-"https://0.0.0.0:8200"}
export VAULT_CLUSTER_ADDR=${VAULT_CLUSTER_ADDR:-"https://0.0.0.0:8201"}

echo "Starting Vault server..."
exec vault server -config="$VAULT_CONFIG"
