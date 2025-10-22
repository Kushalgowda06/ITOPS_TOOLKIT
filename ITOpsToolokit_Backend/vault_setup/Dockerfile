# Stage 1: Generate TLS certs
FROM alpine:latest AS certgen

RUN apk add --no-cache openssl

RUN mkdir -p /vault/tls && \
    openssl req -out /vault/tls/tls.crt -new -keyout /vault/tls/tls.key \
        -newkey rsa:4096 -nodes -sha256 -x509 \
        -subj "/O=Cognizant/CN=RBAServer" \
        # ✅ FIXED: DNS: instead of DNS=
        -addext "subjectAltName = IP:0.0.0.0,DNS:rba.cognizantgoc.com" \
        -days 365

# Stage 2: Vault container
FROM hashicorp/vault:latest

# Copy generated certificates
COPY --from=certgen /vault/tls /vault/certs
RUN chmod 644 /vault/certs/tls.crt /vault/certs/tls.key

# Copy config and init script (paths relative to build context)
COPY vault.hcl /vault/config/vault.hcl
COPY init_vault.sh /vault/init_vault.sh

RUN chmod +x /vault/init_vault.sh
