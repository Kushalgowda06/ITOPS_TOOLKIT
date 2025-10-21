# Author - Viraj Purandare (599350)
# Created On - April 28, 2023
# Version - 1.0

import sys
import hvac

class Vault:
  def __init__(self, vault_url, vault_token):
    self.client = hvac.Client(url = vault_url,
                              token = vault_token,
                              verify = False)

  def insert_secret(self, path, secret_dict = {}):
    try:
      secret = self.client.secrets.kv.v2.create_or_update_secret(path = path, secret = secret_dict)
      return (True, 'Secret inserted successfully')
    except Exception as e:
      return (False, 'Secret insertion failed - ' + str(e))

  def retrieve_secret(self, path, secret_name = None):
    try:
      secret = self.client.secrets.kv.read_secret_version(path = path)
      if secret_name == None:
          return (True, secret['data']['data'])
      else:
          return (True, {secret_name: secret['data']['data'][secret_name]})
    except Exception as e:
      return (False, 'Secret retrieval failed - ' + str(e))

  def list_secrets(self, path):
    try:
      secrets = self.client.secrets.kv.v2.list_secrets('/')['data']['keys']
      return secrets
    except Exception:
      return []

