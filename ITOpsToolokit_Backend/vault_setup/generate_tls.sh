#!/bin/bash
set -e

CERT_DIR="/opt/vault/tls"
mkdir -p "$CERT_DIR"
cd "$CERT_DIR"

# Use fixed EC2 IP
EC2_IP="3.6.96.101"
echo "Using IP: $EC2_IP for TLS certificate"

# Generate self-signed certificate with SAN
openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
  -keyout tls.key -out tls.crt \
  -subj "/O=Company/CN=VaultServer" \
  -addext "subjectAltName = IP:${EC2_IP},IP:127.0.0.1,DNS:localhost"

chown -R 1000:1000 "$CERT_DIR"

echo "TLS certificate generated successfully at $CERT_DIR"
