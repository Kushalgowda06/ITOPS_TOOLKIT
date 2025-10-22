# Use official Vault image
FROM hashicorp/vault:1.15.3

# Set working directory inside the container
WORKDIR /vault

# Copy your Vault initialization script into the container
COPY init_vault.sh /vault/init_vault.sh

# Ensure the script is executable
RUN chmod +x /vault/init_vault.sh

# Optionally, copy your Vault configuration files if you have any
# COPY vault.hcl /vault/vault.hcl

# Entrypoint to run Vault with your init script
ENTRYPOINT ["/vault/init_vault.sh"]
