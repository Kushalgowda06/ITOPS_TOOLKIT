# Vault listener
listener "tcp" {
  address       = "0.0.0.0:8200"
  tls_cert_file = "/vault/certs/tls.crt"
  tls_key_file  = "/vault/certs/tls.key"
}

storage "file" {
  path = "/vault/data"
}

ui = true
