#!/bin/bash

export VAULT_ADDR='https://vault.local:8200'
export VAULT_CACERT='./vault_setup/tls/tls.crt'

vault operator init -key-shares=5 -key-threshold=3 > vault_setup/init.txt

keys=$(grep 'Unseal Key' vault_setup/init.txt | awk '{print $NF}')
token=$(grep 'Initial Root Token' vault_setup/init.txt | awk '{print $NF}')

i=0
for key in $keys; do
  vault operator unseal $key
  i=$((i+1))
  [ $i -eq 3 ] && break
done

vault login $token

vault secrets enable -path=secret kv

vault kv put secret/Platform_SNOW snow_user=your_user snow_password=your_pass
vault kv put secret/cfs_problem_tickets db_user=db_user db_password=db_pass
