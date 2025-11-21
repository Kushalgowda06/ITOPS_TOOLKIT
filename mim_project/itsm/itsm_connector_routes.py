import os
import traceback

from fastapi import APIRouter
from typing import List, Optional 
from pydantic import Field, BaseModel, model_validator
from fastapi.responses import JSONResponse

from .itsm_connector import *
#from .change_management import ChangeManagement
#import tech_buddy_autogen as tech_buddy

SCRIPT_PATH = os.path.dirname(__file__)

router = APIRouter()

mim_conf_path = SCRIPT_PATH.split('/itsm')[0] + '/config/mim_conf.json'
mim_conf_file = open(mim_conf_path, 'r')
mim_conf = json.load(mim_conf_file)
mim_conf_file.close()

class GetTicketPayload(BaseModel):
    start_ts: Optional[str] = Field(None, description = "Start time should be in %Y-%m-%d %H:%M:%S format")
    end_ts: Optional[str] = Field(None, description = "End time should be in %Y-%m-%d %H:%M:%S format")
    conditions: Optional[List[dict]] = Field(None, description = 'Referance [{"param": "column name", "op": "opetation to be performed", "val": "value"}]')

class KnowledgePayload(BaseModel):
    #number: Optional[str] = Field(None, description = "KB article number")
    conditions: Optional[List[dict]] = Field(None, description = 'Referance [{"param": "column name", "op": "opetation to be performed", "val": "value"}]')

class UpdateKnowledgePayload(BaseModel):
    sys_id : str = Field(..., description = "KB's sys_id")
    text : str = Field(..., description = "Article body Text")

class ChangePayload(BaseModel):
    start_ts: Optional[str] = Field(None, description = "Start time should be in %Y-%m-%d %H:%M:%S format")
    end_ts: Optional[str] = Field(None, description = "End time should be in %Y-%m-%d %H:%M:%S format")
    conditions: Optional[List[dict]] = Field(None, description = 'Referance [{"param": "column name", "op": "opetation to be performed", "val": "value"}]')


class CMDB_Payload(BaseModel):
    sys_id: str = Field(..., description = "CI's sys_id")
    target: str = Field(..., description = "Parent / Child")
    service_map: Optional[list] = Field([], description = "service map of CI")

class CmdbCIPayload(BaseModel):
    ci: str = Field(..., description = "CI name or IP")

'''
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

class CreateChangePayload(BaseModel):
    prompt : str = Field(..., description = "Prompt to create Change Request")


class CreateChangewithImapactPayload(BaseModel):
    uploaded_files : str = Field(..., description = "Architecture Filenames")
    config_items : str = Field(..., description = "Configaration Items")
    change : dict = Field(..., description = "Change Request with following details like short_description, description, change_model, implementation_plan, backout_plan, test_plan, risk_impact_analysis")
'''

@router.post(f"/api/{mim_conf['api_version']}/get_ticket_details/", status_code=200)
async def get_ticket_details(payload: GetTicketPayload) -> dict:
    response = {}
    try:
        itsm_obj = ITSM()

        data = itsm_obj.get_ticket_details(start_ts = payload.start_ts , end_ts = payload.end_ts, conditions = payload.conditions)

        response['output'] = {"data": data, "message":'Tickets retrieved successfully'}
        response['code'] = 200

        return JSONResponse(status_code = 200, content = response)
    
    except Exception as e:
        response['error'] = {"data": {}, "message": str(e)}
        response['code'] = 500

        traceback.print_exc()

        return JSONResponse(status_code = 500, content = response)

@router.post(f"/api/{mim_conf['api_version']}/get_kb_articles_details/", status_code=200)
async def get_kb_articles_details(payload: KnowledgePayload) -> dict:
    response = {}
    try:
        itsm_obj = ITSM()

        data = itsm_obj.get_kb_articles_details(conditions = payload.conditions)

        response['code'] = 200

        if data:
            response['output'] = {"data": data, "message":'KB article Details Retrieved Successfully'}
            #response['code'] = 200
        else:
            response['output'] = {"data": data, "message":'KB articles not found'}

        return JSONResponse(status_code = 200, content = response)

    except Exception as e:
        
        response['error'] = {"data": {}, "message": str(e)}
        response['code'] = 500

        #traceback.print_exc()

        return JSONResponse(status_code = 500, content = response)


@router.post(f"/api/{mim_conf['api_version']}/update_knowledge_article/", status_code=200)
async def update_knowledge_article(payload: UpdateKnowledgePayload) -> dict:
    response = {}
    try:
        itsm_obj = ITSM()

        data = itsm_obj.update_knowledge_article(sys_id = payload.sys_id, text = payload.text)

        print(data)
        response['code'] = 200

        if data:
            response['output'] = {"data": data, "message":'KB article Updated Successfully'}
            #response['code'] = 200
        else:
            response['output'] = {"data": data, "message":'KB articles not found'}

        return JSONResponse(status_code = 200, content = response)

    except Exception as e:

        response['error'] = {"data": {}, "message": str(e)}
        response['code'] = 500

        #traceback.print_exc()

        return JSONResponse(status_code = 500, content = response)



@router.post(f"/api/{mim_conf['api_version']}/get_dependancy_views/", status_code=200)
async def get_parents_children(payload: CMDB_Payload) -> dict:
    response = {}
    try:
        itsm_obj = ITSM()

        output = itsm_obj.get_parents_children(payload.sys_id, payload.target, payload.service_map)

        response['output'] = {"data": output, "message":'Retrieved Hierarchy Successfully'}
        response['code'] = 200

        return JSONResponse(status_code = 200, content = response)

    except Exception as e:
        response['error'] = {"data": {}, "message": str(e)}
        response['code'] = 500

        traceback.print_exc()

        return JSONResponse(status_code = 500, content = response)

@router.post(f"/api/{mim_conf['api_version']}/get_change_request_details/", status_code=200)
async def get_change_request_details(payload: ChangePayload) -> dict:
    response = {}
    try:
        itsm_obj = ITSM()

        data = itsm_obj.get_change_request_details(start_ts = payload.start_ts , end_ts = payload.end_ts, conditions = payload.conditions)

        #response['output'] = {"data": output, "message":'Change request details Retrieved Successfully'}
        response['code'] = 200
        if data:
            response['output'] = {"data": data, "message":'Change request Details Retrieved Successfully'}
            #response['code'] = 200
        else:
            response['output'] = {"data": data, "message":'No Change request found'}


        return JSONResponse(status_code = 200, content = response)

    except Exception as e:
        response['error'] = {"data": {}, "message": str(e)}
        response['code'] = 500

        traceback.print_exc()

        return JSONResponse(status_code = 500, content = response)

@router.post(f"/api/{mim_conf['api_version']}/get_cmdb_ci_details/", status_code=200)
async def get_cmdb_ci(payload: CmdbCIPayload) -> dict:
    response = {}
    try:
        itsm_obj = ITSM()

        output = itsm_obj.get_cmdb_ci(payload.ci)

        response['output'] = {"data": output, "message":'CI  details Retrieved Successfully'}
        response['code'] = 200

        return JSONResponse(status_code = 200, content = response)

    except Exception as e:
        response['error'] = {"data": {}, "message": str(e)}
        response['code'] = 500

        traceback.print_exc()

        return JSONResponse(status_code = 500, content = response)

'''
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

'''
