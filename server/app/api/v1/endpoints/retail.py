import io
import csv
from typing import Optional, Dict, Any
from fastapi import APIRouter, Query, Response, HTTPException
from pydantic import BaseModel
from app.services.retail_decision_service import retail_service

router = APIRouter()

class DecisionRequest(BaseModel):
    decision: str  # approved, rejected, modified
    edited_quantity: Optional[int] = None
    reason: Optional[str] = ""

class ChatRequest(BaseModel):
    message: Optional[str] = None
    text: Optional[str] = None

    @property
    def query(self) -> str:
        return self.message or self.text or ""

@router.get("/dashboard/kpis")
async def get_dashboard_kpis():
    """Retrieve top-level KPI metrics matching Preline executive layout."""
    return retail_service.get_dashboard_kpis()

@router.get("/dashboard/role-summary")
async def get_dashboard_role_summary(role: Optional[str] = Query("store_manager")):
    """Returns role-specific executive briefing, directives, and KPIs for active persona."""
    return retail_service.get_role_summary(role)

@router.get("/forecasts/{sku}")
async def get_sku_forecast(sku: str):
    """Returns probabilistic P10-P90 daily forecast distribution with ML uplift features."""
    return retail_service.get_sku_forecast(sku)

@router.get("/recommendations")
async def get_recommendations():
    """Ranked candidate action list with expected value, rationale, confidence, and alternatives."""
    return retail_service.get_recommendations()

@router.post("/recommendations/{rec_id}/decide")
async def decide_recommendation(rec_id: int, req: DecisionRequest):
    """Record human choice (Approve/Modify/Reject) and generate execution action orders."""
    res = retail_service.decide_recommendation(
        rec_id=rec_id,
        decision=req.decision,
        edited_quantity=req.edited_quantity,
        reason=req.reason or ""
    )
    if "error" in res:
        raise HTTPException(status_code=404, detail=res["error"])
    return res

@router.post("/recommendations/{rec_id}/explain")
async def explain_recommendation(rec_id: int):
    """Uses Groq LLM to generate real-time multi-signal connected chain trade-off rationale."""
    rec = next((r for r in retail_service.recommendations if r["rec_id"] == rec_id), None)
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    from app.services.llm_reasoning_service import llm_service
    explanation = llm_service.explain_decision(
        sku_name=rec["name"],
        action=rec["action_type"],
        details={
            "sku": rec["sku"],
            "quantity": rec["quantity"],
            "expected_value": rec["expected_value"],
            "rationale": rec["rationale"],
            "alternatives": rec["alternatives_considered"]
        }
    )
    return {
        "rec_id": rec_id,
        "sku": rec["sku"],
        "name": rec["name"],
        "action_type": rec["action_type"],
        "llm_explanation": explanation,
        "model": "qwen/qwen3.8-27b (Groq AI)"
    }

@router.get("/inventory/risk-board")
async def get_risk_board():
    """Live SKU risk board with days of cover, reorder points, and expiry days."""
    return retail_service.get_risk_board()

@router.get("/backtest")
async def get_backtest_results():
    """Empirical proof: Holdout backtest comparing AI policy vs simple baseline policy."""
    return retail_service.backtest

@router.get("/data-quality")
async def get_data_quality_issues():
    """List of captured data quality anomalies (never silently fixed)."""
    return retail_service.data_quality_issues

@router.post("/pipeline/run")
async def trigger_pipeline_run():
    """Simulate a fresh end-to-end pipeline run (Observe -> Predict -> Reason -> Decide)."""
    import datetime
    run_id = f"run_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}"
    return {
        "status": "completed",
        "run_id": run_id,
        "engine_version": "v2.4.0-cpg",
        "summary": "Data cleaned, lost demand reconstructed for 2 SKUs, probabilistic P10-P90 forecasts generated, 7 canonical candidate decisions ranked."
    }

@router.post("/whatsapp/chat")
async def whatsapp_chat_simulator(req: ChatRequest):
    """Interactive demo endpoint for the WhatsApp bot simulator."""
    return retail_service.handle_whatsapp_message(req.query)

