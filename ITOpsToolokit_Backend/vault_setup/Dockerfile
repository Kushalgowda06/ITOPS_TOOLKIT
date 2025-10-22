# Use a valid Vault image
FROM vault:1.15.3

# Set working directory inside container
WORKDIR /vault

# Copy initialization and TLS scripts
COPY init_vault.sh .
COPY generate_tls.sh .

# Make scripts executable
RUN chmod +x init_vault.sh generate_tls.sh

# Expose Vault ports
EXPOSE 8200 8201

# Start Vault container with TLS
CMD ["./init_vault.sh"]
