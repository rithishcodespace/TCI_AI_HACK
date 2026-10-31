from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.review import Review, ReviewCreate, AnalysisSummary
from app.services.review_service import ReviewService

router = APIRouter()

@router.get("/", response_model=List[Review], summary="Get all reviews")
async def get_reviews(db: Session = Depends(get_db)):
    """Retrieve all parsed customer reviews from PostgreSQL."""
    return ReviewService.get_all_reviews(db)

@router.post("/", response_model=Review, status_code=status.HTTP_201_CREATED, summary="Add a single review")
async def create_review(review_in: ReviewCreate, db: Session = Depends(get_db)):
    """Add a customer review and save to PostgreSQL."""
    return ReviewService.create_review(db, review_in)

@router.get("/insights", response_model=AnalysisSummary, summary="Get AI analysis summary")
async def get_analysis_insights(db: Session = Depends(get_db)):
    """Get sentiment distribution and actionable AI insights from PostgreSQL reviews."""
    return ReviewService.analyze_reviews(db)
