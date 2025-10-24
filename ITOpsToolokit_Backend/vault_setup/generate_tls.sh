#!/bin/bash
set -e

CERT_DIR="/opt/vault/tls"
mkdir -p "$CERT_DIR"
cd "$CERT_DIR"

# Define IPs explicitly
PUBLIC_IP="3.6.96.101"
PRIVATE_IP="172.31.17.17"
LOCAL_IP="127.0.0.1"

echo "Generating TLS certificate with IPs: $PUBLIC_IP, $PRIVATE_IP, $LOCAL_IP"

# Generate self-signed certificate with SAN
openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
  -keyout tls.key -out tls.crt \
  -subj "/O=Company/CN=VaultServer" \
  -addext "subjectAltName = IP:${PUBLIC_IP},IP:${PRIVATE_IP},IP:${LOCAL_IP},DNS:localhost"

# Set ownership (Vault runs as UID 1000)
chown -R 1000:1000 "$CERT_DIR"

echo "TLS certificate generated successfully at $CERT_DIR"
