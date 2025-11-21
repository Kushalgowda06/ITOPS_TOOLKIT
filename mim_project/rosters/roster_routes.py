import os
import traceback

from fastapi import APIRouter
from typing import List, Optional
from pydantic import Field, BaseModel
from fastapi.responses import JSONResponse

#from .itsm_connector import *
from .stake_holder import EmployeeDirectory
import json 

SCRIPT_PATH = os.path.dirname(__file__)

router = APIRouter()
roster_file = SCRIPT_PATH + '/shift_schedule.xlsx'
mim_conf_path = SCRIPT_PATH.split('/rosters')[0] + '/config/mim_conf.json'
mim_conf_file = open(mim_conf_path, 'r')
mim_conf = json.load(mim_conf_file)
mim_conf_file.close()

class RosterPersonDepartment(BaseModel):
    input_tower: str = Field(..., description = "Tower name")

class RosterPersonNameShift(BaseModel):
    input_tower: str = Field(..., description = "Tower Name")
    date_input: str = Field(..., description = "Date in DD-MM-YYYY format")
    input_time: str = Field(..., description = "Time in HH:MM:SS format")

class RosterDepartmentPerson(BaseModel):
    person_name: str = Field(..., description = "Associate name")

@router.post(f"/api/{mim_conf['api_version']}/get_associate_by_department/", status_code=200)
async def get_associate_by_department(payload: RosterPersonDepartment) -> list:
    response = {}
    try:
        directory = EmployeeDirectory(roster_file)
        #directory = EmployeeDirectory('/etc/experiment/mim_project/rosters/shift_schedule.xlsx')

        output = directory.get_person_by_department(payload.input_tower)
        
        response["code"]=200
        if output != []:
       
            response["output"]= {"data":output, "message": "Person name by department name is successfully retrieved"}
        else:
            response["output"]= {"data":output, "message": "No data found"}

        return JSONResponse(status_code = 200, content = response)
    
    except:
        response['code']=500
        response['error']= {'data':{}, 'message': str(e)}

        traceback.print_exc()

        return JSONResponse(status_code = 500, content = response)

@router.post(f"/api/{mim_conf['api_version']}/get_department_by_associate/", status_code=200)
async def get_department_by_associate(payload: RosterDepartmentPerson) -> list:
    response = {}
    try:
        directory = EmployeeDirectory(roster_file)
        #directory = EmployeeDirectory('/etc/experiment/mim_project/rosters/shift_schedule.xlsx')

        output = directory.get_department_by_person(payload.person_name)
        
        response["code"]=200
        if output != []:

            response["output"]= {"data":output, "message": "Department name by person name is successfully retrieved"}
        
        else:
            response["output"]= {"data":output, "message": "No data found"}

        return JSONResponse(status_code = 200, content = response)


    except Exception as e:
        response['code']=500
        response['error']= {'data':{}, 'message': str(e)}

        traceback.print_exc()

        return JSONResponse(status_code = 500, content = response)

@router.post(f"/api/{mim_conf['api_version']}/get_associate_by_shift_and_tower/", status_code=200)
async def get_associate_by_shift_and_tower(payload: RosterPersonNameShift) -> list:
    response = {}
    try:
        directory = EmployeeDirectory(roster_file)
        #directory = EmployeeDirectory('/etc/experiment/mim_project/rosters/shift_schedule.xlsx')

        output = directory.get_person_by_shift_and_tower(payload.date_input, payload.input_time, payload.input_tower)
        
        
        response["code"]=200
        if output != []:
            response["output"]= {"data":output, "message": "Person name based on Date, Shift and Department successfully retrieved"}
        else:
            response["output"]= {"data":output, "message": "No data found"}
        return JSONResponse(status_code = 200, content = response)

    except Exception as e:
        response['code']=500
        response['error']= {'data':{}, 'message': str(e)}
        
        traceback.print_exc()

        return JSONResponse(status_code = 500, content = response)
