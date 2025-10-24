#!/bin/bash
set -e

TLS_DIR=${1:-/opt/vault/tls}

mkdir -p "$TLS_DIR"
cd "$TLS_DIR"

# Use your server IP
SERVER_IP="3.6.96.101"

openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
  -keyout tls.key -out tls.crt \
  -subj "/O=Company/CN=VaultServer" \
  -addext "subjectAltName = IP:${SERVER_IP},IP:127.0.0.1,DNS:localhost"

chown -R 1000:1000 "$TLS_DIR"
echo "TLS certificate generated at $TLS_DIR"
