# Use official Vault image
FROM hashicorp/vault:1.14.3

# Set working directory inside container
WORKDIR /vault

# Copy Vault configuration and scripts
COPY vault.hcl /vault/vault.hcl
COPY init_vault.sh /vault/init_vault.sh
COPY generate_tls.sh /vault/generate_tls.sh

# Make scripts executable
RUN chmod +x /vault/init_vault.sh /vault/generate_tls.sh

# Start Vault via init script
CMD ["/vault/init_vault.sh"]
