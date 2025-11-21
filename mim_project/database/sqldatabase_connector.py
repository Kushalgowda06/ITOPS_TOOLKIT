# Author - Viraj Purandare
# Created On- March 27, 2024

import os 
import json
import psycopg2

import random
import traceback
from vault import Vault
from psycopg2.extras import execute_values

SCRIPT_PATH = os.path.dirname(__file__)

class CustomError(Exception):
    """Custom exception for application-specific errors."""
    def __init__(self, message):
        super().__init__(message)
        self.message = message

class SQLDatabase:
    def __init__(self):
        #Fetch Credentials from Vault
        mim_conf_path = SCRIPT_PATH.split('/database')[0] + '/config/mim_conf.json'

        mim_conf_file = open(mim_conf_path, 'r')
        mim_conf = json.load(mim_conf_file)
        mim_conf_file.close()

        # Initiate vault
        vault_path = SCRIPT_PATH.split('/database')[0] + '/config/.vault_token'

        vault_file = open(vault_path, 'r')
        vault_token = vault_file.read().strip()
        vault_file.close()

        vault_url = mim_conf['vault_url']
        self.vault_session = Vault(vault_url, vault_token)

        # Fetch Database credentials
        db_name = mim_conf['pg_db_name']
        db_host = mim_conf['pg_db_host']
        db_port = mim_conf['pg_db_port']

        db_creds = self.vault_session.retrieve_secret(db_name)
        if db_creds[0]:
            for k, v in db_creds[1].items():
                db_username = k
                db_password = v
        else:
            db_username = None
            db_password = None

        try:
            # Establish database connection
            self.connection = psycopg2.connect(
                dbname = db_name,
                user = db_username,
                password = db_password,
                host = db_host,
                port = db_port
            )

            # self.cursor = self.connection.cursor()

        except Exception as e:
            raise CustomError(str(e))

    def __del__(self):
        # self.cursor.close()
        self.connection.close()

    # Retrieve required data from database table
    def retrieve_data(self, table_name, columns = [], conditions = []):
            
        # Return all columns unless specified
        if columns == []:
            query = 'SELECT %s FROM %s' % ('*', table_name)
        else:
            query = 'SELECT %s FROM %s' % (', '.join(columns), table_name)

        (conditional_query, params) = self.handle_conditions(conditions)

        if conditional_query != []:
            conditional_query = ' AND '.join(conditional_query)
            query += ' WHERE ' + conditional_query
     
        # Execute query on database and obtain output
        cursor = self.connection.cursor()
        try:
            if params == []:
                cursor.execute(query)
            else:
                cursor.execute(query, params)

            data = cursor.fetchall()
            cursor.close()

            if not columns:
                columns = [desc[0] for desc in cursor.description]

            results = []
            for row in data:
                result_dict = dict(zip(columns, row))
                
                if table_name == 'prblm_tkt_details':
                    mod_data = result_dict['associated_incidents'].split(',')[:random.randint(5,10)]
                    formatted_string = ",".join(f'{id}' for id in mod_data)
                    result_dict['associated_incidents'] = formatted_string
                
                results.append(result_dict)

            return results

        except Exception as e:
            traceback.print_exc()
            raise CustomError(str(e))

        
    # Insert data into database table
    def insert_data(self, table_name, data):
        
        columns = data[0].keys()
        query = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES %s RETURNING id"

        # Prepare values as list of tuples
        values = [tuple(d[col] for col in columns) for d in data]

        cursor = self.connection.cursor()

        # Execute a query on database
        try:
            execute_values(cursor, query, values)
            inserted_ids = [row[0] for row in cursor.fetchall()]

            self.connection.commit()
            
            
        except Exception as e:
            inserted_ids = []
            traceback.print_exc()
            CustomError(str(e))

        cursor.close()
        return inserted_ids

    # Update entries from database table
    def update_data(self, table_name, update_dict, conditions = []):

        (conditional_query, params) = self.handle_conditions(conditions)
        
        set_clause = ', '.join([f"{key} = %s" for key in update_dict.keys()])
        values = list(update_dict.values())

        query = f"UPDATE {table_name} SET {set_clause}"

        if conditional_query != []:
            conditional_query = ' AND '.join(conditional_query)
            query += ' WHERE ' + conditional_query

        # Execute query on database
        try:
            cursor = self.connection.cursor()
            cursor.execute(query, values + params)

            self.connection.commit()
            row_count = cursor.rowcount
            
            cursor.close()
            
            return row_count

        except Exception as e:
            print(str(e))
            CustomError(str(e))

        

    # Delete entries from database table
    def delete_data(self, table_name, conditions):
        query = 'DELETE FROM ' + table_name

        (conditional_query, params) = self.handle_conditions(conditions)

        if conditional_query != []:
            conditional_query = ' AND '.join(conditional_query)
            query += ' WHERE ' + conditional_query

        # Execute query on database
        cursor = self.connection.cursor()
        try:
            cursor.execute(query, params)
            self.connection.commit()
            row_count = cursor.rowcount
        except Exception:
            CustomError(str(e))

        cursor.close()
        return row_count

    # Handle parameterised conditions
    def handle_conditions(self, conditions):
        conditional_query = []
        params = []

        # Form a query for provided conditions
        for condition in conditions:
            val = condition['val']

            # Equals and Not equal
            if condition['op'] == 'eq':
                conditional_query.append(condition['col'] + ' = %s')
            elif condition['op'] == 'ne':
                conditional_query.append(condition['col'] + ' != %s')

            # Greater than and Greater than or equals
            elif condition['op'] == 'gt':
                conditional_query.append(condition['col'] + ' > %s')
            elif condition['op'] == 'ge':
                conditional_query.append(condition['col'] + ' >= %s')

            # Less than and Less than or equals
            elif condition['op'] == 'lt':
                conditional_query.append(condition['col'] + ' < %s')
            elif condition['op'] == 'le':
                conditional_query.append(condition['col'] + ' <= %s')

            # Like and Not like
            elif condition['op'] == 'l':
                conditional_query.append(condition['col'] + ' LIKE %s')
            elif condition['op'] == 'nl':
                conditional_query.append(condition['col'] + ' NOT LIKE %s')

            # In and Not in
            elif condition['op'] == 'i':
                par_str = []
                for en in val:
                    par_str.append('%s')

                conditional_query.append(condition['col'] + ' IN (' + ', '.join(par_str) + ')')
                params += val
                continue
            elif condition['op'] == 'ni':
                par_str = []
                for en in val:
                    par_str.append('%s')

                conditional_query.append(condition['col'] + ' NOT IN (' + ', '.join(par_str) + ')')
                params += val
                continue

            elif condition['op'] == 'is':
                conditional_query.append(condition['col'] + ' IS %s')
            elif condition['op'] == 'isn':
                conditional_query.append(condition['col'] + ' IS NOT %s')

            else:
                conditional_query.append(condition['col'] + f' {condition['op']} %s')


            params.append(val)

        return (conditional_query, params)
