# Use the official Vault image as the base
FROM hashicorp/vault:latest

# Set environment variables
ENV VAULT_ADDR=https://vault.local:8200

# Copy Vault configuration
COPY vault.hcl /etc/vault.d/vault.hcl

# Copy TLS certificates and data directory
COPY tls/ /opt/vault/tls/
COPY data/ /opt/vault/data/

# Copy any initialization scripts (optional)
COPY init_vault.sh /usr/local/bin/init_vault.sh
RUN chmod +x /usr/local/bin/init_vault.sh

# Expose Vault port
EXPOSE 8200

# Start Vault in server mode
CMD ["vault", "server", "-config=/etc/vault.d/vault.hcl"]
