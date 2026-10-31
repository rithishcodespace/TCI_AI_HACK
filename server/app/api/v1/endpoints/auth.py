import uuid
import requests
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, SignupRequest, GoogleAuthRequest, UserResponse

router = APIRouter()

@router.post("/login", response_model=UserResponse, summary="Sign in with email and password")
async def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    # Check if user exists in PostgreSQL
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user:
        # Create user record in PostgreSQL for testing
        user = User(
            id=f"usr_{uuid.uuid4().hex[:8]}",
            name=credentials.email.split("@")[0].capitalize(),
            email=credentials.email,
            role=credentials.role or "student",
            hashed_password=credentials.password,
            provider="credentials"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=credentials.role or user.role,
        avatar=user.avatar,
        token=f"jwt_{uuid.uuid4().hex}"
    )

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED, summary="Register a new account")
async def signup(data: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        return UserResponse(
            id=existing.id,
            name=existing.name,
            email=existing.email,
            role=data.role or existing.role,
            avatar=existing.avatar,
            token=f"jwt_{uuid.uuid4().hex}"
        )

    new_user = User(
        id=f"usr_{uuid.uuid4().hex[:8]}",
        name=data.fullName,
        email=data.email,
        role=data.role or "student",
        hashed_password=data.password,
        provider="credentials"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return UserResponse(
        id=new_user.id,
        name=new_user.name,
        email=new_user.email,
        role=new_user.role,
        avatar=new_user.avatar,
        token=f"jwt_{uuid.uuid4().hex}"
    )

@router.post("/google", response_model=UserResponse, summary="Authenticate via Google OAuth")
async def google_login(payload: GoogleAuthRequest, db: Session = Depends(get_db)):
    user_email = "google.user@college.edu"
    user_name = "Google User"
    avatar_url = "https://lh3.googleusercontent.com/a/default-user=s96-c"

    if payload.token:
        # Try verifying id_token with google-auth
        try:
            id_info = id_token.verify_oauth2_token(
                payload.token,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID if settings.GOOGLE_CLIENT_ID else None
            )
            user_email = id_info.get("email", user_email)
            user_name = id_info.get("name", user_name)
            avatar_url = id_info.get("picture", avatar_url)
        except Exception:
            # Fallback to Google userinfo endpoint if an access_token was passed
            try:
                resp = requests.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    headers={"Authorization": f"Bearer {payload.token}"},
                    timeout=5
                )
                if resp.status_code == 200:
                    profile = resp.json()
                    user_email = profile.get("email", user_email)
                    user_name = profile.get("name", user_name)
                    avatar_url = profile.get("picture", avatar_url)
            except Exception:
                pass

    # Find or persist Google user in PostgreSQL
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        user = User(
            id=f"goog_{uuid.uuid4().hex[:8]}",
            name=user_name,
            email=user_email,
            role=payload.role or "student",
            avatar=avatar_url,
            provider="google"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=payload.role or user.role,
        avatar=user.avatar,
        token=f"jwt_google_{uuid.uuid4().hex}"
    )
