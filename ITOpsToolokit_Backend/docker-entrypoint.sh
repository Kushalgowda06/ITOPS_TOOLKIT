#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/app"
CONFIG_DIR="${APP_DIR}/config"
TOKEN_FILE="${CONFIG_DIR}/.vault_token"

if [ -n "${VAULT_TOKEN:-}" ]; then
  mkdir -p "${CONFIG_DIR}"
  printf '%s\n' "${VAULT_TOKEN}" > "${TOKEN_FILE}"
elif [ ! -f "${TOKEN_FILE}" ]; then
  mkdir -p "${CONFIG_DIR}"
  touch "${TOKEN_FILE}"
fi

exec "$@"
