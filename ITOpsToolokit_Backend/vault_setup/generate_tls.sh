#!/bin/bash
set -euo pipefail

CERT_DIR="/opt/vault/tls"
mkdir -p "$CERT_DIR"

# Environment overrides (comma or space separated)
# Example:
#   TLS_IPS="203.0.113.10,10.0.1.5,127.0.0.1"
#   TLS_DNS="rba.cognizantgoc.com,localhost"
#   TLS_CN="rba.cognizantgoc.com"
TLS_IPS_RAW=${TLS_IPS:-"127.0.0.1"}
TLS_DNS_RAW=${TLS_DNS:-""}
TLS_CN_VAL=${TLS_CN:-"VaultServer"}

# Only generate if cert/key don't exist
if [ ! -f "$CERT_DIR/tls.crt" ] || [ ! -f "$CERT_DIR/tls.key" ]; then
    # Normalize separators to spaces
    TLS_IPS_LIST=$(echo "$TLS_IPS_RAW" | tr ',' ' ' | xargs -n1 | tr '\n' ' ')
    TLS_DNS_LIST=$(echo "$TLS_DNS_RAW" | tr ',' ' ' | xargs -n1 | tr '\n' ' ')

    SAN_ENTRIES=()
    if [ -n "$TLS_IPS_LIST" ]; then
      for ip in $TLS_IPS_LIST; do
        # Skip obviously invalid placeholder IPs
        if [ "$ip" != "0.0.0.0" ] && [ -n "$ip" ]; then
          SAN_ENTRIES+=("IP:$ip")
        fi
      done
    fi

    if [ -n "$TLS_DNS_LIST" ]; then
      for dns in $TLS_DNS_LIST; do
        SAN_ENTRIES+=("DNS:$dns")
      done
    fi

    SAN="$(IFS=, ; echo "${SAN_ENTRIES[*]}")"

    echo "Generating TLS certificate"
    echo "  CN:  $TLS_CN_VAL"
    echo "  SAN: $SAN"

    # Create keypair and self-signed cert with SANs
    openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
      -keyout "$CERT_DIR/tls.key" \
      -out "$CERT_DIR/tls.crt" \
      -subj "/O=Company/CN=$TLS_CN_VAL" \
      -addext "subjectAltName=$SAN"

    # Ensure Vault process can read the keypair if running as non-root
    if id vault &>/dev/null; then
      chown -R vault:vault "$CERT_DIR"
    fi
    chmod 640 "$CERT_DIR/tls.key"
    chmod 644 "$CERT_DIR/tls.crt"

    echo "TLS certificate generated successfully at $CERT_DIR"
else
    echo "TLS certificates already exist, skipping generation."
fi
