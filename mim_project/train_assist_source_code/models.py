from typing import List, Optional 
from pydantic import Field, BaseModel

class GenerateMCQPayload(BaseModel):
    articles_number: List[str] = Field(None, description = 'List of Article number up to 3, Referance: ["KB00001",  "KB00002", "KB00003"]')

class GetQuizQuestionsPayload(BaseModel):
    user_id: int = Field(None, description = "ID the of the user who is taking the quiz")
    quiz_code: str = Field(None, description = "Quiz code of the current user")
    type_of_submit: str = Field("start", description = "The type of submit, start or expired or refresh")

class SubmitQuizPayload(BaseModel):
    user_id: int = Field(None, description = "ID the of the user who is taking the quiz")
    quiz_code: str = Field(None, description = "Quiz code of the current user")
    type_of_submit: str = Field("submit", description = "The type of submit, submit/refresh/expire")
    questions: List[dict] = Field([], description = "Questions with user response filled")

class GenerateScenariosPayload(BaseModel):
    articles_number: str = Field(None, description = 'article number, Referance: "KB00001"')
    prompt:str = ""
    conv_history: list = []
    previous_question: list = []

class GetPendingQuizesPayload(BaseModel):
    user_id: int = Field(None, description = "ID the of the user who is taking the quiz")
    
