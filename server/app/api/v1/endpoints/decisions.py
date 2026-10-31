from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.schemas.decision import RetailDecision, BaselineComparisonReport
from app.services.decision_service import DecisionService

router = APIRouter()

@router.get("/", response_model=List[RetailDecision], summary="Get all store/SKU decisions")
async def list_decisions(
    action: Optional[str] = Query(None, description="Filter by action e.g. replenish, markdown"),
    store: Optional[str] = Query(None, description="Filter by store ID e.g. STR-104")
):
    """
    Retrieve AI-prescribed business decisions across stores and channels.
    Includes detected signals, rationale ('why'), and connected chain impacts.
    """
    return DecisionService.get_all_decisions(action_filter=action, store_filter=store)

@router.post("/{decision_id}/execute", response_model=RetailDecision, summary="Execute a decision")
async def execute_decision(decision_id: str):
    """
    Execute an AI-prescribed action (e.g. trigger replenishment PO, activate markdown, transfer inventory).
    """
    decision = DecisionService.execute_decision(decision_id)
    if not decision:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Decision {decision_id} not found."
        )
    return decision

@router.get("/baseline-comparison", response_model=BaselineComparisonReport, summary="AI vs Baseline ROI comparison")
async def get_baseline_comparison():
    """
    Get side-by-side performance comparison of the AI Decision Intelligence system against
    a simple traditional forecasting baseline.
    """
    return DecisionService.get_baseline_comparison()
