import os
import json

import traceback

from fastapi import APIRouter
from typing import List, Optional 
from pydantic import Field, BaseModel
from fastapi.responses import JSONResponse

from .sqldatabase_connector import *

SCRIPT_PATH = os.path.dirname(__file__)

router = APIRouter()

mim_conf_path = SCRIPT_PATH.split('/database')[0] + '/config/mim_conf.json'
mim_conf_file = open(mim_conf_path, 'r')
mim_conf = json.load(mim_conf_file)
mim_conf_file.close()

class RetrieveDataPayload(BaseModel):
    table_name: str
    columns: Optional[list] = []
    conditions: Optional[List[dict]] = []

class InsertDataPayload(BaseModel):
    table_name: str
    data: List[dict]

class UpdateDataPayload(BaseModel):
    table_name: str
    update_dict: dict
    conditions: Optional[List[dict]] = []

class DeleteDataPayload(BaseModel):
    table_name: str
    conditions: Optional[List[dict]] = []

@router.post(f"/api/{mim_conf['api_version']}/retrieve_sql_data/", status_code=200)
async def retrieve_data(payload: RetrieveDataPayload) -> dict:
    response = {}

    try:
        sqldb_obj = SQLDatabase()

        data = sqldb_obj.retrieve_data(
            table_name = payload.table_name,
            columns = payload.columns,
            conditions = payload.conditions
        )

        response["output"] = {"data": data, "message": "Data retrieved successfully"}
        response["code"] = 200

        return JSONResponse(status_code = 200, content = response)

    except Exception as e:
        response["error"] = {"data": [], "message": f"Failed to retrieve data - {str(e)}"}
        response["code"] = 500

        return JSONResponse(status_code = 500, content = response)

@router.post(f"/api/{mim_conf['api_version']}/insert_sql_data/", status_code=200)
async def insert_data(payload: InsertDataPayload) -> dict:
    response = {}

    try:
        sqldb_obj = SQLDatabase()

        data = sqldb_obj.insert_data(
            table_name = payload.table_name,
            data = payload.data
        )

        response["output"] = {"data": len(data), "message": "Data inserted successfully"}
        response["code"] = 200

        return JSONResponse(status_code = 200, content = response)

    except Exception as e:
        response["error"] = {"data": [], "message": f"Failed to insert data - {str(e)}"}
        response["code"] = 500

        return JSONResponse(status_code = 500, content = response)


@router.post(f"/api/{mim_conf['api_version']}/update_sql_data/", status_code=200)
async def update_data(payload: UpdateDataPayload) -> dict:
    response = {}

    try:
        sqldb_obj = SQLDatabase()

        data = sqldb_obj.update_data(
            table_name = payload.table_name,
            update_dict = payload.update_dict,
            conditions = payload.conditions
        )

        response["output"] = {"data": data, "message": f"{data} row updated successfully"}
        response["code"] = 200

        return JSONResponse(status_code = 200, content = response)

    except Exception as e:
        response["error"] = {"data": 0, "message": f"Failed to update data - {str(e)}"}
        response["code"] = 500

        return JSONResponse(status_code = 500, content = response)

    
@router.post(f"/api/{mim_conf['api_version']}/delete_sql_data/", status_code=200)
async def delete_data(payload: DeleteDataPayload) -> dict:
    response = {}

    try:
        sqldb_obj = SQLDatabase()

        data = sqldb_obj.delete_data(
            table_name = payload.table_name,
            conditions = payload.conditions
        )

        response["output"] = {"data": data, "message": f"{data} row/s deleted successfully"}
        response["code"] = 200

        return JSONResponse(status_code = 200, content = response)

    except Exception as e:
        response["error"] = {"data": 0, "message": f"Failed to delete data - {str(e)}"}
        response["code"] = 500

        return JSONResponse(status_code = 500, content = response)

