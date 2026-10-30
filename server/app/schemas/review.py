from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field

class ReviewBase(BaseModel):
    customer: str = Field(..., description="Customer name or ID")
    rating: int = Field(..., ge=1, le=5, description="Rating from 1 to 5")
    review_text: str = Field(..., description="Review content")
    date: Optional[str] = Field(None, description="Date of the review")

class ReviewCreate(ReviewBase):
    pass

class Review(ReviewBase):
    id: str
    sentiment: Optional[str] = Field("Neutral", description="Positive, Neutral, or Negative")
    recurring_theme: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

class ReviewBatchAnalysisRequest(BaseModel):
    reviews: List[ReviewCreate]

class AnalysisSummary(BaseModel):
    total_reviews: int
    sentiment_distribution: dict
    top_recurring_themes: List[str]
    actionable_ai_insights: List[str]
