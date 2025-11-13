FROM hashicorp/vault:1.14.3

WORKDIR /vault

USER root

COPY init_vault_simple.sh /vault/init_vault_simple.sh
RUN chmod +x /vault/init_vault_simple.sh

EXPOSE 8200

ENTRYPOINT ["/vault/init_vault_simple.sh"]