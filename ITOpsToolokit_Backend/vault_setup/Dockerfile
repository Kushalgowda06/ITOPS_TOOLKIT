# Use the official Vault image
FROM hashicorp/vault:latest

# Set environment variables
ENV VAULT_ADDR=https://vault.local:8200

# Create necessary directories
RUN mkdir -p /opt/vault/tls /opt/vault/data

# Generate self-signed TLS certificate
RUN openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
  -keyout /opt/vault/tls/tls.key \
  -out /opt/vault/tls/tls.crt \
  -subj "/O=MyCompany/CN=vault.local" \
  -addext "subjectAltName=DNS:vault.local,IP:0.0.0.0"

# Copy Vault configuration
COPY vault.hcl /etc/vault.d/vault.hcl

# Copy initialization script
COPY init_vault.sh /usr/local/bin/init_vault.sh
RUN chmod +x /usr/local/bin/init_vault.sh

# Expose Vault port
EXPOSE 8200

# Start Vault in server mode
CMD ["vault", "server", "-config=/etc/vault.d/vault.hcl"]
