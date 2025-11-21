# Author - Vishwas K S

import os
import json

import traceback

from .config import *
from .models import *

from fastapi import APIRouter
from typing import List, Optional 
from pydantic import Field, BaseModel
from fastapi.responses import JSONResponse

SCRIPT_PATH = os.path.dirname(__file__)

router = APIRouter()

conf_obj = Configuration()
api_version = conf_obj.retrieve_config(["api_version"])[0][1]

# API Endpoint to retrieve configuration from the database.
@router.post(f"/api/{api_version}/retrieve_config/", status_code=200)
async def retrieve_config(payload: RetrieveConfigPayload) -> dict:
    response = {}

    try:
        data = conf_obj.retrieve_config(
            keys = payload.keys
        )

        response["output"] = {"data": data, "message": "config retrieved successfully"}
        response["code"] = 200

        return JSONResponse(status_code = 200, content = response)

    except Exception as e:
        response["error"] = {"data": [], "message": f"Failed to retrieve config - {str(e)}"}
        response["code"] = 500

        return JSONResponse(status_code = 500, content = response)

# API Endpoint to insert configuration to the database.
@router.post(f"/api/{api_version}/insert_config/", status_code=200)
async def retrieve_config(payload: InsertConfigPayload) -> dict:
    response = {}

    try:
        data = conf_obj.insert_config(
            records = payload.records
        )

        response["output"] = {"data": data, "message": "config inserted successfully"}
        response["code"] = 200

        return JSONResponse(status_code = 200, content = response)

    except Exception as e:
        response["error"] = {"data": [], "message": f"Failed to insert config - {str(e)}"}
        response["code"] = 500

        return JSONResponse(status_code = 500, content = response)

# API Endpoint to update configuration to the database.
@router.post(f"/api/{api_version}/update_config/", status_code=200)
async def retrieve_config(payload: UpdateConfigPayload) -> dict:
    response = {}

    try:
        data = conf_obj.update_config(
            update_key = payload.update_key,
            update_val = payload.update_val,
            conditions = payload.conditions
        )

        response["output"] = {"data": data, "message": "config updated successfully"}
        response["code"] = 200

        return JSONResponse(status_code = 200, content = response)

    except Exception as e:
        response["error"] = {"data": [], "message": f"Failed to update config - {str(e)}"}
        response["code"] = 500

        return JSONResponse(status_code = 500, content = response)

# API Endpoint to delete configuration from the database.
@router.post(f"/api/{api_version}/delete_config/", status_code=200)
async def retrieve_config(payload: DeleteConfigPayload) -> dict:
    response = {}

    try:
        data = conf_obj.update_config(
            conditions = payload.conditions
        )

        response["output"] = {"data": data, "message": "config deleted successfully"}
        response["code"] = 200

        return JSONResponse(status_code = 200, content = response)

    except Exception as e:
        response["error"] = {"data": [], "message": f"Failed to delete config - {str(e)}"}
        response["code"] = 500

        return JSONResponse(status_code = 500, content = response)
