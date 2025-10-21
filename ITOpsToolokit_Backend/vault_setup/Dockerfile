FROM alpine:3.18

# Install dependencies
RUN apk add --no-cache openssl bash curl unzip jq

# Set Vault version and environment variables
ENV VAULT_VERSION=1.16.1
ENV VAULT_ADDR=https://vault.local:8200

# Download and install Vault
RUN curl -fsSL https://releases.hashicorp.com/vault/${VAULT_VERSION}/vault_${VAULT_VERSION}_linux_amd64.zip -o vault.zip \
    && unzip vault.zip \
    && mv vault /usr/local/bin/vault \
    && rm -f vault.zip

# Create necessary directories
RUN mkdir -p /opt/vault/tls /opt/vault/data /etc/vault.d

# Generate self-signed TLS certificate
RUN openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
  -keyout /opt/vault/tls/tls.key \
  -out /opt/vault/tls/tls.crt \
  -subj "/O=MyCompany/CN=vault.local" \
  -addext "subjectAltName=DNS:vault.local,IP:127.0.0.1"

# Copy Vault configuration and init script
COPY vault.hcl /etc/vault.d/vault.hcl
COPY init_vault.sh /usr/local/bin/init_vault.sh
RUN chmod +x /usr/local/bin/init_vault.sh

# Expose Vault port
EXPOSE 8200

# Start Vault and run init script after a short delay
CMD ["/bin/bash", "-c", "vault server -config=/etc/vault.d/vault.hcl & sleep 10 && init_vault.sh"]
