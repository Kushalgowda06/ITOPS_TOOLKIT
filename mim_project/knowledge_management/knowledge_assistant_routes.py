import os
import traceback

from fastapi import APIRouter
from typing import List, Optional 
from pydantic import Field, BaseModel
from fastapi.responses import JSONResponse

from .knowledge_assistant import *

SCRIPT_PATH = os.path.dirname(__file__)

router = APIRouter()

mim_conf_path = SCRIPT_PATH.split('/knowledge_management')[0] + '/config/mim_conf.json'
mim_conf_file = open(mim_conf_path, 'r')
mim_conf = json.load(mim_conf_file)
mim_conf_file.close()

class KnowledgeAssistantPayload(BaseModel):
    query: str

class DiagnosticSummaryPayload(BaseModel):
    query: str
    collection: str

class KnowledgeArticlesOperationsPayload(BaseModel):
    table_name: str = "Knowledge_articles"

@router.post(f"/api/{mim_conf['api_version']}/get_contextual_response/", status_code=200)
async def get_contextual_response(payload: KnowledgeAssistantPayload) -> dict:
    response = {}
    try:
        ka_obj = KnowledgeAssistant()
        data = ka_obj.get_contextual_response(query = payload.query)

        response['output'] = {"data": data, "message": 'Contextual response retrieved successfully.'}
        response['code'] = 200

        return JSONResponse(status_code = 200, content = response)
    
    except Exception as e:
        response['error'] = {"data": {}, "message": str(e)}
        response['code'] = 500

        traceback.print_exc()

        return JSONResponse(status_code = 500, content = response)

@router.post(f"/api/{mim_conf['api_version']}/retrieve_knowledge_articles/", status_code=200)
async def retrieve_knowledge_articles(payload: KnowledgeArticlesOperationsPayload) -> dict:
    response = {}
    try:
        ka_obj = KnowledgeAssistant()
        table_name = payload.table_name
        data = ka_obj.retrieve_knowledge_articles(table_name = table_name)

        response['output'] = {"data": data, "message": 'Contextual response retrieved successfully.'}
        response['code'] = 200

        return JSONResponse(status_code = 200, content = response)
    
    except Exception as e:
        response['error'] = {"data": {}, "message": str(e)}
        response['code'] = 500

        traceback.print_exc()

        return JSONResponse(status_code = 500, content = response)

@router.post(f"/api/{mim_conf['api_version']}/find_duplicate_knowledge_articles/", status_code=200)
async def find_duplicate_knowledge_articles(payload: KnowledgeArticlesOperationsPayload) -> dict:
    response = {}
    try:
        ka_obj = KnowledgeAssistant()
        table_name = payload.table_name
        data = ka_obj.find_duplicates(table_name = table_name)

        response['output'] = {"data": data, "message": 'Contextual response retrieved successfully.'}
        response['code'] = 200

        return JSONResponse(status_code = 200, content = response)
    
    except Exception as e:
        response['error'] = {"data": {}, "message": str(e)}
        response['code'] = 500

        traceback.print_exc()

        return JSONResponse(status_code = 500, content = response)

@router.post(f"/api/{mim_conf['api_version']}/get_diagnostic_summary/", status_code=200)
async def get_diagnostic_summary(payload: DiagnosticSummaryPayload) -> dict:
    response = {}
    try:
        ka_obj = KnowledgeAssistant()
        data = ka_obj.get_diagnostic_summary(query = payload.query, collection = payload.collection)

        response['output'] = {"data": data, "message": 'Success'}
        response['code'] = 200

        return JSONResponse(status_code = 200, content = response)
    
    except Exception as e:
        response['error'] = {"data": {}, "message": str(e)}
        response['code'] = 500

        traceback.print_exc()

        return JSONResponse(status_code = 500, content = response)