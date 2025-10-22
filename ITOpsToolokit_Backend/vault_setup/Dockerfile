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

# Copy TLS certs and config
COPY --from=certgen /vault/tls /vault/certs
COPY vault.hcl /vault/config/vault.hcl
COPY init_vault.sh /vault/init_vault.sh

# Fix permissions
RUN chmod 644 /vault/config/vault.hcl && \
    chmod +x /vault/init_vault.sh && \
    chmod 644 /vault/certs/tls.crt /vault/certs/tls.key

EXPOSE 8200 8201

# Keep Vault's original entrypoint but override CMD
CMD ["/vault/init_vault.sh"]
