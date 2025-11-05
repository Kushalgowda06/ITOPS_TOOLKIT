#!/usr/bin/env bash
set -e

# Ensure Vault token file is available if provided via environment variable
if [ -n "$VAULT_TOKEN" ]; then
  mkdir -p /app/config
  echo -n "$VAULT_TOKEN" > /app/config/.vault_token
fi

exec "$@"
