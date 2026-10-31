# AGENTS.md — RetailSense: AI for Business (Retail / CPG) Decision Intelligence Guidelines

Welcome to the **RetailSense** repository. This document defines the engineering standards, UI/UX design rules, authentication patterns, and business domain specifications for AI agents and developers working on this project.

---

## 1. Hackathon Theme & Business Domain Specifications

- **Theme**: **THEME 2: AI for Business**
- **Domain**: **Retail / CPG (Consumer Packaged Goods)**
- **Tags**: Retail AI, Forecasting, Decision Intelligence, Agentic AI
- **Core Objective**: Build AI systems that reason across enterprise information and coordinate measurable business decisions.
- **The Connected Decision Chain**:
  ```
  Demand → Inventory → Replenishment → Logistics → Margin → Customer Experience
  ```
- **The Core Challenge**:
  Determine what action each store or channel should take next, and **why**.
- **Critical Requirement**:
  **Do NOT simply provide sales forecasts.** The system must turn intelligence into prescriptive decisions.
- **Available Enterprise Signals**:
  1. SKU sales velocity & demand lift
  2. Inventory on-hand & days of supply
  3. Promotions & marketing elasticity
  4. Unit pricing & margin structure
  5. Supplier lead times & reliability variances
  6. Store location & channel format (Express, Supercenter, E-Commerce DC)
  7. Local events (marathons, festivals, stadium games)
  8. Weather anomalies (heatwaves, cold snaps, storms)
  9. Competitor pricing benchmarks & promo flyers
- **AI Prescribed Actions (7 Canonical Business Actions)**:
  1. `Replenish`: Expedite fresh batches from regional DCs when shelf depletion risk is high.
  2. `Transfer Inventory`: Balance stock between adjacent stores in a district without new POs.
  3. `Increase Allocation`: Secure central warehouse slotting for surging seasonal SKUs.
  4. `Markdown`: Dynamically discount aging/perishable lots before expiration to recover cash.
  5. `Adjust Promotion`: Pause or shift promo features when upstream supply chains are delayed.
  6. `Substitute Product`: Auto-recommend equivalent brand alternatives during supplier stockouts.
  7. `Take No Action`: Preserve operational stability when inventory and sales run-rates are optimal.
- **Expected Flow Lifecycle**:
  ```
  Observe → Predict → Reason → Decide → Act → Measure
  ```
- **Success Measures (AI vs Traditional Forecasting Baseline)**:
  - **Stockouts**: Prevented stockouts (Target: >80% reduction vs baseline)
  - **Excess Inventory**: Reduced working capital tied in deadstock (Target: >65% reduction)
  - **Service Level**: Customer in-stock availability (Target: >98% service level)
  - **Gross Margin**: Margin protected / expanded (+3 to +6 percentage points)
  - **Decision Accuracy**: Multi-signal validated accuracy (>95%)

---

## 2. Technical Stack & Ports

- **Frontend**: React (Vite), Tailwind CSS, Lucide React icons, `@react-oauth/google`.
- **Backend**: FastAPI (Python 3.12+), SQLAlchemy 2.0 ORM, PostgreSQL, PyJWT, bcrypt, Uvicorn.
- **Database**: PostgreSQL (`voiceofcustomer_db` on `localhost:5432`, user: `voc_user`).
- **Ports & Dev Servers**:
  - Frontend: `http://localhost:5174/` (or `5173`)
  - Backend: `http://localhost:8001/` (Always use port **8001**; avoid port 8000 which may conflict with local system daemons).

---

## 3. UI & UX Design Rules (STRICT)

