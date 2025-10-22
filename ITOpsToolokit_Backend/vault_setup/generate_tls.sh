#!/bin/sh
# Generates TLS certs for Vault
set -e

mkdir -p /vault/certs

# Self-signed certificate
openssl req -out /vault/certs/tls.crt -new -keyout /vault/certs/tls.key \
  -newkey rsa:4096 -nodes -sha256 -x509 \
  -subj "/O=cognizant/CN=RBAServer" \
  -addext "subjectAltName = IP:0.0.0.0,DNS:rba.cognizantgoc.com" \
  -days 365

chmod 644 /vault/certs/tls.crt /vault/certs/tls.key
