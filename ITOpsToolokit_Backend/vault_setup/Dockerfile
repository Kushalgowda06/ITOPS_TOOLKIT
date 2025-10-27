# Use official Vault image
FROM hashicorp/vault:1.14.3

WORKDIR /vault

USER root

RUN mkdir -p /vault/config

# Install required packages (image is Debian-based)
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
      bash \
      ca-certificates \
      curl \
      jq \
      openssl; \
    rm -rf /var/lib/apt/lists/*

# Copy Vault configuration and scripts
COPY vault.hcl /vault/vault.hcl
COPY init_vault.sh /vault/init_vault.sh
COPY generate_tls.sh /vault/generate_tls.sh

# Make scripts executable
RUN chmod +x /vault/init_vault.sh /vault/generate_tls.sh

ENTRYPOINT ["/vault/init_vault.sh"]
