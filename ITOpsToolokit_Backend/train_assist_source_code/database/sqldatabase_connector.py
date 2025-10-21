# Author - Viraj Purandare
# Created On- March 27, 2024

import os 
import sys
import json
import traceback

import psycopg2
from psycopg2.extras import execute_values

SCRIPT_PATH = os.path.dirname(__file__)
ROOT_PATH = ROOT_PATH = SCRIPT_PATH.split(os.path.join('database'))[0]

sys.path.append(ROOT_PATH)
from vault import Vault

class CustomError(Exception):
    """Custom exception for application-specific errors."""
    def __init__(self, message):
        super().__init__(message)
        self.message = message

class SQLDatabase:
    def __init__(self):
        #Fetch Credentials from Vault
        app_conf_path = os.path.join(ROOT_PATH, 'config', 'app_config.json')

        app_conf_file = open(app_conf_path, 'r')
        app_conf = json.load(app_conf_file)
        app_conf_file.close()

        # Initiate vault
        vault_path = os.path.join(ROOT_PATH, 'config', '.vault_token')

        vault_file = open(vault_path, 'r')
        vault_token = vault_file.read().strip()
        vault_file.close()

        vault_url = app_conf['vault_url']
        self.vault_session = Vault(vault_url, vault_token)

        # Fetch Database credentials
        db_name = app_conf['pg_db_name']
        db_host = app_conf['pg_db_host']
        db_port = app_conf['pg_db_port']

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

            self.cursor = self.connection.cursor()

        except Exception as e:
            raise CustomError(str(e))

    def __del__(self):
        # self.cursor.close()
        self.connection.close()

    def ensure_collection_exists(self, table):
        """
            Ensures that a table exists in the PostgreSQL vector database.

            Parameters:
                table. (str): The name of the table to check or create.

            Functionality:
                - Checks if a table with the specified name exists in the database.
                - If the table does not exist, creates it with the following schema:
                    

                
                - Commits the changes to the database if a new table is created.
            """
        output = {}
        # Check if the table exists
        try:
            self.cursor.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = %s
                );
            """, (table,))

            exists = self.cursor.fetchone()[0]

        except Exception as e:
            raise CustomError(f'Error: Unable to ensure the exsistance of table {table} - {str(e)}')

        # Create the table if it doesn't exist
        if not exists:
            try:
                self.cursor.execute(f"""
                    CREATE TABLE {table} (
                        quiz_id SERIAL PRIMARY KEY,
                        user_id INT,
                        kb_number VARCHAR(10) ,
                        start_time TIMESTAMP,
                        quiz JSONB,
                        user_response TEXT,
                        score FLOAT
                    );
                """)
                print(f"Table {table} created!!")

            except Exception as e:
                raise CustomError(f'Error: Unable to create table - {str(e)}')
              
            self.connection.commit()

        return 

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
        if not columns:
                columns = [desc[0] for desc in self.cursor.description]

        cursor = self.connection.cursor()
        try:
            if params == []:
                cursor.execute(query)
            else:
                cursor.execute(query, params)

            data = cursor.fetchall()
            cursor.close()

            results = []
            for row in data:
                result_dict = dict(zip(columns, row))
                results.append(result_dict)

            return results

        except Exception as e:
            traceback.print_exc()
            raise CustomError(str(e))

        
    # Insert data into database table
    def insert_data(self, table_name, data):
        
        columns = data[0].keys()
        query = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES %s RETURNING quiz_id"

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
    def update_data(self, table_name, update_dict = {}, conditions = []):

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

        except Exception as e:
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

            params.append(val)

        return (conditional_query, params)