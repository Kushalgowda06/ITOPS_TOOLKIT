# Stage 1: Generate TLS certs
FROM alpine:latest AS certgen

RUN apk add --no-cache openssl

RUN mkdir -p /vault/tls && \
    openssl req -out /vault/tls/tls.crt -new -keyout /vault/tls/tls.key \
        -newkey rsa:4096 -nodes -sha256 -x509 \
        -subj "/O=Cognizant/CN=RBAServer" \
        -addext "subjectAltName = IP:0.0.0.0,DNS:rba.cognizantgoc.com" \
        -days 365

# Stage 2: Vault container
FROM hashicorp/vault:latest

COPY --from=certgen /vault/tls /vault/tls
COPY vault.hcl /vault/config/vault.hcl
COPY init_vault.sh /vault/init_vault.sh

RUN chmod +x /vault/init_vault.sh
