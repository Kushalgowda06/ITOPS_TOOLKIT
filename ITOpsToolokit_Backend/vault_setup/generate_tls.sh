#!/bin/bash
set -e

CERT_DIR="/opt/vault/tls"
mkdir -p "$CERT_DIR"

# Add your server's IPs
IP_LIST=("3.6.96.101" "172.31.17.17" "127.0.0.1")

# Only generate if cert/key don't exist
if [ ! -f "$CERT_DIR/tls.crt" ] || [ ! -f "$CERT_DIR/tls.key" ]; then
    SAN=""

    for ip in "${IP_LIST[@]}"; do
        SAN+="IP:${ip},"
    done

    # Remove trailing comma
    SAN=${SAN%,}

    echo "Generating TLS certificate with IPs: ${IP_LIST[*]}"

    openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
        -keyout "$CERT_DIR/tls.key" \
        -out "$CERT_DIR/tls.crt" \
        -subj "/O=Company/CN=VaultServer" \
        -addext "subjectAltName=${SAN}"

    chown -R 1000:1000 "$CERT_DIR"

    echo "TLS certificate generated successfully at $CERT_DIR"
else
    echo "TLS certificates already exist, skipping generation."
fi
