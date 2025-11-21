import os
import sys
import json

SCRIPT_PATH = os.path.dirname(__file__)
ROOT_PATH = SCRIPT_PATH.split("/config")[0]
sys.path.append(ROOT_PATH)

from database.sqldatabase_connector import SQLDatabase

class Configuration:
    def __init__(self):
        self.db_obj = SQLDatabase()

    # Function to retrieve configuration from the database.
    def retrieve_config(self, keys:list = []):
        data = self.db_obj.retrieve_data(
            table_name = 'config',
            columns = ['key', 'value'],
            conditions = [
                {"col": "key", "op": "i", "val": keys}
            ]
        )
        return data

    # Function to insert configuration to the database.
    def insert_config(self, records:list = []):
        data = self.db_obj.insert_data(
            table_name = 'config',
            data = records
        )
        return data

    # Function to update configuration to the database.
    def update_config(self, update_key, update_val, conditions):
        data = self.db.update_data(
            table_name = "config",
            update_key = update_key,
            update_val = update_val,
            conditions = conditions
        )
        return data

    # Function to delete configuration from the database.
    def delete_config(self, conditions):
        data = self.db.delete_data(
            table_name = "config",
            conditions = conditions
        )
        return data


