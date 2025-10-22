# Use official Vault image (Alpine-based)
FROM hashicorp/vault:latest

# Create directories for Vault
RUN mkdir -p /vault/config /vault/file /vault/logs /vault/certs

# Copy Vault config and init script
COPY vault.hcl /vault/config/vault.hcl
COPY init_vault.sh /vault/init_vault.sh

# Fix line endings and set executable permission
RUN apk add --no-cache dos2unix \
    && dos2unix /vault/init_vault.sh \
    && chmod +x /vault/init_vault.sh

# Expose Vault ports
EXPOSE 8200 8201

# Run Vault initialization script
ENTRYPOINT ["/vault/init_vault.sh"]
