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

