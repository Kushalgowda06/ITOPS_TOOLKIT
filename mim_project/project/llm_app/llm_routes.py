from fastapi import APIRouter, Body, Depends
from project.user.model import *
from project.auth.auth_handler import signJWT,decodeJWT
from project.auth.auth_bearer import JWTBearer

from llm_utils import *
import os, sys, datetime, json, requests
from typing import *
from configuration import config
from loguru import logger
import uuid
from fastapi.responses import JSONResponse
from project.llm_app.llm_utils import *

from fastapi import HTTPException
from project.llm_app.model import *

import traceback

import icecream as ic

###########################

logger_llm = logger.bind(api="llm_app_details")
logger_llm.add("project/logs/llm_app_log.log", rotation="100 MB", retention="10 days", level="INFO", backtrace=True, diagnose=True)

current_user="system"

router = APIRouter()

@router.post(f"/api/{config['version']}/ask_llm_in_isolation/", status_code=200, response_model=ResponseModel)
async def ask_llm_in_isolation(payload: LLMRequest):
    response={}
    #logger_llm.info(f"API llm_generated_response called {current_user}")
    try:
        
        query = payload.query

        llm_instance = LLM_utils()
        output_response = llm_instance.ask_llm(query)

        response["code"] = 200
        response["output"] = {"data":output_response, 
                            "message": "LLM response successfully generated"}

        return response
    except Exception as e:
        traceback_str = traceback.format_exc()

        #logger_llm.error(f"llm_generated_response failed, error: {str(e)}  traceback :{traceback_str}")
        response["code"] = 403
        response["error"] = {"data":{}, "message": str(e)}

        print(f"Error in the LLM route {str(e)}, {traceback_str}")
        return response

@router.post(f"/api/{config['version']}/merge_kb_articles/", status_code=200)
async def route_merge_kb_articles(payload: merge_kb_model):



    kb_article_1=payload.kb_article_1
    kb_article_2=payload.kb_article_2



    llm_instance=LLM_utils()
    output_response=llm_instance.merge_kb_articles(kb_article_1, kb_article_2)



    return JSONResponse(content=output_response)


@router.post(f"/api/{config['version']}/refine_kb_articles/", status_code=200)
async def route_refine_kb_articles(payload: refine_kb_model):

    kb_article=payload.kb_article


    llm_instance=LLM_utils()
    output_response=llm_instance.refine_kb_article(kb_article)



    return JSONResponse(content=output_response)
