#!/bin/bash
set -e

CERT_DIR="/opt/vault/tls"
mkdir -p $CERT_DIR
cd $CERT_DIR

# Fetch EC2 public IP (fallback to localhost if unavailable)
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 || echo "127.0.0.1")

# Generate self-signed certificate with SANs
openssl req -out tls.crt -new -keyout tls.key -newkey rsa:4096 -nodes -sha256 -x509 \
  -subj "/O=Company/CN=VaultServer" \
  -addext "subjectAltName = IP:${EC2_IP},IP:127.0.0.1,DNS:localhost" \
  -days 365

chown -R 1000:1000 $CERT_DIR
