FROM hashicorp/vault:latest

# Create directories
RUN mkdir -p /vault/config /vault/file /vault/logs /vault/certs /vault/data

# Copy Vault config and init script
COPY vault.hcl /vault/config/vault.hcl
COPY init_vault.sh /vault/init_vault.sh

# Fix permissions & line endings
RUN chmod +x /vault/init_vault.sh

EXPOSE 8200 8201

# Start Vault with init script
ENTRYPOINT ["/vault/init_vault.sh"]
