import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime
from app.core.database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(String, primary_key=True, default=lambda: f"rev_{uuid.uuid4().hex[:8]}")
    customer = Column(String, nullable=False)
    rating = Column(Integer, nullable=False)
    review_text = Column(Text, nullable=False)
    date = Column(String, nullable=True)
    sentiment = Column(String, default="Neutral", nullable=False)
    recurring_theme = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
