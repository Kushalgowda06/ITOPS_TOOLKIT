from typing import List, Optional 
from pydantic import Field, BaseModel

class RetrieveConfigPayload(BaseModel):
    keys: list = []

class InsertConfigPayload(BaseModel):
    records: List[dict] = []

class UpdateConfigPayload(BaseModel):
    update_key: str 
    update_val: str 
    conditiond: List[dict]

class DeleteConfigPayload(BaseModel):
    conditiond: List[dict]