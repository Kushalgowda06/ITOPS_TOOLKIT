#!/bin/bash
set -e

CERT_DIR="./tls"
mkdir -p "$CERT_DIR"

echo "Generating TLS certificate..."
openssl req -out "$CERT_DIR/tls.crt" -new -keyout "$CERT_DIR/tls.key" \
  -newkey rsa:4096 -nodes -sha256 -x509 \
  -subj "/O=Cognizant/CN=rba.cognizantgoc.com" \
  -addext "subjectAltName=IP:0.0.0.0,DNS:rba.cognizantgoc.com" \
  -days 365

echo "TLS certificate generated at $CERT_DIR/tls.crt and $CERT_DIR/tls.key"
