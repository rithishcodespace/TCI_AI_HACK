import uuid
from typing import List
from app.schemas.review import ReviewCreate, Review, AnalysisSummary

# In-memory storage placeholder
_reviews_db: List[Review] = []

class ReviewService:
    @staticmethod
    def get_all_reviews() -> List[Review]:
        return _reviews_db

    @staticmethod
    def create_review(review_in: ReviewCreate) -> Review:
        # Determine basic sentiment based on rating for demo
        sentiment = "Neutral"
        if review_in.rating >= 4:
            sentiment = "Positive"
        elif review_in.rating <= 2:
            sentiment = "Negative"

        new_review = Review(
            id=str(uuid.uuid4())[:8],
            customer=review_in.customer,
            rating=review_in.rating,
            review_text=review_in.review_text,
            date=review_in.date,
            sentiment=sentiment,
            recurring_theme="Product Quality" if review_in.rating >= 4 else "Customer Support",
        )
        _reviews_db.append(new_review)
        return new_review

    @staticmethod
    def analyze_reviews() -> AnalysisSummary:
        total = len(_reviews_db)
        if total == 0:
            return AnalysisSummary(
                total_reviews=0,
                sentiment_distribution={"Positive": 0, "Neutral": 0, "Negative": 0},
                top_recurring_themes=[],
                actionable_ai_insights=["Upload reviews to generate insights."]
            )

        positives = sum(1 for r in _reviews_db if r.sentiment == "Positive")
        negatives = sum(1 for r in _reviews_db if r.sentiment == "Negative")
        neutrals = total - positives - negatives

        return AnalysisSummary(
            total_reviews=total,
            sentiment_distribution={
                "Positive": round((positives / total) * 100, 1),
                "Neutral": round((neutrals / total) * 100, 1),
                "Negative": round((negatives / total) * 100, 1),
            },
            top_recurring_themes=["App Performance", "Customer Service", "Pricing & Billing"],
            actionable_ai_insights=[
                "Address mobile checkout stability to decrease negative feedback.",
                "Highlight positive customer support satisfaction in onboarding."
            ]
        )
