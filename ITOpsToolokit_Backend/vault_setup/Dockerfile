FROM hashicorp/vault:latest

COPY vault.hcl /vault/config/vault.hcl
COPY tls /vault/tls
COPY init_vault.sh /vault/init_vault.sh

RUN chmod +x /vault/init_vault.sh
