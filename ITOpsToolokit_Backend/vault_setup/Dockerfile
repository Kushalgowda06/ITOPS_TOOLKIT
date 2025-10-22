# Use official Vault image
FROM hashicorp/vault:1.14.3

WORKDIR /vault

# Copy scripts from build context (same folder)
COPY vault.hcl /vault/vault.hcl
COPY init_vault.sh /vault/init_vault.sh
COPY generate_tls.sh /vault/generate_tls.sh

RUN chmod +x /vault/init_vault.sh /vault/generate_tls.sh

CMD ["/vault/init_vault.sh"]
