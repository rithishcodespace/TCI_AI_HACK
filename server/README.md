# VoiceOfCustomer Backend (FastAPI + PostgreSQL)

Production-ready FastAPI backend for VoiceOfCustomer feedback intelligence, connected to PostgreSQL with SQLAlchemy ORM.

## 📁 Project Structure

```
server/
├── app/
│   ├── __init__.py
│   ├── main.py                  # App initialization, lifespan table setup, CORS & routes
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py            # Pydantic Settings & environment variables
│   │   └── database.py          # SQLAlchemy engine, SessionLocal, get_db dependency
│   ├── api/
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── api.py           # V1 Router aggregator
│   │       └── endpoints/
│   │           ├── __init__.py
│   │           ├── auth.py      # Login, Signup, and Google OAuth with PostgreSQL
│   │           ├── health.py    # Health check endpoint
│   │           └── reviews.py   # PostgreSQL Reviews & AI analysis endpoints
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py              # User model (id, email, name, role, avatar, provider)
│   │   └── review.py            # Review model (id, customer, rating, text, sentiment)
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth.py              # Auth request & response schemas
│   │   └── review.py            # Review request & response models
│   └── services/
│       ├── __init__.py
│       └── review_service.py    # Business logic & PostgreSQL operations
├── .env                         # Local environment variables
├── .env.example                 # Example environment variables template
├── .gitignore                   # Ignored files (venv, pycache, env)
├── requirements.txt             # Python dependencies
└── README.md                    # Documentation
```

## 🐘 PostgreSQL Connection Details

The database is initialized and accepting connections on localhost:
- **Database**: `voiceofcustomer_db`
- **Username**: `voc_user`
- **Password**: `voc_password`
- **Port**: `5432`
- **Connection URI**:
  ```
  postgresql://voc_user:voc_password@localhost:5432/voiceofcustomer_db
  ```

Tables created automatically on startup:
- `users`: Registered users, credentials, roles (`student`, `canteen_manager`, `admin`), and Google OAuth profiles.
- `reviews`: Customer feedback, ratings (1–5), calculated sentiment, and recurring themes.

## 🚀 Getting Started

### 1. Activate Virtual Environment
```bash
cd server
source .venv/bin/activate
```

### 2. Run the Development Server
```bash
# Using uvicorn with live reload on port 8000
uvicorn app.main:app --reload --port 8000
```

### 3. Interactive API Documentation
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## 📡 Available Endpoints

- `GET  /` - Root welcome & database connectivity status
- `GET  /api/v1/health` - Service health status
- `POST /api/v1/auth/login` - User login with PostgreSQL
- `POST /api/v1/auth/signup` - Register a new user in PostgreSQL
- `POST /api/v1/auth/google` - Authenticate via Google OAuth
- `GET  /api/v1/reviews/` - Retrieve all reviews from PostgreSQL
- `POST /api/v1/reviews/` - Add a new review into PostgreSQL
- `GET  /api/v1/reviews/insights` - Aggregate sentiment distribution & AI insights
