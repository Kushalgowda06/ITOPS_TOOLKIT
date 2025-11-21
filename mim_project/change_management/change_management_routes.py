import os
import traceback

from fastapi import APIRouter
from typing import List, Optional
from pydantic import Field, BaseModel, model_validator
from fastapi.responses import JSONResponse
from .ctask_creator import ServiceNowChangeRequests
from .change_management import ChangeManagement
import json

SCRIPT_PATH = os.path.dirname(__file__)

router = APIRouter()

mim_conf_path = SCRIPT_PATH.split('/change_management')[0] + '/config/mim_conf.json'
mim_conf_file = open(mim_conf_path, 'r')
mim_conf = json.load(mim_conf_file)
mim_conf_file.close()

class CtaskPayload(BaseModel):
    chg_number: str = Field(..., description = "Enter Change Request number: ")

class DraftChangePayload(BaseModel):
    change_title : str = Field(..., description = "Title to create Change Request")
    change_purpose : str = Field(..., description = "Purpose of Change request")
    os_info: str = Field(..., description = "OS info to create Change request")
    uploaded_files: Optional[str] = Field(None, description="Architecture Filenames")
    config_items: Optional[str] = Field(None, description="Configuration Items")

    @model_validator(mode='after')
    def validate_at_least_one_required(self):
        if not self.uploaded_files and not self.config_items:
            raise ValueError("At least one of 'uploaded_files' or 'config_items' must be provided")
        return self

class CreateChangewithImapactPayload(BaseModel):
    uploaded_files : str = Field(..., description = "Architecture Filenames")
    config_items : str = Field(..., description = "Configaration Items")
    change : dict = Field(..., description = "Change Request with following details like short_description, description, change_model, implementation_plan, backout_plan, test_plan, risk_impact_analysis")

@router.post(f"/api/{mim_conf['api_version']}/create_ctask_for_change_request/", status_code=200)
async def create_ctask_for_change_request(payload: CtaskPayload) -> list:
    response = {}
    try:
        ctask_obj  = ServiceNowChangeRequests()

        output = ctask_obj.get_response_vector_db(payload.chg_number)

        response["code"]=200
        if output:
            response["output"]= {"data":output, "message": f"C-Tasks for change request {payload.chg_number} created successfully"}
        else:
            response["output"]= {"data":output, "message": "Error in creating C-Tasks"}
        return JSONResponse(status_code = 200, content = response)

    except Exception as e:
        response['code']=500
        response['error']= {'data':{}, 'message': str(e)}

        traceback.print_exc()

        return JSONResponse(status_code = 500, content = response)

@router.post(f"/api/{mim_conf['api_version']}/draft_change_prompt/", status_code=200)
async def draft_change_prompt(payload: DraftChangePayload) -> dict:
    response = {}
    try:
        chg_obj = ChangeManagement()

        output = chg_obj.draft_change_prompt(change_title = payload.change_title, change_purpose = payload.change_purpose , os_info = payload.os_info, uploaded_files = payload.uploaded_files, config_items = payload.config_items)

        response['output'] = {"data": output, "message":'Prompt created successfully'}
        response['code'] = 200

        return JSONResponse(status_code = 200, content = response)

    except Exception as e:
        response['error'] = {"data": {}, "message": str(e)}
        response['code'] = 500

        traceback.print_exc()

        return JSONResponse(status_code = 500, content = response)

@router.post(f"/api/{mim_conf['api_version']}/create_change_with_impact/", status_code=200)
async def create_change_with_impact(payload: CreateChangewithImapactPayload) -> dict:
    response = {}
    try:
        chg_obj = ChangeManagement()

        output = chg_obj.create_change_with_impact(uploaded_files = payload.uploaded_files, change = payload.change, config_items = payload.config_items)

        response['output'] = {"data": output, "message":'Change Request with Impact Created Successfully'}
        response['code'] = 200

        return JSONResponse(status_code = 200, content = response)

    except Exception as e:
        response['error'] = {"data": {}, "message": str(e)}
        response['code'] = 500

        traceback.print_exc()

        return JSONResponse(status_code = 500, content = response)
