ui = true

storage "file" {
  path = "/vault/data"
}

listener "tcp" {
  address     = "0.0.0.0:8200"
  cluster_address = "0.0.0.0:8201"
  tls_cert_file = "/vault/certs/tls.crt"
  tls_key_file  = "/vault/certs/tls.key"
}

disable_mlock = true
api_addr = "https://rba.cognizantgoc.com:8200"
