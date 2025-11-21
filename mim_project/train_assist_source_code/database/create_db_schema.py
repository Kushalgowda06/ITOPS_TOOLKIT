from sqldatabase_connector import SQLDatabase

db = SQLDatabase()

db.ensure_collection_exists("quizes")