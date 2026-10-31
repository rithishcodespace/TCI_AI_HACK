# RetailSense Backend (FastAPI + PostgreSQL)

Production-ready FastAPI backend for Retail / CPG Decision Intelligence, connected to PostgreSQL with SQLAlchemy ORM.

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
- `users`: Registered users, credentials, roles (`store_manager`, `supply_chain`, `executive`), and Google OAuth profiles.
- `reviews`: Customer feedback and recurring product themes.

## 🚀 Getting Started

### 1. Activate Virtual Environment
```bash
cd server
source .venv/bin/activate
```

### 2. Run the Development Server
```bash
# Using uvicorn with live reload on port 8001 (always use 8001)
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

### 3. Interactive API Documentation
- **Swagger UI**: [http://localhost:8001/docs](http://localhost:8001/docs)
- **ReDoc**: [http://localhost:8001/redoc](http://localhost:8001/redoc)

## 📡 Available Endpoints

### 🔐 Authentication & Session
- `POST /api/v1/auth/signup` - Register a store manager or category lead account
- `POST /api/v1/auth/login` - Dual JWT issuance (Access 60m + Refresh 7d)
- `POST /api/v1/auth/refresh` - Refresh access token using refresh token
- `POST /api/v1/auth/google` - Google OAuth profile sync and session persistence

### 🎯 Retail Decision Intelligence
- `GET  /api/v1/dashboard/kpis` - Top-level retail executive metrics (service level, stockout risk, excess stock, margins)
- `GET  /api/v1/recommendations` - Ranked candidate business actions with confidence and impact
- `POST /api/v1/recommendations/{id}/decide` - Human-in-the-loop decision (Approve / Modify / Reject)
- `POST /api/v1/pipeline/run` - Trigger automated cross-signal decision pipeline
- `GET  /api/v1/inventory/risk-board` - Real-time SKU cover days, lead times, and stockout probability
- `GET  /api/v1/backtest` - 6-week holdout replay comparison (AI vs baseline)
- `GET  /api/v1/data-quality` - Data hygiene audit ledger (unobserved lost demand reconstruction, POS clamping)
- `POST /api/v1/whatsapp/chat` - Conversational WhatsApp decision simulation endpoint
- `GET  /api/v1/export/purchase-orders` - Dispatched PO export as CSV for ERP ingestion
- `GET  /api/v1/decisions/` - Full enterprise multi-store decision ledger