@router.get("/whatsapp/webhook")
async def meta_whatsapp_webhook_verify(
    hub_mode: Optional[str] = Query(None, alias="hub.mode"),
    hub_challenge: Optional[str] = Query(None, alias="hub.challenge"),
    hub_verify_token: Optional[str] = Query(None, alias="hub.verify_token")
):
    """Meta WhatsApp Cloud API Webhook Verification Handshake."""
    from app.core.config import settings
    if hub_mode == "subscribe" and hub_verify_token == settings.META_WA_VERIFY_TOKEN:
        return Response(content=hub_challenge, media_type="text/plain")
    return Response(content="Verification failed", status_code=403)

@router.post("/whatsapp/webhook")
async def meta_whatsapp_webhook_receive(payload: Dict[str, Any]):
    """Receives inbound messages and button payloads from Meta WhatsApp / Twilio."""
    # Handle incoming Meta message
    try:
        entries = payload.get("entry", [])
        for entry in entries:
            for change in entry.get("changes", []):
                value = change.get("value", {})
                messages = value.get("messages", [])
                for msg in messages:
                    text_body = ""
                    if msg.get("type") == "text":
                        text_body = msg.get("text", {}).get("body", "")
                    elif msg.get("type") == "button":
                        text_body = msg.get("button", {}).get("text", "")
                    elif msg.get("type") == "interactive":
                        text_body = msg.get("interactive", {}).get("button_reply", {}).get("id", "")
                    
                    if text_body:
                        retail_service.handle_whatsapp_message(text_body)
    except Exception as e:
        print("Webhook parse error:", e)

    return {"status": "received"}

@router.get("/export/purchase-orders")
async def export_purchase_orders():
    """Download approved purchase orders as CSV."""
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["PO_ID", "SKU", "Product_Name", "Action", "Quantity", "Status", "Timestamp"])
    
    for order in retail_service.action_orders:
        writer.writerow([
            order["order_id"],
            order["sku"],
            order["product_name"],
            order["action_type"],
            order["quantity"],
            order["status"],
            order["timestamp"]
        ])
    
    csv_data = output.getvalue()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=approved_purchase_orders.csv"}
    )

# -------------------------------------------------------------
# Role-Specific Endpoints: Supply Chain Lead
# -------------------------------------------------------------
@router.get("/logistics/transfers")
async def get_transfers():
    """Retrieve district inter-store transfer balance candidates."""
    return retail_service.get_transfers()

@router.post("/logistics/transfers/{transfer_id}/execute")
async def execute_transfer(transfer_id: int):
    """Execute inter-store transfer transit dispatch."""
    res = retail_service.execute_transfer(transfer_id)
    if "error" in res:
        raise HTTPException(status_code=404, detail=res["error"])
    return res

@router.get("/logistics/suppliers")
async def get_suppliers():
    """Supplier lead-time reliability, variance, and OTIF rating."""
    return retail_service.get_suppliers()

@router.get("/logistics/dc-slotting")
async def get_dc_slotting():
    """Central warehouse capacity and dock utilization status."""
    return retail_service.get_dc_slotting()

# -------------------------------------------------------------
# Role-Specific Endpoints: Category Merchandising Lead
# -------------------------------------------------------------
@router.get("/category/promotions")
async def get_promotions():
    """Active promo elasticity factor and supply chain synchronization."""
    return retail_service.get_promotions()

class DampenPromoRequest(BaseModel):
    new_discount_pct: Optional[int] = None

@router.post("/category/promotions/{promo_id}/dampen")
async def dampen_promotion(promo_id: int, req: DampenPromoRequest):
    """Dampen promo discount to align depletion with supplier lead time."""
    res = retail_service.dampen_promotion(promo_id, req.new_discount_pct)
    if "error" in res:
        raise HTTPException(status_code=404, detail=res["error"])
    return res

@router.get("/category/substitutions")
async def get_substitutions():
    """Cross-brand substitution mappings and customer retention metrics."""
    return retail_service.get_substitutions()

