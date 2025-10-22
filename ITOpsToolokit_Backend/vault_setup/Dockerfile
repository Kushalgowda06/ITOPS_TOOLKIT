FROM hashicorp/vault:1.15.3

# Set working directory
WORKDIR /vault

# Copy scripts and config
COPY init_vault.sh generate_tls.sh vault.hcl /vault/
RUN chmod +x /vault/init_vault.sh /vault/generate_tls.sh

# Expose Vault port
EXPOSE 8200

# Run your init script
ENTRYPOINT ["/vault/init_vault.sh"]
