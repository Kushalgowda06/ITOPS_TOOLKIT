#!/bin/bash
set -e

CERT_DIR="/vault/tls"
mkdir -p "$CERT_DIR"
cd "$CERT_DIR"

# Try to fetch EC2 public IP; fallback to 127.0.0.1 if empty
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 || true)
if [ -z "$EC2_IP" ]; then
    EC2_IP="127.0.0.1"
fi

echo "Using IP: $EC2_IP for TLS certificate"

# Generate self-signed certificate with SAN
openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
  -keyout tls.key -out tls.crt \
  -subj "/O=Company/CN=VaultServer" \
  -addext "subjectAltName = IP:${EC2_IP},IP:127.0.0.1,DNS:localhost"

# The user is root, but we ensure permissions are safe
chown -R 1000:1000 "$CERT_DIR" || true

echo "TLS certificate generated successfully at $CERT_DIR"
