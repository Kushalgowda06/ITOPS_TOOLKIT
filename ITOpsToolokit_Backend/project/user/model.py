#model.py
from pydantic import BaseModel, Field, EmailStr
from database_config import Base
from sqlalchemy import Boolean, Column, Integer, String
from typing import Optional

################ SQL DB Models###########
class UserSQL(Base):
    __tablename__='users'

    id=Column(Integer, primary_key=True, index=True)
    fullname=Column(String(50), unique=False)
    email=Column(String(100), unique=True, index=True)
    password=Column(String(100), unique=False)





###############Pyndatic Models #############################


class UserSchema(BaseModel):
    fullname: str = Field(...)
    email: EmailStr = Field(...)
    password: str = Field(...)

    class Config:
        json_schema_extra = {
            "example": {
                "fullname": "Joe Doe",
                "email": "joe@xyz.com",
                "password": "any"
            }
        }

class UserLoginSchema(BaseModel):
    email: EmailStr = Field(...)
    password: str = Field(...)

    class Config:
        json_schema_extra = {
            "example": {
                "email": "joe@xyz.com",
                "password": "any"
            }
        }





class UpdateUserSchema(BaseModel):
    fullname: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "fullname": "Updated Name",
                "email": "newemail@xyz.com",
                "password": "newpassword"
            }
        }
