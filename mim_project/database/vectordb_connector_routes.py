import os
import json

import traceback

from .vectordb_connector import *

from fastapi import APIRouter
from pydantic import BaseModel
from fastapi.responses import JSONResponse

from typing import List, Optional

SCRIPT_PATH = os.path.dirname(__file__)

router = APIRouter()

mim_conf_path = SCRIPT_PATH.split('/database')[0] + '/config/mim_conf.json'
mim_conf_file = open(mim_conf_path, 'r')
mim_conf = json.load(mim_conf_file)
mim_conf_file.close()

class InsertPayload(BaseModel):
    records: List[dict]
    collection: str

class RetrievePayload(BaseModel):
    query: str
    collection: str
    columns:Optional[List] = []
    limit: Optional[int] = 3

@router.post(f"/api/{mim_conf['api_version']}/insert_data/", status_code = 200)
async def insert_data(payload: InsertPayload) -> dict:
    response = {}
    try:
        db_obj = VectorDatabase()

        rowcount = db_obj.insert_data(
            data = payload.records, 
            collection = payload.collection, 
        )

        response['output'] = {"data": rowcount, "message": f"{rowcount} number of record/s were inserted."}
        response['code'] = 200

        return JSONResponse(status_code = 200, content = response)

    except Exception as e:
        response['error'] = {"data": 0, "message": str(e)}
        response['code'] = 500

        traceback.print_exc()

        return JSONResponse(status_code = 500, content = response)

@router.post(f"/api/{mim_conf['api_version']}/retrieve_data/", status_code = 200)
async def retrieve_data(payload: RetrievePayload) -> dict:
    response = {}
    try:
        db_obj = VectorDatabase()

        data = db_obj.retrieve_data(
            query = payload.query, 
            collection = payload.collection, 
            columns = payload.columns,
            limit = payload.limit
        )
        response['output'] = {"data": data, "message": "Data retrieved successfully"}
        response['code'] = 200

        return JSONResponse(status_code = 200, content = response)

    except Exception as e:
        response['error'] = {"data": 0, "message": str(e)}
        response['code'] = 500

        # traceback.print_exc()

        return JSONResponse(status_code = 500, content = response)