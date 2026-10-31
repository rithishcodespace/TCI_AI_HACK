import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: f"usr_{uuid.uuid4().hex[:8]}")
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, default="student", nullable=False)
    hashed_password = Column(String, nullable=True)
    avatar = Column(String, nullable=True)
    provider = Column(String, default="credentials", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
