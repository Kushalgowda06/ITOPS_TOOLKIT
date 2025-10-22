# Use Hashicorp Vault official image
FROM hashicorp/vault:latest

# Create Vault directories
RUN mkdir -p /vault/config /vault/data /vault/certs /vault/logs

# Copy configuration and init script
COPY vault.hcl /vault/config/vault.hcl
COPY init_vault.sh /vault/init_vault.sh

# Make init script executable
RUN chmod +x /vault/init_vault.sh

# Expose Vault ports
EXPOSE 8200 8201

# Run initialization script
ENTRYPOINT ["/vault/init_vault.sh"]
