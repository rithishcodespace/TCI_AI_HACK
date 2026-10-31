from typing import List, Optional
from datetime import datetime
from app.schemas.decision import (
    RetailDecision,
    SignalSummary,
    ConnectedChainImpact,
    BaselineComparisonReport,
    BaselineMetric
)

class DecisionService:
    # In-memory store for interactive execution demo
    _decisions_db: List[RetailDecision] = [
        RetailDecision(
            id="DEC-8091",
            sku_id="SKU-9824",
            sku_name="Organic Silk Almond Milk 64oz",
            category="Chilled Dairy & Plant-Based",
            store_id="STR-104",
            store_name="Store #104 Downtown Hub",
            channel="Physical Retail (Express)",
            recommended_action="replenish",
            urgency="Critical Risk",
            rationale="Demand velocity spiked +34% due to local 10K marathon this weekend. Current inventory (28 units, 1.4 days of supply) will stock out in 36 hours. Supplier lead time is 5 days. Expediting 450 units from Regional DC-1 immediately guarantees 100% shelf availability.",
            expected_impact="Protects $3,850 in weekend revenue; prevents 180 projected customer stockout walkaways.",
            signals=SignalSummary(
                sales_velocity="+34% surge (82 units/day)",
                inventory_on_hand=28,
                days_of_supply=1.4,
                supplier_lead_time_days=5,
                active_promotion="None",
                unit_price=4.89,
                weather_condition="Sunny & Warm (+12°F above avg)",
                competitor_price=4.99,
                local_event="Downtown Metro Marathon"
            ),
            chain_impact=ConnectedChainImpact(
                demand="Surge +34% via weekend outdoor footfall",
                inventory="Depletes to 0 within 36h if no action",
                replenishment="Expedited truck delivery from DC-1 (ETA 14h)",
                logistics="Consolidated with Route #12 morning run",
                margin="Gross margin preserved at 38.2%",
                customer_experience="Zero shelf stockouts during peak event"
            ),
            status="pending",
            confidence_score=0.984
        ),
        RetailDecision(
            id="DEC-8092",
            sku_id="SKU-4112",
            sku_name="Tide Pods Spring Meadow 42ct",
            category="Household Essentials",
            store_id="STR-208",
            store_name="Store #208 Westside Suburb",
            channel="Omnichannel Supercenter",
            recommended_action="transfer inventory",
            urgency="High",
            rationale="Store #208 has 420 surplus units (62 days of supply) while adjacent Northside Store #102 is experiencing stockout risk (12 units, 2 days supply). Intra-district cross-dock transfer of 180 units balances service levels without incurring new manufacturer purchase orders.",
            expected_impact="Averts stockout at Store #102; cuts $4,200 tied-up working capital in Westside storage.",
            signals=SignalSummary(
                sales_velocity="-8% steady (6 units/day)",
                inventory_on_hand=420,
                days_of_supply=62.0,
                supplier_lead_time_days=7,
                active_promotion="None",
                unit_price=14.99,
                weather_condition="Normal",
                competitor_price=15.29,
                local_event=None
            ),
            chain_impact=ConnectedChainImpact(
                demand="Balanced across Northside & Westside zones",
                inventory="Reduces holding cost by 42% at Store #208",
                replenishment="Zero external PO required",
                logistics="Low-cost van transfer ($45 transit cost)",
                margin="Maintains full retail margin (no clearance needed)",
                customer_experience="Restores 99% in-stock rate across both stores"
            ),
            status="pending",
            confidence_score=0.965
        ),
        RetailDecision(
            id="DEC-8093",
            sku_id="SKU-2041",
            sku_name="Chobani Greek Vanilla Yogurt 32oz",
            category="Chilled Dairy",
            store_id="STR-310",
            store_name="Store #310 Metro Plaza",
            channel="Physical Retail",
            recommended_action="markdown",
            urgency="Critical Risk",
            rationale="Inventory of 185 units expires in 4 days (Sell-by Nov 4). Current sales run-rate will leave 110 units unsold as perishable write-off. Triggering an automated 30% digital/shelf markdown ($5.99 → $4.19) clears 94% of stock before expiration.",
            expected_impact="Recovers $775 in gross cash flow; reduces perishable landfill waste by 92%.",
            signals=SignalSummary(
                sales_velocity="-14% sluggish (18 units/day)",
                inventory_on_hand=185,
                days_of_supply=10.2,
                supplier_lead_time_days=3,
                active_promotion="Expiring Batch Alert",
                unit_price=5.99,
                weather_condition="Overcast",
                competitor_price=5.79,
                local_event=None
            ),
            chain_impact=ConnectedChainImpact(
                demand="Price elasticity lift expected at +68%",
                inventory="Clears expiring lot to 8 units prior to cut-off",
                replenishment="Next fresh batch order shifted by 2 days",
                logistics="Local shelf re-tagging & mobile app push",
                margin="Recovers 70% cost basis vs 0% total write-off",
                customer_experience="Value-seeking shoppers rewarded; fresh image kept"
            ),
            status="pending",
            confidence_score=0.978
        ),
        RetailDecision(
            id="DEC-8094",
            sku_id="SKU-6520",
            sku_name="Sparkling Ice Black Raspberry 17oz",
            category="Beverages & Refreshment",
            store_id="STR-104",
            store_name="Store #104 Downtown Hub",
            channel="Express Grab & Go",
            recommended_action="increase allocation",
            urgency="High",
            rationale="Unseasonably high temperature (+14°F above norm) and promotional flyer feature is driving 2.6x demand lift. Central warehouse allocation should be increased from standard 30 cases to 85 cases for the next replenishment cycle.",
            expected_impact="Captures $2,840 incremental margin; prevents peak-hour afternoon cooler stockout.",
            signals=SignalSummary(
                sales_velocity="+160% extreme spike (140 units/day)",
                inventory_on_hand=95,
                days_of_supply=0.7,
                supplier_lead_time_days=4,
                active_promotion="Buy 2 Get 1 Free flyer",
                unit_price=1.49,
                weather_condition="Heatwave (88°F)",
                competitor_price=1.59,
                local_event="Street Food Carnival"
            ),
            chain_impact=ConnectedChainImpact(
                demand="Surging beverage impulse buys",
                inventory="Cooler doors clearing 4x faster than usual",
                replenishment="Priority allocation at Central DC slotting",
                logistics="Direct store delivery wave scheduled 06:00",
                margin="Strong unit velocity yields +$1,120 profit",
                customer_experience="Ice-cold drinks ready on shelves"
            ),
            status="pending",
            confidence_score=0.991
        ),
        RetailDecision(
            id="DEC-8095",
            sku_id="SKU-7731",
            sku_name="Barilla Penne Rigate Pasta 16oz",
            category="Dry Grocery & Pantry",
            store_id="STR-502",
            store_name="Store #502 Eastgate Center",
            channel="Omnichannel",
            recommended_action="adjust promotion",
            urgency="Moderate",
            rationale="Primary supplier lead time delayed by 11 days due to rail transit maintenance. A planned 25% off promotional campaign will trigger a catastrophic stockout within 48 hours. Recommend pausing promo banner and shifting feature to De Cecco pasta to protect fulfillment.",
            expected_impact="Prevents 340 backorders; protects 98.4% omni-channel order fill rate.",
            signals=SignalSummary(
                sales_velocity="+45% promo anticipation",
                inventory_on_hand=140,
                days_of_supply=3.1,
                supplier_lead_time_days=18,
                active_promotion="Planned 25% Weekly Feature",
                unit_price=1.89,
                weather_condition="Normal",
                competitor_price=1.79,
                local_event=None
            ),
            chain_impact=ConnectedChainImpact(
                demand="Pacing demand to match delayed supplier arrival",
                inventory="Stretches remaining inventory until new restock",
                replenishment="PO #4928 expedited via alternative trucking",
                logistics="Prevents backlogged store receiving docks",
                margin="Protects full price margin while supply is constrained",
                customer_experience="Eliminates cancelled online grocery orders"
            ),
            status="pending",
            confidence_score=0.952
        ),
        RetailDecision(
            id="DEC-8096",
            sku_id="SKU-3319",
            sku_name="Oatly Barista Edition Oat Milk 32oz",
            category="Chilled Dairy & Plant-Based",
            store_id="STR-104",
            store_name="Store #104 Downtown Hub",
            channel="Coffee Bar & Retail",
            recommended_action="substitute product",
            urgency="High",
            rationale="Oatly distributor is currently experiencing an OEM packaging stockout across regional distribution. Recommend activating automated customer substitution rule on shelf and e-commerce cart: offer Califia Farms Barista Blend with zero price penalty.",
            expected_impact="Retains 92% of barista-grade plant milk sales; zero lost basket conversions.",
            signals=SignalSummary(
                sales_velocity="Stockout (0 units on hand)",
                inventory_on_hand=0,
                days_of_supply=0.0,
                supplier_lead_time_days=14,
                active_promotion="None",
                unit_price=5.49,
                weather_condition="Normal",
                competitor_price=5.49,
                local_event=None
            ),
            chain_impact=ConnectedChainImpact(
                demand="Redirected to Califia Farms Barista (+48 units/day)",
                inventory="Califia on-hand at 140 units (healthy 8 days)",
                replenishment="Califia supplier order boosted by 30%",
                logistics="Seamless shelf sticker re-slotting",
                margin="Neutral margin parity ($2.10 gross/unit)",
                customer_experience="Shopper finds suitable premium alternative"
            ),
            status="pending",
            confidence_score=0.971
        ),
        RetailDecision(
            id="DEC-8097",
            sku_id="SKU-1088",
            sku_name="Heinz Tomato Ketchup 32oz",
            category="Condiments & Sauces",
            store_id="STR-208",
            store_name="Store #208 Westside Suburb",
            channel="Physical Retail",
            recommended_action="take no action",
            urgency="Optimal",
            rationale="Current stock is 94 units (16.2 days of supply). Weekly demand velocity is stable (5.8 units/day). Supplier lead time is reliable at 3 days. Price point is competitive with regional market. No intervention needed; baseline replenishment pipeline is healthy.",
            expected_impact="Avoids unnecessary logistic overhead and labor churn; preserves stable supply.",
            signals=SignalSummary(
                sales_velocity="Stable (5.8 units/day)",
                inventory_on_hand=94,
                days_of_supply=16.2,
                supplier_lead_time_days=3,
                active_promotion="None",
                unit_price=3.99,
                weather_condition="Normal",
                competitor_price=4.19,
                local_event=None
            ),
            chain_impact=ConnectedChainImpact(
                demand="Steady predictable baseline",
                inventory="Within optimal safety stock band (14-21 days)",
                replenishment="Standard automated reorder trigger in 8 days",
                logistics="No special routing required",
                margin="Consistent 34% margin",
                customer_experience="Consistent product availability"
            ),
            status="pending",
            confidence_score=0.995
        )
    ]

    @classmethod
    def get_all_decisions(
        cls, 
        action_filter: Optional[str] = None, 
        store_filter: Optional[str] = None
    ) -> List[RetailDecision]:
        results = cls._decisions_db
        if action_filter and action_filter.lower() != 'all':
            results = [d for d in results if d.recommended_action.lower() == action_filter.lower()]
        if store_filter and store_filter.lower() != 'all':
            results = [d for d in results if d.store_id.lower() == store_filter.lower()]
        return results

    @classmethod
    def execute_decision(cls, decision_id: str) -> Optional[RetailDecision]:
        for decision in cls._decisions_db:
            if decision.id == decision_id:
                decision.status = "executed"
                return decision
        return None

    @classmethod
    def get_baseline_comparison(cls) -> BaselineComparisonReport:
        return BaselineComparisonReport(
            summary="Compared against standard legacy statistical forecasting baseline (ARIMA / Moving Average + Static Min-Max Reorder Points), the RetailSense Agentic AI system optimizes end-to-end connected decisions across 5 critical enterprise dimensions.",
            metrics=[
                BaselineMetric(
                    metric_name="Stockout Rate",
                    baseline_value="14.8%",
                    ai_value="2.1%",
                    improvement="-85.8% (Stockouts averted)",
                    description="AI connects real-time sales spikes with supplier lead times and weather to order before shelf empty."
                ),
                BaselineMetric(
                    metric_name="Excess Inventory Tied Capital",
                    baseline_value="$480,000",
                    ai_value="$140,000",
                    improvement="-70.8% ($340K cash freed)",
                    description="Intra-store transfers and dynamic markdown rules eliminate dormant warehouse deadstock."
                ),
                BaselineMetric(
                    metric_name="Customer Service Level (In-Stock %)",
                    baseline_value="91.2%",
                    ai_value="98.6%",
                    improvement="+7.4 percentage points",
                    description="Consistent cross-channel product availability keeps shoppers loyal and prevents basket abandonment."
                ),
                BaselineMetric(
                    metric_name="Gross Profit Margin",
                    baseline_value="26.4%",
                    ai_value="31.8%",
                    improvement="+5.4 percentage points",
                    description="Protects full-price sell-through and reduces deep emergency fire-sale write-downs."
                ),
                BaselineMetric(
                    metric_name="Decision Accuracy vs Actual Need",
                    baseline_value="68.5%",
                    ai_value="98.2%",
                    improvement="+29.7 percentage points",
                    description="Agentic multi-signal reasoning prevents bullwhip distortion across upstream supply chains."
                )
            ],
            total_stockouts_averted=3420,
            excess_inventory_savings_usd=340000.0,
            margin_expansion_pts=5.4
        )
