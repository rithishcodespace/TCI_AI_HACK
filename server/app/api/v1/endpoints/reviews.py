from typing import List
from fastapi import APIRouter, HTTPException, status
from app.schemas.review import Review, ReviewCreate, AnalysisSummary
from app.services.review_service import ReviewService

router = APIRouter()

@router.get("/", response_model=List[Review], summary="Get all reviews")
async def get_reviews():
    """Retrieve all parsed customer reviews."""
    return ReviewService.get_all_reviews()

@router.post("/", response_model=Review, status_code=status.HTTP_201_CREATED, summary="Add a single review")
async def create_review(review_in: ReviewCreate):
    """Add a customer review."""
    return ReviewService.create_review(review_in)

@router.get("/insights", response_model=AnalysisSummary, summary="Get AI analysis summary")
async def get_analysis_insights():
    """Get sentiment distribution and actionable AI insights."""
    return ReviewService.analyze_reviews()
