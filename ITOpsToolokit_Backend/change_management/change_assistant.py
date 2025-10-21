# Author - Viraj Purandare
# Created On - August 4, 2024

import os
import json
from typing import Any, Dict, List

from kb_manager import KBManager

import vertexai
from langchain_google_vertexai import VertexAI
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor
from langchain.callbacks.manager import CallbackManagerForRetrieverRun

from langchain_openai import AzureChatOpenAI

from langchain.schema import Document

SCRIPT_PATH = os.path.dirname(__file__)

class CustomContextualCompressionRetriever(ContextualCompressionRetriever):
    def _get_relevant_documents(
            self, query: str, *, run_manager: CallbackManagerForRetrieverRun, **kwargs: Any
    ) -> List[Document]:
        '''Get docs, adding score information.'''
        docs_and_similarities = self.base_retriever.similarity_search_with_relevance_scores(query, **kwargs)
        docs = [doc for doc, _ in docs_and_similarities]
        for doc, similarity in docs_and_similarities:
            doc.metadata['similarity_score'] = similarity

        return docs

class ChangeAssistant:
    def __init__(self):
        '''
        # LLM compressor
        # VertexAI - Google Gemini
        llm_connect_path = SCRIPT_PATH + '/config/.vai_sa.json'
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = llm_connect_path

        llm_connect = json.loads(open(llm_connect_path).read())
        vertexai.init(project = llm_connect['project_id'])
        self.llm = VertexAI(model_name = 'gemini-1.5-flash-001')
        '''

        # Azure Chat OpenAI
        llm_connect_path = SCRIPT_PATH + '/config/.azure_env.json'
        llm_connect = json.loads(open(llm_connect_path).read())

        os.environ['AZURE_OPENAI_ENDPOINT'] = llm_connect['AZURE_OPENAI_ENDPOINT']
        os.environ['AZURE_OPENAI_API_KEY'] = llm_connect['AZURE_OPENAI_API_KEY']
        os.environ['OPENAI_API_VERSION'] = llm_connect['OPENAI_API_VERSION']

        self.llm = AzureChatOpenAI(azure_deployment = 'gpt-4o-mini')
        self.compressor = LLMChainExtractor.from_llm(self.llm)

        kb_mng_obj = KBManager()
        self.kb_connection = kb_mng_obj.retrieve_kb_connection(kb_name = 'platform_knowledge_base', collection_name = 'change_requests')

        app_conf_path = SCRIPT_PATH + '/config/app_config.json'

        app_conf_file = open(app_conf_path, 'r')
        app_conf = json.load(app_conf_file)
        app_conf_file.close()

        # KB similarity threshold score
        try:
            self.kb_similarity_threshold_score = app_conf['kb_similarity_threshold_score']
        except Exception:
            self.kb_similarity_threshold_score = 0.5

    def get_compressed_response(self, quest):
        '''
        compression_retriever = ContextualCompressionRetriever(base_compressor = self.compressor, \
                base_retriever = self.kb_connection.as_retriever(search_type = 'similarity_score_threshold', search_kwargs = {'score_threshold': 0.1}))
        '''

        compression_retriever = CustomContextualCompressionRetriever(base_compressor = self.compressor, \
                base_retriever = self.kb_connection.as_retriever())

        compression_retriever.base_retriever = self.kb_connection

        # Below invoke method is linked to get_relevant_documents
        compressed_docs = compression_retriever.invoke(quest) 
        response = 'Reference Change Requests - \n'

        page_contents = {}
        for doc in compressed_docs:
            if doc.metadata['similarity_score'] >= self.kb_similarity_threshold_score:
                response += doc.metadata['source'] + ' - Similarity - ' + str(round(doc.metadata['similarity_score'] * 100, 2)) #+ '% - Article\'s Link - ' + doc.metadata['kb_link'] + '\n'
                page_contents[doc.metadata['source']] = doc.page_content

        return page_contents

