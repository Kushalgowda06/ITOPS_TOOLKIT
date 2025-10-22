# -----------------------------------------------
# Dockerfile for Vault production deployment
# -----------------------------------------------
FROM hashicorp/vault:latest

# Create Vault directories
RUN mkdir -p /vault/config /vault/file /vault/logs /vault/certs

# Copy Vault config and init script
COPY vault.hcl /vault/config/vault.hcl
COPY init_vault.sh /vault/init_vault.sh

# Set execute permission
RUN chmod +x /vault/init_vault.sh

# Expose Vault HTTP and HTTPS ports
EXPOSE 8200 8201

# Run initialization script
ENTRYPOINT ["/vault/init_vault.sh"]
