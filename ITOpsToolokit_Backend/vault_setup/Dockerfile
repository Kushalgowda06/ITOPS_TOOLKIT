# Use official Vault image
FROM hashicorp/vault:1.14.3

# Set working directory inside container
WORKDIR /vault

# Copy Vault configuration and scripts from repo root
COPY ITOpsToolokit_Backend/vault_setup/vault.hcl /vault/vault.hcl
COPY ITOpsToolokit_Backend/vault_setup/init_vault.sh /vault/init_vault.sh
COPY ITOpsToolokit_Backend/vault_setup/generate_tls.sh /vault/generate_tls.sh

# Make scripts executable
RUN chmod +x /vault/init_vault.sh /vault/generate_tls.sh

# Set the entrypoint to the initialization script
ENTRYPOINT ["/vault/init_vault.sh"]
