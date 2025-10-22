# -----------------------------------------------
# Dockerfile for Vault production deployment
# -----------------------------------------------
FROM hashicorp/vault:latest

# Create Vault directories
RUN mkdir -p /vault/config /vault/file /vault/logs /vault/certs

# Copy Vault configuration and init script
COPY vault.hcl /vault/config/vault.hcl
COPY init_vault.sh /vault/init_vault.sh

# Copy TLS certificates
COPY tls/ /vault/certs/

# Set execute permission for the init script
RUN chmod +x /vault/init_vault.sh

# Expose Vault HTTP and HTTPS ports
EXPOSE 8200 8201

# Run Vault initialization script when container starts
ENTRYPOINT ["/vault/init_vault.sh"]
