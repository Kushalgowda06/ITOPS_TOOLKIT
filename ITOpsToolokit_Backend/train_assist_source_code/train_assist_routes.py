import os
import json
import traceback
from datetime import datetime, timedelta

from fastapi import APIRouter
from typing import List, Optional 
from fastapi.responses import JSONResponse

from .models import *
from .train_assist_utils import TrainAssist


SCRIPT_PATH = os.path.dirname(__file__)

router = APIRouter()

class CustomError(Exception):
    """Custom exception for application-specific errors."""
    def __init__(self, message):
        super().__init__(message)
        self.message = message


@router.post(f"/api/v1/generate_mcqs/", status_code=200)
async def generate_mcqs(payload: GenerateMCQPayload):
    response = {}
    try:
        ta_obj = TrainAssist()
        data = ta_obj.generate_mcqs(articles_number = payload.articles_number)

        response["output"] = {"data": data, "message": "Quiz Generated Successfully!"}
        response['code'] = 200

        return JSONResponse(status_code = 200, content = response)

    except Exception as e:
        response["error"] = {"data": {}, "message": str(e)}
        response['code'] = 500

        traceback.print_exc()

        return JSONResponse(status_code = 500, content = response)  

@router.post(f"/api/v1/generate_scenarios/", status_code=200)
async def generate_scenarios(payload: GenerateScenariosPayload):
    response = {}
    try:
        ta_obj = TrainAssist()

        llm_response, conv_history = ta_obj.generate_scenarios(
            articles_number = payload.articles_number,
            prompt = payload.prompt,
            conv_history = payload.conv_history,
            previous_question = payload.previous_question
            )

        data = {}
        data['response'] = llm_response
        data['conv_history'] = conv_history

        response["output"] = {"data": data, "message": "Scenario Generated Successfully!"}
        response['code'] = 200

        return JSONResponse(status_code = 200, content = response)

    except Exception as e:
        response["error"] = {"data": {}, "message": str(e)}
        response['code'] = 500

        traceback.print_exc()

        return JSONResponse(status_code = 500, content = response)
      

@router.post(f"/api/v1/get_mcqs/", status_code=200)
async def get_mcqs(payload:GetQuizQuestionsPayload):
    response = {}
    ta_obj = TrainAssist()

    try:
        data = ta_obj.get_mcqs(quiz_code = payload.quiz_code, user_id = payload.user_id, type_of_submit = payload.type_of_submit)

        response["output"] = {"data": data, "message": "Success"}
        response['code'] = 200

        return JSONResponse(status_code = 200, content = response)
       
    except Exception as e:
        response["error"] = {"data": {}, "message": str(e)}
        response['code'] = 200

        traceback.print_exc()

        return JSONResponse(status_code = 500, content = response)

    
@router.post(f"/api/v1/submit_quiz/", status_code=200)
async def submit_quiz(payload:SubmitQuizPayload):
    response = {}
    ta_obj = TrainAssist()

    try:
        data = ta_obj.submit_quiz(quiz_code = payload.quiz_code, user_id = payload.user_id, type_of_submit = payload.type_of_submit, questions = payload.questions)

        response["output"] = {"data": data, "message": "Success"}
        response['code'] = 200

        return JSONResponse(status_code = 200, content = response)
       
    except Exception as e:
        response["error"] = {"data": {}, "message": str(e)}
        response['code'] = 200

        traceback.print_exc()

        return JSONResponse(status_code = 500, content = response)
        

    
        





