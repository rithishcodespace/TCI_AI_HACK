import datetime
import uuid
from typing import List, Dict, Any, Optional

class RetailDecisionService:
    def __init__(self):
        self._init_mock_store()

    def _init_mock_store(self):
        """In-memory state pre-seeded with Challenge 10 realistic retail data."""
        self.store = {
            "store_id": 1,
            "name": "Metro Central Supermart (Store #101)",
            "city": "Bengaluru",
            "currency": "INR",
            "lat": 12.9716,
            "lon": 77.5946
        }

        self.shop_settings = {
            "setting_id": 1,
            "store_id": 1,
            "service_level_target": 95.00,
            "max_markdown_pct": 40.00,
            "min_margin_pct": 15.00,
            "target_cover_days": 14.00,
            "auto_approve_enabled": False
        }

        self.categories = [
            {"category_id": 1, "name": "Grains & Staples", "default_shelf_life_days": 365, "default_elasticity": -0.85},
            {"category_id": 2, "name": "Dairy & Fresh", "default_shelf_life_days": 7, "default_elasticity": -1.90},
            {"category_id": 3, "name": "Packaged & Confectionery", "default_shelf_life_days": 180, "default_elasticity": -1.65},
            {"category_id": 4, "name": "Edible Oils & Cooking", "default_shelf_life_days": 240, "default_elasticity": -1.10},
            {"category_id": 5, "name": "Beverages", "default_shelf_life_days": 180, "default_elasticity": -1.40},
            {"category_id": 6, "name": "Household & Cleaning", "default_shelf_life_days": 730, "default_elasticity": -0.90}
        ]

        self.products = [
            {
                "product_id": 1,
                "sku": "SKU-4412",
                "name": "Royal Basmati Rice 5 kg",
                "category": "Grains & Staples",
                "category_id": 1,
                "brand": "Royal Aroma",
                "unit_cost": 260.00,
                "list_price": 395.00,
                "on_hand": 38,
                "on_order": 0,
                "daily_demand": 18.0,
                "lead_time_days": 6.0,
                "moq": 50,
                "supplier": "Bharat Agro Foods Ltd",
                "shelf_life_days": 365,
                "days_to_expiry": 320
            },
            {
                "product_id": 2,
                "sku": "SKU-2209",
                "name": "Chakki Fresh Atta 10 kg",
                "category": "Grains & Staples",
                "category_id": 1,
                "brand": "Annapurna",
                "unit_cost": 310.00,
                "list_price": 420.00,
                "on_hand": 210,
                "on_order": 50,
                "daily_demand": 15.0,
                "lead_time_days": 4.0,
                "moq": 30,
                "supplier": "Bharat Agro Foods Ltd",
                "shelf_life_days": 120,
                "days_to_expiry": 90
            },
            {
                "product_id": 3,
                "sku": "SKU-1044",
                "name": "Pasteurized Whole Milk 1L",
                "category": "Dairy & Fresh",
                "category_id": 2,
                "brand": "Nandini GoodLife",
                "unit_cost": 42.00,
                "list_price": 54.00,
                "on_hand": 95,
                "on_order": 100,
                "daily_demand": 85.0,
                "lead_time_days": 1.0,
                "moq": 100,
                "supplier": "Nandini Dairy Federation",
                "shelf_life_days": 5,
                "days_to_expiry": 3
            },
            {
                "product_id": 4,
                "sku": "SKU-8801",
                "name": "Celebration Assorted Gift Box 500g",
                "category": "Packaged & Confectionery",
                "category_id": 3,
                "brand": "Cadbury Royal",
                "unit_cost": 180.00,
                "list_price": 320.00,
                "on_hand": 240,
                "on_order": 0,
                "daily_demand": 5.0,
                "lead_time_days": 7.0,
                "moq": 40,
                "supplier": "Mondelez India Logistics",
                "shelf_life_days": 60,
                "days_to_expiry": 22
            },
            {
                "product_id": 5,
                "sku": "SKU-3110",
                "name": "Refined Sunflower Oil 5L Jar",
                "category": "Edible Oils & Cooking",
                "category_id": 4,
                "brand": "SunPure Gold",
                "unit_cost": 520.00,
                "list_price": 690.00,
                "on_hand": 45,
                "on_order": 0,
                "daily_demand": 12.0,
                "lead_time_days": 5.0,
                "moq": 25,
                "supplier": "Fortune Agrotech Supplies",
                "shelf_life_days": 240,
                "days_to_expiry": 180
            },
            {
                "product_id": 6,
                "sku": "SKU-5521",
                "name": "Premium South Indian Filter Coffee 500g",
                "category": "Beverages",
                "category_id": 5,
                "brand": "Coorg Harvest",
                "unit_cost": 175.00,
                "list_price": 275.00,
                "on_hand": 60,
                "on_order": 0,
                "daily_demand": 8.0,
                "lead_time_days": 4.0,
                "moq": 20,
                "supplier": "Coorg Agro",
                "shelf_life_days": 180,
                "days_to_expiry": 150
            },
            {
                "product_id": 7,
                "sku": "SKU-6012",
                "name": "Lemon Power Dishwash Gel 750ml",
                "category": "Household & Cleaning",
                "category_id": 6,
                "brand": "GlowClean",
                "unit_cost": 85.00,
                "list_price": 140.00,
                "on_hand": 180,
                "on_order": 0,
                "daily_demand": 10.0,
                "lead_time_days": 3.0,
                "moq": 20,
                "supplier": "Hindustan Consumer",
                "shelf_life_days": 730,
                "days_to_expiry": 600
            },
            {
                "product_id": 8,
                "sku": "SKU-6033",
                "name": "Citrus Surface Cleaner 2L",
                "category": "Household & Cleaning",
                "category_id": 6,
                "brand": "PureHome Pro",
                "unit_cost": 130.00,
                "list_price": 220.00,
                "on_hand": 142,
                "on_order": 0,
                "daily_demand": 10.0,
                "lead_time_days": 3.0,
                "moq": 25,
                "supplier": "Hindustan Consumer",
                "shelf_life_days": 730,
                "days_to_expiry": 620
            }
        ]

        self.pipeline_runs = [
            {
                "run_id": "run_20261031_080000",
                "started_at": "2026-10-31T07:45:00Z",
                "finished_at": "2026-10-31T07:47:12Z",
                "status": "completed",
                "engine_version": "v2.4.0-cpg",
                "triggered_by": "cron_daily"
            }
        ]

        self.data_quality_issues = [
            {
                "issue_id": 1,
                "run_id": "run_20261031_080000",
                "product_id": 1,
                "sku": "SKU-4412",
                "name": "Royal Basmati Rice 5 kg",
                "issue_type": "zero_stock_lost_demand",
                "severity": "critical",
                "details": "SKU-4412 experienced 2 consecutive zero-inventory days last week. Recorded 0 sales was unconstrained lost demand (~42 units); unobserved demand reconstructed to avoid under-forecasting."
            },
            {
                "issue_id": 2,
                "run_id": "run_20261031_080000",
                "product_id": 4,
                "sku": "SKU-8801",
                "name": "Celebration Assorted Gift Box 500g",
                "issue_type": "negative_stock_anomaly",
                "severity": "warning",
                "details": "Dirty POS sync recorded -3 on_hand on Oct 28. Automatically clamped to 0 and flagged in quality audit ledger."
            }
        ]

        self.recommendations = [
            {
                "rec_id": 1,
                "run_id": "run_20261031_080000",
                "product_id": 1,
                "sku": "SKU-4412",
                "name": "Royal Basmati Rice 5 kg",
                "category": "Grains & Staples",
                "action_type": "replenish",
                "badge": "Replenish",
                "quantity": 120,
                "timing": "Order by Tuesday",
                "params": {
                    "by_day": "Tuesday",
                    "order_cost": 4500,
                    "supplier": "Bharat Agro Foods Ltd",
                    "lead_time_days": 6.0,
                    "moq": 50
                },
                "expected_value": 38000.00,
                "confidence": "high",
                "rationale": "Stock covers 2.1 days, supplier takes 6 days, festival promotion raises demand about 35%, so a stockout is likely on Thursday.",
                "expected_impact": "Avoids ~₹38,000 in lost sales; order cost ₹4,500.",
                "alternatives_considered": "Transfer (no second store); markdown not applicable; do nothing loses ~₹38,000.",
                "status": "pending",
                "needs_review": False
            },
            {
                "rec_id": 2,
                "run_id": "run_20261031_080000",
                "product_id": 4,
                "sku": "SKU-8801",
                "name": "Celebration Assorted Gift Box 500g",
                "category": "Packaged & Confectionery",
                "action_type": "markdown",
                "badge": "Markdown",
                "quantity": 185,
                "timing": "Execute today",
                "params": {
                    "markdown_pct": 25,
                    "new_price": 240.00,
                    "current_price": 320.00,
                    "days_to_expiry": 22
                },
                "expected_value": 8420.00,
                "confidence": "high",
                "rationale": "Stock covers 48 days against 14-day target. Shelf life expires in 22 days. A 25% markdown stimulates velocity and clears inventory before total expiry write-off.",
                "expected_impact": "Recovers ~₹44,400 capital, preventing ₹8,420 spoilage loss.",
                "alternatives_considered": "Vendor return rejected (30% restocking fee + freight); do nothing writes off ₹33,300.",
                "status": "pending",
                "needs_review": False
            },
            {
                "rec_id": 3,
                "run_id": "run_20261031_080000",
                "product_id": 5,
                "sku": "SKU-3110",
                "name": "Refined Sunflower Oil 5L Jar",
                "category": "Edible Oils & Cooking",
                "action_type": "adjust_promotion",
                "badge": "Adjust Promotion",
                "quantity": 0,
                "timing": "Effective tomorrow",
                "params": {
                    "current_discount": 20,
                    "recommended_discount": 10,
                    "margin_recovery": 2850
                },
                "expected_value": 16800.00,
                "confidence": "medium",
                "rationale": "Current 20% discount is driving depletion 2.4x faster than supplier lead time. Dampening discount to 10% extends cover by 6 days and preserves margin.",
                "expected_impact": "Protects ₹16,800 gross margin while preventing premature stockout.",
                "alternatives_considered": "Rush supplier order (expedited shipping cost ₹6,000); cancel promo completely (causes demand crash).",
                "status": "pending",
                "needs_review": False
            },
            {
                "rec_id": 4,
                "run_id": "run_20261031_080000",
                "product_id": 6,
                "sku": "SKU-5521",
                "name": "Premium South Indian Filter Coffee 500g",
                "category": "Beverages",
                "action_type": "substitute",
                "badge": "Substitute Product",
                "quantity": 40,
                "timing": "Move to front endcap today",
                "params": {
                    "substitute_for_sku": "SKU-9901 (Gourmet Arabica)",
                    "similarity": 0.88,
                    "display_location": "Aisle 3 Endcap"
                },
                "expected_value": 6200.00,
                "confidence": "high",
                "rationale": "Primary Gourmet Arabica blend is delayed at customs. Cross-merchandise Premium South Indian Filter Coffee as substitute to capture 70% of displaced shoppers.",
                "expected_impact": "Recovers ₹6,200 in revenue that would otherwise be lost to competitors.",
                "alternatives_considered": "Leave shelf empty (100% loss); discount competing tea (poor category crossover).",
                "status": "pending",
                "needs_review": False
            },
            {
                "rec_id": 5,
                "run_id": "run_20261031_080000",
                "product_id": 8,
                "sku": "SKU-6033",
                "name": "Citrus Surface Cleaner 2L",
                "category": "Household & Cleaning",
                "action_type": "no_action",
                "badge": "No Action",
                "quantity": 0,
                "timing": "Re-evaluate next cycle",
                "params": {
                    "current_cover": 14.2,
                    "target_cover": 14.0
                },
                "expected_value": 0.00,
                "confidence": "high",
                "rationale": "Inventory cover is 14.2 days, perfectly balanced with the 14-day target buffer. Reorder point not yet triggered.",
                "expected_impact": "Prevents premature capital tie-up; zero holding cost penalty.",
                "alternatives_considered": "Early order placement (violates minimum cashflow thresholds).",
                "status": "approved",
                "needs_review": False
            },
            {
                "rec_id": 6,
                "run_id": "run_20261031_080000",
                "product_id": 2,
                "sku": "SKU-2209",
                "name": "Chakki Fresh Atta 10 kg",
                "category": "Grains & Staples",
                "action_type": "transfer",
                "badge": "Transfer Inventory",
                "quantity": 60,
                "timing": "Transfer today (04:00 PM transit)",
                "params": {
                    "source_store": "Store #101 Metro Central",
                    "target_store": "Store #103 Indiranagar Express",
                    "transit_hours": 4,
                    "transit_cost": 450
                },
                "expected_value": 18600.00,
                "confidence": "high",
                "rationale": "Store #101 holds 210 units (14.0 days cover), while neighboring Indiranagar Express Store #103 has depleted to 8 units (1.2 days cover). An intra-district cross-dock transfer of 60 units prevents imminent stockout in 4 hours without new PO cost.",
                "expected_impact": "Averts stockout at Store #103; frees ₹18,600 working capital at Store #101; transit cost ₹450.",
                "alternatives_considered": "Emergency supplier PO (4 days lead time + ₹3,000 expedited transport); do nothing (Store #103 stocks out Thursday).",
                "status": "pending",
                "needs_review": False
            },
            {
                "rec_id": 7,
                "run_id": "run_20261031_080000",
                "product_id": 3,
                "sku": "SKU-1044",
                "name": "Pasteurized Whole Milk 1L",
                "category": "Dairy & Fresh",
                "action_type": "increase_allocation",
                "badge": "Increase Allocation",
                "quantity": 80,
                "timing": "Next morning delivery wave (05:30 AM)",
                "params": {
                    "target_increase_pct": 40,
                    "event": "Bengaluru City Marathon",
                    "channel": "High-Density Express"
                },
                "expected_value": 12400.00,
                "confidence": "high",
                "rationale": "Bengaluru City Marathon route passes Store #101 this weekend. Demand velocity for fresh dairy and grab-and-go hydration is modeled to lift +45%. Increasing Central DC allocation by 80 units prevents morning rush shelf depletion.",
                "expected_impact": "Protects ₹12,400 in weekend morning sales; preserves 99.2% customer service availability.",
                "alternatives_considered": "Standard allocation (stockout by 09:30 AM); rush afternoon re-order (high transport penalty).",
                "status": "pending",
                "needs_review": False
            }
        ]

        self.decisions = []
        self.action_orders = []

        self.backtest = {
            "summary": {
                "period": "Last 6 Weeks Holdout Replay",
                "sku_count": 120,
                "ai_roi_multiple": "4.8x",
                "annualized_savings": "₹4,12,000"
            },
            "comparison": [
                {
                    "metric": "Stockout Rate",
                    "baseline": "14.8%",
                    "ai": "4.2%",
                    "change": "-71.6%",
                    "favorable": True,
                    "impact": "10.6% fewer out-of-stock incidents"
                },
                {
                    "metric": "Service Level",
                    "baseline": "85.2%",
                    "ai": "96.8%",
                    "change": "+11.6%",
                    "favorable": True,
                    "impact": "Exceeds 95% SLA target"
                },
                {
                    "metric": "Excess Stock Value",
                    "baseline": "₹24,500",
                    "ai": "₹7,800",
                    "change": "-68.2%",
                    "favorable": True,
                    "impact": "₹16,700 tied capital unlocked"
                },
                {
                    "metric": "Gross Margin",
                    "baseline": "18.2%",
                    "ai": "23.4%",
                    "change": "+5.2%",
                    "favorable": True,
                    "impact": "₹16,429 net profit increase"
                },
                {
                    "metric": "Holding Cost",
                    "baseline": "₹3,675",
                    "ai": "₹1,170",
                    "change": "-68.2%",
                    "favorable": True,
                    "impact": "Lower warehouse footprint"
                }
            ],
            "chart_data": {
                "weeks": ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
                "baseline_stockouts": [16.2, 14.8, 15.5, 17.1, 13.9, 14.8],
                "ai_stockouts": [9.1, 6.4, 5.0, 4.2, 3.8, 4.2],
                "baseline_service_level": [83.8, 85.2, 84.5, 82.9, 86.1, 85.2],
                "ai_service_level": [90.9, 93.6, 95.0, 95.8, 96.2, 96.8]
            }
        }

        self.whatsapp_messages = [
            {
                "id": 1,
                "sender": "bot",
                "text": "⚠️ *CRITICAL STOCKOUT ALERT*\n\n*Item:* Royal Basmati Rice 5 kg (SKU-4412)\n*Action:* Replenish 120 units by Tuesday\n*Why:* Stock covers 2.1 days, supplier takes 6 days, festival promo raises demand ~35%.\n*Expected Impact:* Avoids ₹38,000 lost sales; order cost ₹4,500.\n*Confidence:* High",
                "timestamp": "08:15 AM",
                "rec_id": 1,
                "has_actions": True
            },
            {
                "id": 2,
                "sender": "user",
                "text": "Which items will run out this week?",
                "timestamp": "08:22 AM"
            },
            {
                "id": 3,
                "sender": "bot",
                "text": "📋 *High Risk SKUs This Week:*\n\n1. *Royal Basmati Rice 5kg:* 2.1 days cover (Out by Thursday) - Loss risk: ₹38,000\n2. *Refined Sunflower Oil 5L:* 3.8 days cover (Out by Saturday) - Loss risk: ₹16,800\n\nReply with *Approve 1* to order Rice or *Details* for full breakdown.",
                "timestamp": "08:23 AM"
            }
        ]

    def get_dashboard_kpis(self) -> Dict[str, Any]:
        """Returns the high level executive KPI summary cards matching the uploaded design."""
        total_skus = len(self.products)
        at_risk = [p for p in self.products if p["on_hand"] / max(p["daily_demand"], 1) < p["lead_time_days"]]
        stockout_val = sum(r["expected_value"] for r in self.recommendations if r["action_type"] == "replenish" and r["status"] == "pending")
        excess_val = sum(r["expected_value"] for r in self.recommendations if r["action_type"] == "markdown" and r["status"] == "pending")

        return {
            "service_level": {
                "value": "96.8%",
                "target": "95.0%",
                "change": "+2.4%",
                "favorable": True,
                "subtitle": "5,120 demand units fulfilled"
            },
            "stockout_risk": {
                "value": f"₹{int(stockout_val):,}",
                "items_count": len(at_risk),
                "change": "-42.1%",
                "favorable": True,
                "subtitle": f"{len(at_risk)} critical SKUs require PO"
            },
            "excess_inventory": {
                "value": f"₹{int(excess_val):,}",
                "items_count": 1,
                "change": "-18.5%",
                "favorable": True,
                "subtitle": "1 markdown candidate flagged"
            },
            "projected_margin": {
                "value": "₹1,42,800",
                "rate": "23.4%",
                "change": "+5.2% vs baseline",
                "favorable": True,
                "subtitle": "AI policy margin expansion"
            },
            "orders_progress": {
                "fulfilled": 125090,
                "total_demand": 200000,
                "percentage": 62.5
            }
        }

    def get_recommendations(self) -> List[Dict[str, Any]]:
        return self.recommendations

    def get_risk_board(self) -> List[Dict[str, Any]]:
        """Compute live cover days and risk status for all SKUs."""
        risk_board = []
        for p in self.products:
            cover_days = round(p["on_hand"] / max(p["daily_demand"], 0.1), 1)
            reorder_point = int((p["daily_demand"] * p["lead_time_days"]) + (p["daily_demand"] * 2.0))
            is_stockout_risk = cover_days <= p["lead_time_days"]
            is_excess = cover_days > 30 and p["days_to_expiry"] < 45

            risk_type = "Critical Stockout" if is_stockout_risk else ("Excess / Expiry" if is_excess else "Healthy")
            risk_score = 92 if is_stockout_risk else (78 if is_excess else 8)

            risk_board.append({
                "product_id": p["product_id"],
                "sku": p["sku"],
                "name": p["name"],
                "category": p["category"],
                "on_hand": p["on_hand"],
                "on_order": p["on_order"],
                "daily_demand": p["daily_demand"],
                "lead_time_days": p["lead_time_days"],
                "days_of_cover": cover_days,
                "reorder_point": reorder_point,
                "risk_type": risk_type,
                "risk_score": risk_score,
                "days_to_expiry": p["days_to_expiry"],
                "supplier": p["supplier"]
            })
        return risk_board

    def decide_recommendation(self, rec_id: int, decision: str, edited_quantity: Optional[int] = None, reason: str = "") -> Dict[str, Any]:
        """Records a human decision (approve, modify, reject) immutably and generates an action order if approved."""
        target_rec = None
        for r in self.recommendations:
            if r["rec_id"] == rec_id:
                target_rec = r
                break
        
        if not target_rec:
            return {"error": "Recommendation not found"}

        dec_record = {
            "decision_id": len(self.decisions) + 1,
            "rec_id": rec_id,
            "decision": decision,
            "edited_quantity": edited_quantity,
            "reason": reason,
            "decided_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }
        self.decisions.append(dec_record)
        target_rec["status"] = decision

        action_order = None
        if decision in ["approved", "modified"]:
            qty = edited_quantity if edited_quantity is not None else target_rec["quantity"]
            action_order = {
                "order_id": len(self.action_orders) + 1,
                "rec_id": rec_id,
                "sku": target_rec["sku"],
                "product_name": target_rec["name"],
                "action_type": target_rec["action_type"],
                "quantity": qty,
                "status": "executed",
                "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
            }
            self.action_orders.append(action_order)

        return {
            "status": "success",
            "decision": dec_record,
            "action_order": action_order
        }

    def handle_whatsapp_message(self, text: str) -> Dict[str, Any]:
        """Natural language reasoning for incoming WhatsApp messages and action buttons."""
        clean_text = text.strip().lower()
        now_time = datetime.datetime.now().strftime("%I:%M %p")

        # Check for direct approval of recommendation
        if "approve" in clean_text or "1" == clean_text:
            rec = next((r for r in self.recommendations if r["rec_id"] == 1), None)
            if rec:
                self.decide_recommendation(1, "approved", reason="Approved via WhatsApp")
                reply = (
                    "✅ *Approved! Purchase Order Generated*\n\n"
                    "• *Item:* Royal Basmati Rice 5 kg\n"
                    "• *Quantity:* 120 units\n"
                    "• *Supplier:* Bharat Agro Foods Ltd\n"
                    "• *Expected Arrival:* Thursday 11:00 AM\n\n"
                    "Your store dashboard and order ledger have been updated."
                )
            else:
                reply = "No pending recommendation to approve."
        elif "reject" in clean_text or "3" == clean_text:
            self.decide_recommendation(1, "rejected", reason="Rejected via WhatsApp")
            reply = "❌ *Decision Logged:* Recommendation #1 rejected. Reason archived to audit ledger."
        else:
            # Leverage Groq LLM with full enterprise store context
            llm_reply = None
            try:
                from app.services.llm_reasoning_service import llm_service
                llm_reply = llm_service.reason_conversational(text, self.whatsapp_messages)
            except Exception as e:
                print("[RetailDecisionService] LLM fallback note:", e)

            if llm_reply:
                reply = llm_reply
            elif "stockout" in clean_text or "run out" in clean_text or "empty" in clean_text:
                reply = (
                    "🚨 *Stockout Risk Alert (Next 7 Days):*\n\n"
                    "1. *Royal Basmati Rice 5kg* (SKU-4412)\n"
                    "   • Current Stock: 38 units (2.1 days cover)\n"
                    "   • Supplier Lead: 6 days\n"
                    "   • Recommended: Order 120 units by Tuesday\n\n"
                    "2. *Refined Sunflower Oil 5L* (SKU-3110)\n"
                    "   • Current Stock: 45 units (3.8 days cover)\n"
                    "   • Recommended: Dampen promo discount to 10%\n\n"
                    "Reply *Approve 1* to execute rice order immediately."
                )
            elif "service level" in clean_text or "kpi" in clean_text:
                reply = (
                    "📊 *Today's Store Performance:*\n\n"
                    "• *Service Level:* 96.8% (Target: 95.0%)\n"
                    "• *Stockout Rate:* 4.2% (-71% vs baseline)\n"
                    "• *Active Margin:* 23.4% (+5.2% lift)\n"
                    "• *Pending Decisions:* 3 items awaiting review"
                )
            elif "excess" in clean_text or "markdown" in clean_text:
                reply = (
                    "📦 *Excess & Expiry Risk:*\n\n"
                    "• *Cadbury Celebration Gift Box 500g* (SKU-8801)\n"
                    "   • On hand: 240 units (48 days cover)\n"
                    "   • Days to Expiry: 22 days\n"
                    "   • Action: Apply 25% markdown (New Price: ₹240)\n\n"
                    "Reply *Approve Markdown* to push price tags to store POS."
                )
            else:
                reply = (
                    f"🤖 *RetailSense AI Bot*\n\n"
                    "I understand commands such as:\n"
                    "• *'Which items will run out this week?'*\n"
                    "• *'Show excess inventory'* or *'Markdowns'*\n"
                    "• *'What is our service level?'*\n"
                    "• *'Approve 1'* to authorize purchase orders"
                )

        new_msg = {
            "id": len(self.whatsapp_messages) + 2,
            "sender": "bot",
            "text": reply,
            "timestamp": now_time
        }
        self.whatsapp_messages.append({"id": len(self.whatsapp_messages) + 1, "sender": "user", "text": text, "timestamp": now_time})
        self.whatsapp_messages.append(new_msg)

        return {"response": reply, "messages": self.whatsapp_messages}

# Singleton instance
retail_service = RetailDecisionService()

