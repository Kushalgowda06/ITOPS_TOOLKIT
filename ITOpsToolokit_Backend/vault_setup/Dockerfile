# Stage 1: Vault Base
FROM hashicorp/vault:latest

# Copy Vault config and TLS certificates
COPY vault.hcl /vault/config/vault.hcl
COPY tls /vault/certs

# Make init script executable
COPY init_vault.sh /vault/init_vault.sh
RUN chmod +x /vault/init_vault.sh \
    && chmod 644 /vault/config/vault.hcl \
    && chmod 644 /vault/certs/tls.crt /vault/certs/tls.key
