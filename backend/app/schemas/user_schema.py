from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
	company_name: str = Field(min_length=2, max_length=120)
	email: EmailStr
	password: str = Field(min_length=8, max_length=128)
	role: Literal["admin", "user"] = "admin"


class UserLogin(BaseModel):
	email: EmailStr
	password: str


class UserInDB(BaseModel):
	id: str
	company_name: str
	email: EmailStr
	password_hash: str
	tenant_id: str
	role: Literal["admin", "user"]
	created_at: datetime


class UserPublic(BaseModel):
	id: str
	company_name: str
	email: EmailStr
	tenant_id: str
	role: Literal["admin", "user"]
	created_at: datetime


class TokenResponse(BaseModel):
	access_token: str
	token_type: str = "bearer"
