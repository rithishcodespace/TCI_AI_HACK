from typing import Optional
from pydantic import BaseModel

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

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    avatar: Optional[str] = None
    token: str  # Kept for backward compatibility with existing frontend calls
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class UserMeResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    avatar: Optional[str] = None
    provider: str
