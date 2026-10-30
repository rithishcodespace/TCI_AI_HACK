from fastapi import APIRouter
from app.api.v1.endpoints import health, reviews

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["Reviews"])
