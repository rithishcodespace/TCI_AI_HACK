# AGENTS.md — VoiceOfCustomer (VOC) Project Guidelines & Rules

Welcome to the **VoiceOfCustomer (VOC)** repository. This document defines the engineering standards, UI/UX design rules, authentication patterns, and repository hygiene for all AI agents and developers working on this project.

---

## 1. Project Overview & Architecture

- **Domain**: VoiceOfCustomer (VOC) — Campus Dining Feedback Intelligence Platform.
- **Frontend**: React (Vite), Tailwind CSS (v3/v4), Lucide React icons, `@react-oauth/google`.
- **Backend**: FastAPI (Python 3.12+), SQLAlchemy 2.0 ORM, PostgreSQL, PyJWT, bcrypt, Uvicorn.
- **Database**: PostgreSQL (`voiceofcustomer_db` on `localhost:5432`, user: `voc_user`).
- **Ports & Dev Servers**:
  - Frontend: `http://localhost:5174/` (or `5173`)
  - Backend: `http://localhost:8001/` (Always use port **8001**; avoid port 8000 which may conflict with system services).

---

## 2. UI & UX Design Rules (STRICT)

### 2.1 Single-Viewport Rule for Auth & Hero Pages
- **No Unwanted Scrolling on Desktop**: Full-screen views such as [AuthPage.jsx](file:///home/rithish/Desktop/projects/TCS_AI/Day3/client/src/components/AuthPage.jsx) **MUST fit 100% within a single desktop viewport (`100vh`)** without displaying a vertical scrollbar.
- **Container Constraint**: Use `h-screen max-h-screen overflow-hidden` on desktop viewports (`lg:`). Only permit `overflow-y-auto` as a fallback on small mobile devices (`< lg`).
- **Parent Wrapper Consistency**: Ensure root wrappers in [App.jsx](file:///home/rithish/Desktop/projects/TCS_AI/Day3/client/src/App.jsx) do not enforce `min-h-screen` when rendering fixed-height pages.

### 2.2 Proportional Component Sizing
- **Avoid Over-Padding**: Never use excessive vertical padding (e.g. `p-16`, `my-8`, `mt-7`) that pushes form controls or primary CTAs below the fold.
- **Input Fields**: Use compact padding (`py-2` to `py-2.5`, `px-3.5`, `text-[13px]`) with rounded corners (`rounded-xl`).
- **Buttons**: Primary action buttons must use `py-2.5` to `py-3` with crisp font sizes (`text-[13.5px]` to `text-[14px]`).
- **Role Selector**: Role selector cards (`Student`, `Canteen Manager`, `Administrator`) must use `p-2` to `p-2.5`, `w-4 h-4` icons, and `grid-cols-3` spacing so they consume no more than ~60px of vertical height.

### 2.3 Illustration & Graphic Placement
- **Lifted Positioning**: Never pin bottom illustrations directly against the bottom border or container floor.
- **Spacing**: Use negative translation and bottom margins (e.g., `-translate-y-4 lg:-translate-y-8 mb-8 lg:mb-12`) so the student/bench illustration sits comfortably with ample breathing room.
- **Scale**: Keep the SVG illustration container bounded to `max-w-[380px]` to `max-w-[420px]` and `h-[180px]` to `h-[230px]`.

### 2.4 Color Palette & Typography
- **Font**: `'Plus Jakarta Sans'`, sans-serif (Google Fonts).
- **Primary Brand Color**: `#5244E9` (Indigo/Purple), Hover: `#4333DE`, Active Accent: `#F5F3FF`.
- **Secondary Accents**: `#2563EB` (Vibrant Blue), `#F43F5E` (Rose), `#D946EF` (Fuchsia).
- **Backgrounds**: Pure white `#FFFFFF` for primary cards, soft gradient `bg-gradient-to-br from-[#EFF6FF] via-[#EEF2FF] to-[#DBEAFE]` for visual branding columns.
- **Text**: `#0F172A` (slate-900 heading), `#475569` / `#64748B` (slate-500/600 body and labels).

### 2.5 Navigation & Sidebar Rules
- **Single Hamburger Toggle**: Never render duplicate hamburger menu buttons. In [Dashboard.jsx](file:///home/rithish/Desktop/projects/TCS_AI/Day3/client/src/components/Dashboard.jsx), use a single toggle in the top navbar that cleanly toggles the collapsible sidebar.

---

## 3. Authentication & JWT Architecture

### 3.1 Dual-Token Standard
All authentication mechanisms (Credentials Signup, Login, and Google OAuth) must return:
1. **Access Token (`access_token`)**:
   - Lifetime: 60 minutes.
   - Claims: `{"sub": user_id, "email": email, "role": role, "type": "access", "exp": ..., "iat": ...}`.
   - Used for authenticating API requests via `Authorization: Bearer <token>`.
2. **Refresh Token (`refresh_token`)**:
   - Lifetime: 7 days.
   - Claims: `{"sub": user_id, "email": email, "role": role, "type": "refresh", "exp": ..., "iat": ...}`.
   - Used exclusively to obtain fresh access tokens via `POST /api/v1/auth/refresh`.

### 3.2 Security Enforcement
- **Token Type Isolation**: Protected endpoints must reject refresh tokens with `401 Unauthorized` (`Invalid token type. Expected access token.`).
- **Password Hashing**: Passwords must be hashed using `bcrypt` (12 rounds) in [server/app/core/security.py](file:///home/rithish/Desktop/projects/TCS_AI/Day3/server/app/core/security.py). Plain text fallback is only permitted for legacy mock records.
- **Protected Endpoints**: Secure routes using FastAPI dependency:
  ```python
  from app.core.security import get_current_user
  from app.models.user import User

  @router.get("/protected")
  async def protected_route(current_user: User = Depends(get_current_user)):
      return {"user": current_user.email}
  ```

### 3.3 Frontend Token Management
- **Centralized Service**: All token storage and authenticated requests must go through [client/src/services/auth.js](file:///home/rithish/Desktop/projects/TCS_AI/Day3/client/src/services/auth.js).
- **Storage Keys**:
  - `voc_access_token`: Access token string.
  - `voc_refresh_token`: Refresh token string.
  - `voc_user`: Serialized JSON object of current user profile.
- **Auto-Refresh**: Use `fetchWithAuth(url, options)` which transparently catches `401` status, calls `/auth/refresh`, and retries the original request.

---

## 4. Backend Conventions & PostgreSQL Integration

- **ORM**: Use SQLAlchemy models in [server/app/models/](file:///home/rithish/Desktop/projects/TCS_AI/Day3/server/app/models/).
- **Database Initialization**: Ensure tables are auto-created on application startup via `Base.metadata.create_all(bind=engine)`.
- **CORS Configuration**: Allow origins `http://localhost:5173`, `http://localhost:5174`, `http://127.0.0.1:5173`, `http://127.0.0.1:5174`.
- **API Versioning**: Prefix all business endpoints under `/api/v1` (e.g. `/api/v1/auth`, `/api/v1/reviews`, `/api/v1/health`).

---

## 5. Security & Git Hygiene (CRITICAL)

- **NEVER Commit Secrets**:
  - Files named `.env`, `.env.local`, or containing `GOOGLE_CLIENT_SECRET`, `JWT_SECRET_KEY`, or `DATABASE_URL` credentials must NEVER be tracked by Git.
  - Both root [.gitignore](file:///home/rithish/Desktop/projects/TCS_AI/Day3/.gitignore) and `client/.gitignore` must maintain strict ignore rules for `.env`.
  - Always commit only sanitized `.env.example` templates.
- **Pre-Push Check**: If GitHub Push Protection (GH013) triggers, immediately untrack cached secret files (`git rm --cached <file>`), update `.gitignore`, and reset the commit.

---

## 6. Developer & Agent Verification Runbook

Before completing any task, verify the following:
1. **Frontend Syntax & Build**: Ensure client builds without warnings or errors.
2. **Backend Startup**: Ensure Uvicorn starts with `Uvicorn running on http://0.0.0.0:8001` and connects to PostgreSQL.
3. **No Scroll Regression**: Confirm the login/signup screen fits in a single standard 1080p/laptop browser window with zero scrollbar.
4. **Token Integrity**: Ensure auth endpoints return valid JWT strings for both `access_token` and `refresh_token`.
