FROM hashicorp/vault:1.20

# Install openssl
USER root
RUN apk add --no-cache openssl bash jq

# Copy your scripts
COPY init_vault.sh /vault/init_vault.sh
COPY generate_tls.sh /vault/generate_tls.sh

# Make scripts executable
RUN chmod +x /vault/*.sh

# Set entrypoint
ENTRYPOINT ["/vault/init_vault.sh"]
