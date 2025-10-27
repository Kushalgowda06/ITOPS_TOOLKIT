import os
import json
import sys
from pathlib import Path

try:
    import hvac
except ImportError:
    print("Please install hvac (pip install hvac)")
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
CONF_FILE = ROOT / "config" / "mim_conf.json"
TOKEN_FILE = ROOT / "config" / ".vault_token"

if not CONF_FILE.exists():
    print(f"Config not found: {CONF_FILE}")
    sys.exit(1)

with open(CONF_FILE, "r") as f:
    conf = json.load(f)

vault_url = conf.get("vault_url", "https://vault:8200")

if not TOKEN_FILE.exists():
    print(f"Vault token file not found: {TOKEN_FILE}\nPlace your root or appropriate token into this file and re-run.")
    sys.exit(1)

token = TOKEN_FILE.read_text().strip()

client = hvac.Client(url=vault_url, token=token, verify=False)
if not client.is_authenticated():
    print("Vault authentication failed. Check token and Vault status.")
    sys.exit(1)

# Write DB credentials at path equal to pg_db_name so existing code can read it
secret_path = conf.get("pg_db_name", "cfs_problem_tickets")
username = os.environ.get("DB_APP_USER", "dbuser")
password = os.environ.get("DB_APP_PASSWORD", "Password_2025")

client.secrets.kv.v2.create_or_update_secret(path=secret_path, secret={username: password})
print(f"Wrote DB creds to Vault path '{secret_path}' for user '{username}'.")
