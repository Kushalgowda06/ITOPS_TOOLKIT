#!/bin/bash
mkdir -p vault_setup/tls vault_setup/data

openssl req -out vault_setup/tls/tls.crt \
  -new -keyout vault_setup/tls/tls.key \
  -newkey rsa:4096 -nodes -sha256 -x509 \
  -subj "/O=YourCompany/CN=vault.local" \
  -addext "subjectAltName = IP:127.0.0.1,DNS:vault.local" \
  -days 365
