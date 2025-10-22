# --------------------------
# Stage 1: Generate self-signed TLS certs
# --------------------------
FROM alpine:latest AS certgen
RUN apk add --no-cache openssl
RUN mkdir -p /vault/tls && \
    openssl req -out /vault/tls/tls.crt -new -keyout /vault/tls/tls.key \
    -newkey rsa:4096 -nodes -sha256 -x509 \
    -subj "/O=Cognizant/CN=RBAServer" \
    -addext "subjectAltName = IP:0.0.0.0,DNS:rba.cognizantgoc.com" \
    -days 365

# --------------------------
# Stage 2: Build Vault image
# --------------------------
FROM hashicorp/vault:latest

# Copy TLS certs from stage 1
COPY --from=certgen /vault/tls /vault/certs

# Copy configuration & scripts (relative to build context)
COPY vault.hcl /vault/config/vault.hcl
COPY init_vault.sh /vault/init_vault.sh

# Fix permissions
RUN chmod 644 /vault/config/vault.hcl && \
    chmod +x /vault/init_vault.sh && \
    chmod 644 /vault/certs/tls.crt /vault/certs/tls.key

# Expose Vault ports
EXPOSE 8200 8201

# Default command (use Vault’s entrypoint)
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["server", "-config=/vault/config/vault.hcl"]
