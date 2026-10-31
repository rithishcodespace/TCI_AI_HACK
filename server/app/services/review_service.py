import uuid
from typing import List
from sqlalchemy.orm import Session
from app.models.review import Review as ReviewModel
from app.schemas.review import ReviewCreate, AnalysisSummary

class ReviewService:
    @staticmethod
    def get_all_reviews(db: Session) -> List[ReviewModel]:
        return db.query(ReviewModel).order_by(ReviewModel.created_at.desc()).all()

    @staticmethod
    def create_review(db: Session, review_in: ReviewCreate) -> ReviewModel:
        sentiment = "Neutral"
        if review_in.rating >= 4:
            sentiment = "Positive"
        elif review_in.rating <= 2:
            sentiment = "Negative"

        new_review = ReviewModel(
            id=f"rev_{uuid.uuid4().hex[:8]}",
            customer=review_in.customer,
            rating=review_in.rating,
            review_text=review_in.review_text,
            date=review_in.date,
            sentiment=sentiment,
            recurring_theme="Product Quality" if review_in.rating >= 4 else "Customer Support",
        )
        db.add(new_review)
        db.commit()
        db.refresh(new_review)
        return new_review

    @staticmethod
    def analyze_reviews(db: Session) -> AnalysisSummary:
        reviews = db.query(ReviewModel).all()
        total = len(reviews)
        if total == 0:
            return AnalysisSummary(
                total_reviews=0,
                sentiment_distribution={"Positive": 0, "Neutral": 0, "Negative": 0},
                top_recurring_themes=[],
                actionable_ai_insights=["Connect store inventory and demand velocity signals to generate retail decision intelligence."]
            )

        positives = sum(1 for r in reviews if r.sentiment == "Positive")
        negatives = sum(1 for r in reviews if r.sentiment == "Negative")
        neutrals = total - positives - negatives

        return AnalysisSummary(
            total_reviews=total,
            sentiment_distribution={
                "Positive": round((positives / total) * 100, 1),
                "Neutral": round((neutrals / total) * 100, 1),
                "Negative": round((negatives / total) * 100, 1),
            },
            top_recurring_themes=[
                "Fresh Staples & Grains Stockout",
                "Perishable Clearance & Dynamic Markdowns",
                "Promotion Run-Rate Dampening",
                "Inter-Store Inventory Balancing",
                "Supplier Lead-Time Reliability"
            ],
            actionable_ai_insights=[
                "Expedite PO for Basmati Rice (2.1 days cover vs 6-day lead time) to prevent ₹38,000 lost margin.",
                "Execute dynamic 25% markdown on Celebration Gift Boxes to clear inventory 22 days before expiry.",
                "Dampen sunflower oil promotion discount from 20% to 10% to extend inventory cover by 6 days."
            ]
        )
