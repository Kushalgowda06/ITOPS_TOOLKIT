FROM vault:latest

# Copy scripts
COPY init_vault.sh /vault/init_vault.sh
COPY generate_tls.sh /vault/generate_tls.sh
COPY vault.hcl /vault/vault.hcl

# Ensure scripts are executable
RUN chmod +x /vault/init_vault.sh /vault/generate_tls.sh

# Set entrypoint
ENTRYPOINT ["/vault/init_vault.sh"]
