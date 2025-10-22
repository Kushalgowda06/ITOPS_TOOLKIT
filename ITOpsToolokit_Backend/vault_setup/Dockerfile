FROM hashicorp/vault:latest

# Create Vault directories
RUN mkdir -p /vault/config /vault/file /vault/logs /vault/certs

# Copy Vault files (make sure build context includes vault_setup folder)
COPY vault.hcl /vault/config/vault.hcl
COPY init_vault.sh /vault/init_vault.sh

# Make init script executable
RUN chmod +x /vault/init_vault.sh

EXPOSE 8200 8201

ENTRYPOINT ["/vault/init_vault.sh"]
