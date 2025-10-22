# Use official Vault image
FROM hashicorp/vault:1.14.3

# Set working directory
WORKDIR /vault

# Copy configuration and scripts
COPY vault_setup/vault.hcl /vault/vault.hcl
COPY vault_setup/init_vault.sh /vault/init_vault.sh
COPY vault_setup/generate_tls.sh /vault/generate_tls.sh

# Make scripts executable
RUN chmod +x /vault/init_vault.sh /vault/generate_tls.sh

# Set entrypoint to your init script
ENTRYPOINT ["/vault/init_vault.sh"]