@router.get("/category/competitor-benchmarks")
async def get_competitor_benchmarks():
    """Live competitor pricing benchmarks (Blinkit, BigBasket, DMart)."""
    return retail_service.get_competitor_benchmarks()

# -------------------------------------------------------------
# Role-Specific Endpoints: Store Operations (Store Manager)
# -------------------------------------------------------------
@router.get("/store/staff-tasks")
async def get_staff_tasks():
    """Daily floor staff task checklist for Store #101."""
    return retail_service.get_staff_tasks()

@router.post("/store/staff-tasks/{task_id}/toggle")
async def toggle_staff_task(task_id: int):
    """Toggle completion status of a floor staff task."""
    res = retail_service.toggle_staff_task(task_id)
    if "error" in res:
        raise HTTPException(status_code=404, detail=res["error"])
    return res

# -------------------------------------------------------------
# Role-Specific Endpoints: Executive VP (Omnichannel Network)
# -------------------------------------------------------------
@router.get("/network/stores")
async def get_store_network():
    """District omnichannel store performance and critical SKU health."""
    return retail_service.get_store_network()

# -------------------------------------------------------------
# ML Models & Live Simulation Endpoints
# -------------------------------------------------------------
@router.get("/ml/markdown-optimizer")
async def get_markdown_optimizer(
    sku: Optional[str] = Query("SKU-8801"),
    discount_pct: Optional[int] = Query(25)
):
    """Price elasticity model optimizing clearance velocity vs margin recovery."""
    return retail_service.get_markdown_simulation(sku=sku, discount_pct=discount_pct)

@router.get("/ml/stockout-simulator")
async def simulate_stockout(
    sku: Optional[str] = Query("SKU-4412"),
    lead_time_days: Optional[float] = Query(None),
    demand_multiplier: Optional[float] = Query(None)
):
    """Monte Carlo 1,000-path simulation of stockout probability without vs with AI."""
    return retail_service.simulate_stockout(sku=sku, lead_time_days=lead_time_days, demand_multiplier=demand_multiplier)

# -------------------------------------------------------------
# LLM Connected Decision Chain What-If Endpoint (Groq AI)
# -------------------------------------------------------------
class WhatIfRequest(BaseModel):
    scenario: str

@router.post("/llm/what-if")
async def simulate_what_if_scenario(req: WhatIfRequest):
    """Traces hypothetical scenarios through Demand -> Inventory -> Replenishment -> Logistics -> Margin -> Customer Experience."""
    from app.services.llm_reasoning_service import llm_service
    return llm_service.simulate_what_if_scenario(req.scenario)

# -------------------------------------------------------------
# Live Decision Intelligence Studio (9 Signals -> 6 Stages)
# -------------------------------------------------------------
class StudioEvaluationRequest(BaseModel):
    sku: Optional[str] = "SKU-4412"
    store_name: Optional[str] = "Store #101 Metro Central"
    store_format: Optional[str] = "express"
    sales_velocity: Optional[float] = 18.0
    inventory_on_hand: Optional[int] = 38
    promotion_discount_pct: Optional[int] = 20
    list_price: Optional[float] = 395.0
    unit_cost: Optional[float] = 290.0
    lead_time_days: Optional[float] = 6.0
    supplier_delay_days: Optional[float] = 0.0
    local_event: Optional[str] = "none"
    weather_anomaly: Optional[str] = "normal"
    competitor_price: Optional[float] = 385.0
    competitor_promo_active: Optional[bool] = False

@router.post("/decisions/evaluate-studio")
async def evaluate_studio_scenario(req: StudioEvaluationRequest):
    """Executes Observe -> Predict -> Reason -> Decide -> Act -> Measure with user inputs."""
    return retail_service.evaluate_multi_signal_decision(req.dict())

class CommitStudioActionRequest(BaseModel):
    sku: str
    badge: str
    action_type: str
    quantity: int
    timing: str
    rationale: str
    expected_impact: str
    protected_value: Optional[float] = 25000.0

@router.post("/decisions/commit-studio-action")
async def commit_studio_action(req: CommitStudioActionRequest):
    """Commits user-configured studio decision to active queue."""
    return retail_service.commit_studio_action(req.dict())



