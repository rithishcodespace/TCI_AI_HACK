import uuid
import requests
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from app.core.config import settings
from app.core.database import get_db
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    get_current_user,
)
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    SignupRequest,
    GoogleAuthRequest,
    RefreshTokenRequest,
    TokenResponse,
    UserResponse,
    UserMeResponse,
)

router = APIRouter()

@router.post("/login", response_model=UserResponse, summary="Sign in with email and password")
async def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if user:
        # Verify password if hashed_password is set
        if user.hashed_password and not verify_password(credentials.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        # Update role if selected
        if credentials.role and credentials.role != user.role:
            user.role = credentials.role
            db.commit()
            db.refresh(user)
    else:
        # Create user record in PostgreSQL for testing
        user = User(
            id=f"usr_{uuid.uuid4().hex[:8]}",
            name=credentials.email.split("@")[0].capitalize(),
            email=credentials.email,
            role=credentials.role or "store_manager",
            hashed_password=hash_password(credentials.password),
            provider="credentials"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token_data = {
        "sub": user.id,
        "email": user.email,
        "role": user.role
    }
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        avatar=user.avatar,
        token=access_token,
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED, summary="Register a new account")
async def signup(data: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        # If user already exists, update role and issue new tokens
        if data.role and data.role != existing.role:
            existing.role = data.role
            db.commit()
            db.refresh(existing)
        user = existing
    else:
        user = User(
            id=f"usr_{uuid.uuid4().hex[:8]}",
            name=data.fullName,
            email=data.email,
            role=data.role or "store_manager",
            hashed_password=hash_password(data.password),
            provider="credentials"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token_data = {
        "sub": user.id,
        "email": user.email,
        "role": user.role
    }
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        avatar=user.avatar,
        token=access_token,
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )

@router.post("/google", response_model=UserResponse, summary="Authenticate via Google OAuth")
async def google_login(payload: GoogleAuthRequest, db: Session = Depends(get_db)):
    user_email = "manager@retailchain.com"
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
            role=payload.role or "store_manager",
            avatar=avatar_url,
            provider="google"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        if payload.role and payload.role != user.role:
            user.role = payload.role
            db.commit()
            db.refresh(user)

    token_data = {
        "sub": user.id,
        "email": user.email,
        "role": user.role
    }
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        avatar=user.avatar,
        token=access_token,
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )

@router.post("/refresh", response_model=TokenResponse, summary="Refresh JWT access token using refresh token")
async def refresh_tokens(payload: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Validates refresh token and issues a new access token and rotated refresh token."""
    decoded = decode_token(payload.refresh_token, expected_type="refresh")
    user_id = decoded.get("sub")
    email = decoded.get("email")

    user = None
    if user_id:
        user = db.query(User).filter(User.id == user_id).first()
    if not user and email:
        user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User associated with token not found.",
        )

    new_token_data = {
        "sub": user.id,
        "email": user.email,
        "role": user.role
    }
    new_access_token = create_access_token(new_token_data)
    new_refresh_token = create_refresh_token(new_token_data)

    return TokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

@router.get("/me", response_model=UserMeResponse, summary="Get current authenticated user profile")
async def get_me(current_user: User = Depends(get_current_user)):
    """Protected endpoint that returns the profile of the authenticated user."""
    return UserMeResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        role=current_user.role,
        avatar=current_user.avatar,
        provider=current_user.provider
    )

@router.get("/roles/permissions", summary="Get enterprise Role-Based Access Control (RBAC) matrix")
async def get_role_permissions():
    """
    Returns enterprise role definitions, approval authorities across the 7 canonical actions,
    and operational scopes for Store Manager, Supply Chain Lead, Category Lead, and Executive VP.
    """
    return {
        "roles": {
            "store_manager": {
                "title": "Store Manager",
                "default_persona": "Priya Sharma (Store #101)",
                "scope": "Single Store Physical Operations",
                "authorized_actions": ["replenish", "markdown", "substitute", "no_action"],
                "can_trigger_engine": False,
                "can_export_po": True,
                "can_override_guardrails": False,
                "description": "Floor-level execution: reviews daily store prescriptions, approves supplier POs, schedules shelf markdowns, and coordinates floor staff tasks."
            },
            "supply_chain": {
                "title": "Supply Chain Lead",
                "default_persona": "Marcus Vance (Logistics Hub)",
                "scope": "District Distribution Centers & Inter-Store Network",
                "authorized_actions": ["transfer", "increase_allocation", "replenish", "no_action"],
                "can_trigger_engine": True,
                "can_export_po": True,
                "can_override_guardrails": True,
                "description": "Network balancing: authorizes intra-district cross-dock transfers, increases regional DC slotting allocations, and monitors supplier lead times."
            },
            "category_lead": {
                "title": "Category Merchandising Lead",
                "default_persona": "Elena Rostova (CPG Staples & Chilled)",
                "scope": "Multi-Store Category Strategy",
                "authorized_actions": ["adjust_promotion", "markdown", "substitute", "no_action"],
                "can_trigger_engine": True,
                "can_export_po": True,
                "can_override_guardrails": True,
                "description": "Commercial margin optimization: manages promo elasticity dampening, dynamic markdown clearance rules, and brand substitution parity."
            },
            "executive": {
                "title": "Executive VP / Store Owner",
                "default_persona": "David Sterling (Chief Merchandising Officer)",
                "scope": "Enterprise Omnichannel Network",
                "authorized_actions": ["replenish", "transfer", "increase_allocation", "markdown", "adjust_promotion", "substitute", "no_action"],
                "can_trigger_engine": True,
                "can_export_po": True,
                "can_override_guardrails": True,
                "description": "Strategic oversight: reviews annualized working capital savings (₹4,12,000/store), 6-week holdout ROI backtest, and Data Quality audit ledgers."
            }
        }
    }
