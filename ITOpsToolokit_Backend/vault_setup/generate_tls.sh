#!/bin/bash
set -e

CERT_DIR="/home/ubuntu/vault_setup/tls"
mkdir -p "$CERT_DIR"
cd "$CERT_DIR"

EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 || true)
[ -z "$EC2_IP" ] && EC2_IP="127.0.0.1"

echo "Using IP: $EC2_IP for TLS certificate"

openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
  -keyout tls.key -out tls.crt \
  -subj "/O=Company/CN=VaultServer" \
  -addext "subjectAltName = IP:${EC2_IP},IP:127.0.0.1,DNS:localhost"

chmod 644 tls.crt tls.key
echo "TLS certificate generated at $CERT_DIR"