### 3.1 Single-Viewport Rule for Auth & Hero Pages
- **No Unwanted Scrolling on Desktop**: Full-screen views such as [AuthPage.jsx](file:///home/rithish/Desktop/projects/TCS_AI/Day3/client/src/components/AuthPage.jsx) **MUST fit 100% within a single desktop viewport (`100vh`)** without displaying a vertical scrollbar.
- **Container Constraint**: Use `h-screen max-h-screen overflow-hidden` on desktop viewports (`lg:`). Only permit `overflow-y-auto` as a fallback on small mobile devices (`< lg`).
- **Parent Wrapper Consistency**: Ensure root wrappers in [App.jsx](file:///home/rithish/Desktop/projects/TCS_AI/Day3/client/src/App.jsx) do not enforce `min-h-screen` when rendering fixed-height pages.

### 3.2 Proportional Component Sizing
- **Avoid Over-Padding**: Never use excessive vertical padding (e.g. `p-16`, `my-8`, `mt-7`) that pushes form controls or primary CTAs below the fold.
- **Input Fields**: Use compact padding (`py-2` to `py-2.5`, `px-3.5`, `text-[13px]`) with rounded corners (`rounded-xl`).
- **Buttons**: Primary action buttons must use `py-2.5` to `py-3` with crisp font sizes (`text-[13.5px]` to `text-[14px]`).
- **Role Selector**: Persona cards (`Store Manager`, `Supply Chain Lead`, `Category Lead`) must use `p-2` to `p-2.5`, `w-4 h-4` icons, and `grid-cols-3` spacing so they consume no more than ~60px of vertical height.

### 3.3 Illustration & Graphic Placement
- **Lifted Positioning**: Never pin bottom illustrations directly against the bottom border or container floor.
- **Spacing**: Use negative translation and bottom margins (e.g., `-translate-y-4 lg:-translate-y-8 mb-8 lg:mb-12`) so the analyst illustration sits comfortably with ample breathing room.
- **Scale**: Keep the SVG illustration container bounded to `max-w-[380px]` to `max-w-[420px]` and `h-[180px]` to `h-[230px]`.

### 3.4 Color Palette & Typography
- **Font**: `'Plus Jakarta Sans'`, sans-serif (Google Fonts).
- **Primary Brand Color**: `#5244E9` (Indigo/Purple), Hover: `#4333DE`, Active Accent: `#F5F3FF`.
- **Secondary Accents**: `#2563EB` (Vibrant Blue), `#10B981` (Emerald), `#F43F5E` (Rose), `#D946EF` (Fuchsia).
- **Backgrounds**: Pure white `#FFFFFF` for primary cards, soft gradient `bg-gradient-to-br from-[#EFF6FF] via-[#EEF2FF] to-[#DBEAFE]` for visual branding columns.
- **Text**: `#0F172A` (slate-900 heading), `#475569` / `#64748B` (slate-500/600 body and labels).

### 3.5 Navigation & Sidebar Rules
- **Single Hamburger Toggle**: Never render duplicate hamburger menu buttons. In [Dashboard.jsx](file:///home/rithish/Desktop/projects/TCS_AI/Day3/client/src/components/Dashboard.jsx), use a single toggle in the top navbar that cleanly toggles the collapsible sidebar.

---

## 4. Authentication & JWT Architecture

### 4.1 Dual-Token Standard
All authentication mechanisms (Credentials Signup, Login, and Google OAuth) must return:
1. **Access Token (`access_token`)**:
   - Lifetime: 60 minutes.
   - Claims: `{"sub": user_id, "email": email, "role": role, "type": "access", "exp": ..., "iat": ...}`.
   - Used for authenticating API requests via `Authorization: Bearer <token>`.
2. **Refresh Token (`refresh_token`)**:
   - Lifetime: 7 days.
   - Claims: `{"sub": user_id, "email": email, "role": role, "type": "refresh", "exp": ..., "iat": ...}`.
   - Used exclusively to obtain fresh access tokens via `POST /api/v1/auth/refresh`.

### 4.2 Security Enforcement
- **Token Type Isolation**: Protected endpoints must reject refresh tokens with `401 Unauthorized` (`Invalid token type. Expected access token.`).
- **Password Hashing**: Passwords must be hashed using `bcrypt` (12 rounds) in [server/app/core/security.py](file:///home/rithish/Desktop/projects/TCS_AI/Day3/server/app/core/security.py). Plain text fallback is only permitted for legacy mock records.

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
1. **Frontend Syntax & Build**: Ensure `npm run lint` and `npm run build` succeed with 0 errors and 0 warnings.
2. **Backend Startup**: Ensure Uvicorn runs on `http://0.0.0.0:8001` and `curl -s http://localhost:8001/api/v1/decisions` returns active retail prescriptions.
3. **No Scroll Regression**: Confirm the login/signup screen fits in a single standard 1080p/laptop browser window with zero scrollbar.
4. **Theme Fidelity**: Confirm titles, text, personas, decision tables, and ripple effects all align with THEME 2: Retail / CPG AI Decision Intelligence.
