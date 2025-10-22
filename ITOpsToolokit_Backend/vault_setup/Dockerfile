FROM vault:latest


# Set working directory
WORKDIR /vault

# Copy scripts and configs
COPY init_vault.sh /vault/init_vault.sh
COPY vault.hcl /vault/vault.hcl

# Make scripts executable
RUN chmod +x /vault/init_vault.sh

# Expose Vault ports
EXPOSE 8200 8201

# Default command to initialize Vault
CMD ["/vault/init_vault.sh"]
