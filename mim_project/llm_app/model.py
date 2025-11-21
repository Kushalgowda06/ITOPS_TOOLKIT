
from pydantic import BaseModel
from typing import Optional
from typing import List, Optional, Dict, Any, Union


class SuccessResponse(BaseModel):
    code: int
    output: Dict[str, Any]

class ErrorResponse(BaseModel):
    code: int
    error: Dict[str, Any]
    

ResponseModel = Union[SuccessResponse, ErrorResponse]

class LLMRequest(BaseModel):
    query: str

class LLMRequestWithContext(BaseModel):
    query: str
    context: dict
