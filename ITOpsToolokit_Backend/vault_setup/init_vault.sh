#!/bin/bash
set -e

# Paths
VAULT_CONFIG="/vault/vault.hcl"
TLS_DIR="/opt/vault/tls"

# Wait until TLS certs exist
echo "Checking TLS certificates..."
if [ ! -f "$TLS_DIR/tls.crt" ] || [ ! -f "$TLS_DIR/tls.key" ]; then
  echo "TLS certificates not found, generating..."
  /vault/generate_tls.sh
fi

# Start Vault in foreground
echo "Starting Vault server..."
exec vault server -config="$VAULT_CONFIG"
