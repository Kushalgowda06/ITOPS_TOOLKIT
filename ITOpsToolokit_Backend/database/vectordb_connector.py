import os
import json

import psycopg2

import traceback
from vault import Vault

from langchain_huggingface import HuggingFaceEmbeddings

SCRIPT_PATH = os.path.dirname(__file__)


class CustomError(Exception):
    """Custom exception for application-specific errors."""
    def __init__(self, message):
        super().__init__(message)
        self.message = message


class VectorDatabase:
    def __init__(self):
        # Collect call analytics tool configuration details
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

        # Establish database session
        db_name = mim_conf['pg_db_name']
        db_host = mim_conf['pg_db_host']
        db_port = mim_conf['pg_db_port']
        self.dimention = mim_conf['vector_dimention']
        self.similarity_threshould = mim_conf['similarity_threshould']

        db_creds = self.vault_session.retrieve_secret(db_name)
        if db_creds[0]:
            for k, v in db_creds[1].items():
                db_username = k
                db_password = v
        else:
            db_username = None
            db_password = None

        #Embeddings, these are necessary to vectorize the text and store in database
        encode_kwargs = {'normalize_embeddings': False}
        model_kwargs = {'device': 'cpu'}
        try:
            self.em_model = HuggingFaceEmbeddings(model_name = SCRIPT_PATH + "/model",
                                                model_kwargs = model_kwargs,
                                                encode_kwargs = encode_kwargs)
            

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
        self.cursor.close()
        self.connection.close()

    def ensure_collection_exists(self, collection):
        """
            Ensures that a collection (table) exists in the PostgreSQL vector database.

            Parameters:
                collection. (str): The name of the collection (table) to check or create.

            Functionality:
                - Checks if a table with the specified name exists in the database.
                - If the table does not exist, creates it with the following schema:
                    - 'id': Auto-incrementing primary key.
                    - 'content': A TEXT column to store the original content.
                    - 'embedding': A vector column with the specified dimension.
                    - 'metadata': A JSONB column to store associated metadata.
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
            """, (collection,))

            exists = self.cursor.fetchone()[0]

        except Exception as e:
            raise CustomError(f'Error: Unable to ensure the exsistance of collection {collection} - {str(e)}')

        # Create the table if it doesn't exist
        if not exists:
            try:
                self.cursor.execute(f"""
                    CREATE TABLE {collection} (
                        id SERIAL PRIMARY KEY,
                        content TEXT,
                        embedding VECTOR({self.dimention}),
                        metadata JSONB
                    );
                """)

            except Exception as e:
                raise CustomError(f'Error: Unable to create collection - {str(e)}')
              
            self.connection.commit()

        return

    def insert_data(self, data = [], collection = ''):
        """
            Purpose:
            Inserts data into a PostgreSQL vector database (pgvector).

            Expected Input:
            collection (str): The name of the collection (table) where the data should be inserted.
            A list of dictionaries, where each dictionary must contain:
                content (str): The textual content to be stored.
                metadata (dict/JSON): Associated metadata in JSON format.

                [{"metadata": {"number": "INC00001"},"content": "The function validates and processes each dictionary in the list, ensuring the required structure, and inserts the data into the pgvector database for efficient vector-based querying."}]

            Returns:
            int: The number of rows successfully inserted into the database.

            Functionality:
            The function validates and processes each dictionary in the list, ensuring the required structure, and inserts the data into the pgvector database for efficient vector-based querying.
        """

        if not data and not collection:
            raise CustomError("record and collection parameter should not be empty")
    

        self.ensure_collection_exists(collection)

        query = f'''
            INSERT INTO {collection} (content, embedding, metadata)
            VALUES (%s, %s, %s)
        '''
        try:
            for row in data:
                self.cursor.execute(query, (row['content'], self.em_model.embed_query(row['content']), json.dumps(row['metadata'])))

        except Exception as e:
            raise CustomError(f'Error: Unable to execute insert query - {str(e)}')

        self.connection.commit() 

        return self.cursor.rowcount

    def retrieve_data(self, query = '', collection = '', columns = '', limit = 3):
        print(columns)
        """
            Purpose:
                Retrieves relevant data from a PostgreSQL vector database (pgvector) based on semantic similarity.

            Expected Input:
                query (str): The textual query to be converted into an embedding.
                collection (str): The name of the collection (table) from where the data should be retrieved.
                limit: Maximum number of similar results to return. Default 3

            Returns:
                list of dict: A list of dictionaries, each containing:
                    - 'metadata' (dict): The associated metadata stored with the content.
                    - 'content' (str): The matched content from the database.
                    - 'similarity_score' (float): The similarity score between the query and the content.

            Functionality:
                - Converts the input query into a vector embedding.
                - Performs a similarity search against stored embeddings in the database.
                - Filters results based on the provided similarity threshold.
                - Returns the matching entries as a list of dictionaries with content, INC number, and similarity score.
        """

        if not query and not collection:
            raise CustomError("query and collection parameter should not be empty")

        query_embedding = self.em_model.embed_query(query)

        select_clause = ', '.join(columns) if columns else '*'
        
        query = f'SELECT {select_clause}'
        
        if query_embedding:
            vector_str = ','.join(map(str, query_embedding))
            query += ", cosine_distance(embedding, %s::vector) AS similarity"

        query += f" FROM {collection}"
        
        if query_embedding:
            query += " ORDER BY similarity ASC"

        query += f" LIMIT {limit};"

        try:
            self.cursor.execute(query, ([query_embedding]))#, query_embedding, limit))
            rows = self.cursor.fetchall()

            if not columns:
                columns = [desc[0] for desc in self.cursor.description]

            results = []
            for row in rows:
                result_dict = dict(zip(columns, row))
                del result_dict['embedding']
                results.append(result_dict)
    
            return results

        except Exception as e:
            raise CustomError(f'Error: Unable to execute retrieve query - {str(e)}')

        
