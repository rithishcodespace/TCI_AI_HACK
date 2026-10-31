# Supabase Database Setup Guide
## Autonomous Retail Decision Intelligence (Challenge 10)

This system implements a strict 6-zone relational database model designed specifically for retail decision intelligence with single-store architecture and forward-compatibility for multi-echelon scaling.

---

### 1. Connecting to Supabase in 60 Seconds

1. **Log in to Supabase**: Go to [https://supabase.com](https://supabase.com) and create or open your project.
2. **Open SQL Editor**: In the left sidebar, click on **SQL Editor**.
3. **Execute Schema**:
   - Open [`server/supabase_schema.sql`](./supabase_schema.sql)
   - Copy the entire SQL content and paste it into the Supabase SQL Editor.
   - Click **Run**. All 25+ tables across Zones 1–6 will be created with foreign keys and indexes.
4. **Execute Seed Data**:
   - Open [`server/supabase_seed.sql`](./supabase_seed.sql)
   - Copy and paste into the SQL Editor, then click **Run**.
   - Your database will be loaded with realistic retail SKUs (Basmati Rice, Cadbury Celebration, Sunflower Oil, etc.), festival uplifts, dirty-data recovery issues, AI recommendations, and baseline backtest comparison data.
5. **Get Credentials**:
   - In Supabase, go to **Project Settings** → **API**.
   - Copy **Project URL** and **`anon` public API key** (or **`service_role` secret**).
   - In `server/.env`, set:
     ```env
     SUPABASE_URL=https://your-project-id.supabase.co
     SUPABASE_KEY=your-supabase-anon-key
     # Or Postgres direct URI:
     DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project-id.supabase.co:5432/postgres
     ```

---

### 2. Database Six Zones Architecture

```mermaid
graph TD
  subgraph Zone1["Zone 1: Master Data"]
    store["store (1 row)"]
    shop_settings["shop_settings (Guardrails)"]
    category["category"]
    supplier["supplier"]
    product["product"]
    product_supplier["product_supplier (MOQ & Lead Times)"]
    product_substitute["product_substitute"]
  end

  subgraph Zone2["Zone 2: Daily Operations"]
    sales_daily["sales_daily (Lost demand flagged)"]
    inventory_snapshot["inventory_snapshot"]
    purchase_order["purchase_order"]
    purchase_order_line["purchase_order_line"]
    price_history["price_history"]
  end

  subgraph Zone3["Zone 3: Business Context"]
    promotion["promotion & promotion_product"]
    event["event (Diwali, Holidays)"]
    weather_daily["weather_daily"]
    competitor["competitor & competitor_price"]
  end

  subgraph Zone4["Zone 4: AI Engine Outputs"]
    pipeline_run["pipeline_run (Traceability)"]
    data_quality_issue["data_quality_issue"]
    forecast["forecast (P10, P50, P90)"]
    risk_score["risk_score (Cover & Stockout Prob)"]
    recommendation["recommendation (Action & Rationale)"]
    recommendation_alternative["recommendation_alternative"]
  end

  subgraph Zone5["Zone 5: Humans & Measurement"]
    app_user["app_user (Roles)"]
    decision["decision (Approve/Modify/Reject)"]
    action_order["action_order (Execution POs)"]
    impact_ledger["impact_ledger"]
    replay_run["replay_run (Backtest)"]
    kpi_snapshot["kpi_snapshot (AI vs Baseline)"]
  end

  subgraph Zone6["Zone 6: WhatsApp & Audit"]
    whatsapp_link["whatsapp_link (Hashed phones)"]
    whatsapp_message["whatsapp_message (Inbound/Outbound)"]
    notification["notification"]
    audit_log["audit_log (Append-only)"]
  end

  store --> sales_daily
  store --> inventory_snapshot
  product --> sales_daily
  product --> inventory_snapshot
  pipeline_run --> forecast
  pipeline_run --> risk_score
  risk_score --> recommendation
  recommendation --> decision
  decision --> action_order
  replay_run --> kpi_snapshot
```

---

### 3. Golden Architectural Rules Preserved
1. **Inputs never overwritten by outputs**: Zones 1–3 are store-provided inputs; Zone 4 contains AI-generated hypotheses and recommendations.
2. **Every output traces to `run_id`**: Any forecast, risk score, or recommendation is reproducible.
3. **Decisions are append-only**: Recommendations are never mutated to record user choices; user choices are inserted as immutable `decision` records.
4. **Unobserved lost sales reconstructed**: Days with zero sales and zero inventory are classified as lost demand, never zero demand.

