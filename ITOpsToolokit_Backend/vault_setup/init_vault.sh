#!/bin/bash

export VAULT_ADDR='https://rba.cognizantgoc.com:8200'
export VAULT_CACERT='/vault/tls/tls.crt'

vault status || vault operator init -key-shares=5 -key-threshold=3 > /vault/init.txt

# Unseal using first 3 keys
grep 'Unseal Key' /vault/init.txt | head -n 3 | awk '{print $NF}' | while read key; do
  vault operator unseal "$key"
done

# Save root token
grep 'Initial Root Token' /vault/init.txt | awk '{print $NF}' > /vault/.vault_token
``
