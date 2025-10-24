#!/bin/bash
set -e

CERT_DIR="/opt/vault/tls"
mkdir -p "$CERT_DIR"

# Generate TLS cert if it doesn't exist
if [ ! -f "$CERT_DIR/tls.crt" ] || [ ! -f "$CERT_DIR/tls.key" ]; then
    echo "Generating TLS certificate..."
    EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 || echo "127.0.0.1")
    openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
      -keyout "$CERT_DIR/tls.key" -out "$CERT_DIR/tls.crt" \
      -subj "/O=Company/CN=VaultServer" \
      -addext "subjectAltName = IP:${EC2_IP},IP:127.0.0.1,DNS:localhost"
fi

# Start Vault server in foreground
exec vault server -config=/vault/config/vault.hcl
