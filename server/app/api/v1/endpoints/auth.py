import uuid
from fastapi import APIRouter, HTTPException, status
from app.schemas.auth import LoginRequest, SignupRequest, GoogleAuthRequest, UserResponse

router = APIRouter()

# In-memory users for demonstration
_users_db = {
    "you@college.edu": {
        "id": "usr_01",
        "name": "Rithish",
        "email": "you@college.edu",
        "password": "password123",
        "role": "student"
    }
}

@router.post("/login", response_model=UserResponse, summary="Sign in with email and password")
async def login(credentials: LoginRequest):
    user = _users_db.get(credentials.email)
    if not user:
        # Auto-create demo user if not found for seamless testing
        user = {
            "id": f"usr_{uuid.uuid4().hex[:6]}",
            "name": credentials.email.split("@")[0].capitalize(),
            "email": credentials.email,
            "password": credentials.password,
            "role": credentials.role or "student"
        }
        _users_db[credentials.email] = user

    return UserResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        role=credentials.role or user.get("role", "student"),
        token=f"jwt_{uuid.uuid4().hex}"
    )

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED, summary="Register a new account")
async def signup(data: SignupRequest):
    new_user = {
        "id": f"usr_{uuid.uuid4().hex[:6]}",
        "name": data.fullName,
        "email": data.email,
        "password": data.password,
        "role": data.role or "student"
    }
    _users_db[data.email] = new_user

    return UserResponse(
        id=new_user["id"],
        name=new_user["name"],
        email=new_user["email"],
        role=new_user["role"],
        token=f"jwt_{uuid.uuid4().hex}"
    )

@router.post("/google", response_model=UserResponse, summary="Authenticate via Google OAuth")
async def google_login(payload: GoogleAuthRequest):
    # In production, verify Google id_token with google.oauth2.id_token.verify_oauth2_token
    # For dev & demo, create/return authenticated Google user
    return UserResponse(
        id=f"goog_{uuid.uuid4().hex[:6]}",
        name="Google User",
        email="google.user@college.edu",
        role=payload.role or "student",
        avatar="https://lh3.googleusercontent.com/a/default-user=s96-c",
        token=f"jwt_google_{uuid.uuid4().hex}"
    )
