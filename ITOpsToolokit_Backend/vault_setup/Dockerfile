# -----------------------------------------------
# Dockerfile for Vault production deployment
# -----------------------------------------------
FROM hashicorp/vault:latest

# Create Vault directories
RUN mkdir -p /vault/config /vault/file /vault/logs /vault/certs

# Copy Vault config and init script
COPY vault.hcl /vault/config/vault.hcl
COPY init_vault.sh /vault/init_vault.sh

# Copy TLS certificates
COPY tls/ /vault/certs/

# Set execute permissions
RUN chmod +x /vault/init_vault.sh && \
    chmod 644 /vault/config/vault.hcl /vault/certs/*

# Expose Vault HTTP and HTTPS ports
EXPOSE 8200 8201

# Run initialization script
ENTRYPOINT ["/vault/init_vault.sh"]
