ui = true

storage "file" {
  path = "/opt/vault/data"
}

listener "tcp" {
  address       = "0.0.0.0:8200"
  tls_cert_file = "vault_setup/tls/certfile.pem"
  tls_key_file  = "vault_setup/tls/keyfile.pem"
}

api_addr = "https://3.6.96.101:8200"

disable_mlock = true
