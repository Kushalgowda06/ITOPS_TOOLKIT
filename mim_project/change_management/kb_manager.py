# Author - Viraj Purandare
# Created On - April 11, 2024

import os

import chromadb
from langchain.vectorstores import Chroma

from langchain_huggingface import HuggingFaceEmbeddings
from transformers import AutoTokenizer,AutoModel,AutoModelForSequenceClassification, AutoTokenizer

SCRIPT_PATH = os.path.dirname(__file__)

os.environ['TRANSFORMERS_OFFLINE'] = '1'

class KBManager:
    def __init__(self):
        # Initiating Embedding Model (Local)
        model_kwargs = {'device': 'cpu'}
        encode_kwargs = {'normalize_embeddings': False}

        self.em_model = HuggingFaceEmbeddings(model_name = SCRIPT_PATH + "/model",
                                              model_kwargs = model_kwargs,
                                              encode_kwargs = encode_kwargs)

    def insert_documents(self, documents, kb_name = '', collection_name = ''):
        # Insert KB articles in Chroma Vector DB

        if kb_name.strip() == '':
            db = Chroma.from_documents(documents, self.em_model, persist_directory = SCRIPT_PATH + '/platform_knowledge_base')
        else:
            db = Chroma.from_documents(documents, self.em_model, persist_directory = SCRIPT_PATH + '/' + kb_name.strip(), collection_name = collection_name)

        # print(str(len(documents)) + ' inserted to database.')
        db.persist()

    def retrieve_kb_connection(self, kb_name = '', collection_name = ''):
        # Retrieve KB articles from Chroma Vector DB
        if kb_name.strip() == '':
            db_connection = Chroma(persist_directory = SCRIPT_PATH + '/platform_knowledge_base', embedding_function = self.em_model)
        else:
            db_connection = Chroma(persist_directory = SCRIPT_PATH + '/' + kb_name.strip(), embedding_function = self.em_model, collection_name = collection_name)

        return db_connection

    def update_kb_document(self, kb_name = '', collection_name = ''):
        db_update_collection = Chroma(persist_directory = SCRIPT_PATH + '/' + kb_name.strip(), embedding_function = self.em_model, collection_name = collection_name)
        result = db_update_collection.get()
        print(result)


