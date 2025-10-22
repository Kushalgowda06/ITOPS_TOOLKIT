ui = true

storage "file" {
  path = "/opt/vault/data"
}

listener "tcp" {
  address       = "0.0.0.0:8200"
  tls_cert_file = "/opt/vault/tls/certfile.pem"
  tls_key_file  = "/opt/vault/tls/keyfile.pem"
}

api_addr = "https://3.6.96.101:8200"

disable_mlock = true
