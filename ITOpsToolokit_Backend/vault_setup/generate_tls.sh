#!/bin/bash
mkdir -p vault_setup/tls vault_setup/data

openssl req -out vault_setup/tls/tls.crt \
  -new -keyout vault_setup/tls/tls.key \
  -newkey rsa:4096 -nodes -sha256 -x509 \
  -subj "/O=Cognizant/CN=RBAServer" \
  -addext "subjectAltName = IP:0.0.0.0,DNS:rba.cognizantgoc.com" \
  -days 365
