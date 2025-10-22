#!/bin/bash
set -e

CERT_DIR="/opt/vault/tls"
mkdir -p $CERT_DIR
cd $CERT_DIR

# Generate self-signed certificate
openssl req -out tls.crt -new -keyout tls.key -newkey rsa:4096 -nodes -sha256 -x509 \
  -subj "/O=Company/CN=VaultServer" \
  -addext "subjectAltName = IP:0.0.0.0,DNS:vault.local" \
  -days 365

chown -R 1000:1000 $CERT_DIR
