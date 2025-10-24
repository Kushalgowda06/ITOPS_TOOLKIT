#!/bin/bash
set -e

TLS_DIR="/opt/vault/tls"
mkdir -p "$TLS_DIR"
cd "$TLS_DIR"

# IPs for certificate SAN
PUBLIC_IP="3.6.96.101"
PRIVATE_IP="172.31.17.17"

echo "Generating TLS certificate with IPs: $PUBLIC_IP, $PRIVATE_IP, 127.0.0.1"

openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
  -keyout tls.key -out tls.crt \
  -subj "/O=Company/CN=VaultServer" \
  -addext "subjectAltName = IP:${PUBLIC_IP},IP:${PRIVATE_IP},IP:127.0.0.1,DNS:localhost"

chown -R 1000:1000 "$TLS_DIR"

echo "TLS certificate generated successfully at $TLS_DIR"
