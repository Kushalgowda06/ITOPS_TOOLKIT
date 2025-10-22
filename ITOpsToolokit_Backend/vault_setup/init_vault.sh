#!/bin/bash

vault server -config=/vault/config/vault.hcl &
sleep 5

vault status || vault operator init -key-shares=5 -key-threshold=3 > /vault/init.txt

grep 'Unseal Key' /vault/init.txt | head -n 3 | awk '{print $NF}' | while read key; do
  vault operator unseal "$key"
done

grep 'Initial Root Token' /vault/init.txt | awk '{print $NF}' > /vault/.vault_token

wait
