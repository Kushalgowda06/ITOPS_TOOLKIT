# -----------------------------------------------
# Dockerfile for Vault production deployment
# -----------------------------------------------
FROM hashicorp/vault:latest

# Create directories
RUN mkdir -p /vault/config /vault/file /vault/logs /vault/certs

# Copy Vault configuration and init script
COPY vault.hcl /vault/config/vault.hcl
COPY init_vault.sh /vault/init_vault.sh

# Copy TLS certificates
COPY tls /vault/certs

# Fix line endings and set execute permission
RUN chmod +x /vault/init_vault.sh \
    && chmod 644 /vault/config/vault.hcl \
    && chmod 644 /vault/certs/*

# Expose Vault ports
EXPOSE 8200 8201

# Run init_vault.sh as the entrypoint
ENTRYPOINT ["/vault/init_vault.sh"]
