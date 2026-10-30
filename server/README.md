# VoiceOfCustomer Backend (FastAPI)

Production-ready FastAPI backend for VoiceOfCustomer feedback intelligence.

## 📁 Project Structure

```
server/
├── app/
│   ├── __init__.py
│   ├── main.py                  # App initialization, middleware (CORS), routes
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py            # Pydantic Settings & environment variables
│   ├── api/
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── api.py           # V1 Router aggregator
│   │       └── endpoints/
│   │           ├── __init__.py
│   │           ├── health.py    # Health check endpoint
│   │           └── reviews.py   # Reviews & AI analysis endpoints
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── review.py            # Pydantic request & response models
│   └── services/
│       ├── __init__.py
│       └── review_service.py    # Business logic & sentiment analysis
├── .env                         # Local environment variables
├── .env.example                 # Example environment variables template
├── .gitignore                   # Ignored files (venv, pycache, env)
├── requirements.txt             # Python dependencies
└── README.md                    # Documentation
```

## 🚀 Getting Started

### 1. Activate Virtual Environment
```bash
cd server
source .venv/bin/activate
```

### 2. Run the Development Server
```bash
# Using uvicorn directly with hot reload
uvicorn app.main:app --reload --port 8000

# Or using python directly
python -m app.main
```

### 3. Interactive API Documentation
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## 📡 Available Endpoints

- `GET  /` - Root welcome & documentation links
- `GET  /api/v1/health` - Service health status
- `GET  /api/v1/reviews/` - Retrieve all reviews
- `POST /api/v1/reviews/` - Add a new customer review
- `GET  /api/v1/reviews/insights` - Aggregate sentiment distribution & AI insights
