# Use official Vault image
FROM hashicorp/vault:1.14.3

WORKDIR /vault

USER root

RUN mkdir -p /vault/config

# Install required packages regardless of base (Debian/UBI/Alpine)
# We only require: bash, ca-certificates, curl, openssl
RUN set -eux; \
    if command -v apt-get >/dev/null 2>&1; then \
      apt-get update; \
      apt-get install -y --no-install-recommends bash ca-certificates curl openssl; \
      rm -rf /var/lib/apt/lists/*; \
    elif command -v microdnf >/dev/null 2>&1; then \
      microdnf install -y bash ca-certificates curl openssl; \
      microdnf clean all; \
    elif command -v dnf >/dev/null 2>&1; then \
      dnf install -y bash ca-certificates curl openssl; \
      dnf clean all; \
    elif command -v apk >/dev/null 2>&1; then \
      apk add --no-cache bash ca-certificates curl openssl; \
    else \
      echo "No supported package manager found (apt, microdnf, dnf, apk)" >&2; \
      exit 1; \
    fi

# Copy Vault configuration and scripts
COPY vault.hcl /vault/vault.hcl
COPY init_vault.sh /vault/init_vault.sh
COPY generate_tls.sh /vault/generate_tls.sh

# Make scripts executable
RUN chmod +x /vault/init_vault.sh /vault/generate_tls.sh

ENTRYPOINT ["/vault/init_vault.sh"]
