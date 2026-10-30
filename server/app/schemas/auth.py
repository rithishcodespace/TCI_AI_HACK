from typing import Optional
from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    email: str
    password: str
    role: Optional[str] = "student"

class SignupRequest(BaseModel):
    fullName: str
    email: str
    password: str
    role: Optional[str] = "student"

class GoogleAuthRequest(BaseModel):
    token: Optional[str] = None
    role: Optional[str] = "student"

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    avatar: Optional[str] = None
    token: str
