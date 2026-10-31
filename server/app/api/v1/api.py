from fastapi import APIRouter
from app.api.v1.endpoints import health, reviews, auth, decisions

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(decisions.router, prefix="/decisions", tags=["Decisions"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["Reviews"])

