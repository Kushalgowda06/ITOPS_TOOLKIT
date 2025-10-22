# Vault production image
FROM hashicorp/vault:latest

# Create directories
RUN mkdir -p /vault/config /vault/file /vault/logs /vault/certs

# Copy Vault config and init script
COPY vault.hcl /vault/config/vault.hcl
COPY init_vault.sh /vault/init_vault.sh
COPY generate_tls.sh /vault/generate_tls.sh

# Fix permissions and line endings
RUN chmod +x /vault/init_vault.sh /vault/generate_tls.sh

# Expose Vault ports
EXPOSE 8200 8201

# Start Vault initialization script
ENTRYPOINT ["/vault/init_vault.sh"]
