# Use official Vault image as base
FROM hashicorp/vault:1.14.3

# Set working directory inside container
WORKDIR /vault

# Install dependencies needed for your scripts
# (openssl for TLS, jq for parsing JSON)
USER root
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    openssl \
    jq \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Copy Vault configuration and scripts
COPY vault.hcl /vault/vault.hcl
COPY init_vault.sh /vault/init_vault.sh
COPY generate_tls.sh /vault/generate_tls.sh

# Make scripts executable
RUN chmod +x /vault/init_vault.sh /vault/generate_tls.sh

# Ensure scripts use bash
RUN sed -i '1s|^.*$|#!/bin/bash|' /vault/init_vault.sh
RUN sed -i '1s|^.*$|#!/bin/bash|' /vault/generate_tls.sh

# Expose Vault ports
EXPOSE 8200 8201

# Run Vault initialization script as entrypoint
ENTRYPOINT ["/vault/init_vault.sh"]
