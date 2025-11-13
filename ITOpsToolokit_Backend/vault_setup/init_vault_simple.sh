#!/bin/bash
set -e

echo "Starting Vault in dev mode..."
exec vault server -dev -dev-listen-address=0.0.0.0:8200 -dev-root-token-id=root