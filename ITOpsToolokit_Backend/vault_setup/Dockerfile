# -----------------------------------------------
# Vault Dockerfile - Production-ready
# -----------------------------------------------
FROM hashicorp/vault:latest

# Create Vault directories
RUN mkdir -p /vault/config /vault/certs /vault/data /vault/logs

# Copy Vault config and scripts
COPY vault.hcl /vault/config/vault.hcl
COPY generate_tls.sh /vault/generate_tls.sh
COPY init_vault.sh /vault/init_vault.sh

# Set execute permissions
RUN chmod +x /vault/init_vault.sh /vault/generate_tls.sh

# Expose Vault ports
EXPOSE 8200 8201

# Run initialization script as entrypoint
ENTRYPOINT ["/vault/init_vault.sh"]
