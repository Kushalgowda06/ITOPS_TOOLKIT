# Stage 1: Generate TLS certs
FROM alpine:latest AS certgen

RUN apk add --no-cache openssl

# Keep generating files in /vault/tls for simplicity in Stage 1
RUN mkdir -p /vault/tls && \
    openssl req -out /vault/tls/tls.crt -new -keyout /vault/tls/tls.key \
        -newkey rsa:4096 -nodes -sha256 -x509 \
        -subj "/O=Cognizant/CN=RBAServer" \
        -addext "subjectAltName = IP:0.0.0.0,DNS:rba.cognizantgoc.com" \
        -days 365

# Stage 2: Vault container
FROM hashicorp/vault:latest

# *** CHANGE: Copy to /vault/certs instead of /vault/tls ***
COPY --from=certgen /vault/tls /vault/certs

# Ensure permissions on the new path
RUN chmod 644 /vault/certs/tls.crt /vault/certs/tls.key

COPY vault.hcl /vault/config/vault.hcl
COPY init_vault.sh /vault/init_vault.sh

RUN chmod +x /vault/init_vault.sh
