from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class SignalSummary(BaseModel):
    sales_velocity: str = Field(..., description="Sales rate and trend e.g. +34% spike")
    inventory_on_hand: int = Field(..., description="Units currently in store")
    days_of_supply: float = Field(..., description="Estimated days before depletion")
    supplier_lead_time_days: int = Field(..., description="Lead time in days")
    active_promotion: Optional[str] = Field(None, description="Active promo if any")
    unit_price: float = Field(..., description="Current selling price")
    weather_condition: Optional[str] = Field(None, description="Current weather anomaly")
    competitor_price: Optional[float] = Field(None, description="Competitor reference price")
    local_event: Optional[str] = Field(None, description="Local event e.g. Marathon")

class ConnectedChainImpact(BaseModel):
    demand: str
    inventory: str
    replenishment: str
    logistics: str
    margin: str
    customer_experience: str

class RetailDecision(BaseModel):
    id: str
    sku_id: str
    sku_name: str
    category: str
    store_id: str
    store_name: str
    channel: str
    recommended_action: str  # replenish, transfer inventory, increase allocation, markdown, adjust promotion, substitute product, take no action
    urgency: str  # Critical Risk, High, Moderate, Optimal
    rationale: str
    expected_impact: str
    signals: SignalSummary
    chain_impact: ConnectedChainImpact
    status: str = "pending"  # pending, executed, rejected
    confidence_score: float = 0.98
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BaselineMetric(BaseModel):
    metric_name: str
    baseline_value: str
    ai_value: str
    improvement: str
    description: str

class BaselineComparisonReport(BaseModel):
    summary: str
    metrics: List[BaselineMetric]
    total_stockouts_averted: int
    excess_inventory_savings_usd: float
    margin_expansion_pts: float
