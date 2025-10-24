#!/bin/bash
set -e

CERT_DIR="/opt/vault/tls"
mkdir -p "$CERT_DIR"
cd "$CERT_DIR"

# Use server private IP directly
SERVER_IP="172.31.17.17"

echo "Generating TLS certificate with IP: $SERVER_IP..."

# Generate self-signed certificate with SAN
openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
  -keyout tls.key -out tls.crt \
  -subj "/O=Company/CN=VaultServer" \
  -addext "subjectAltName = IP:${SERVER_IP},IP:127.0.0.1,DNS:localhost"

chown -R 1000:1000 "$CERT_DIR"
echo "TLS certificate generated at $CERT_DIR"
