-- ============================================================================
-- AUTONOMOUS RETAIL DECISION INTELLIGENCE (Challenge 10)
-- Production Seed Data for Supabase
-- ============================================================================

-- Zone 1: Master Data
INSERT INTO store (store_id, name, lat, lon, city, currency)
VALUES (1, 'Metro Central Supermart (Store #101)', 12.9716, 77.5946, 'Bengaluru', 'USD')
ON CONFLICT (store_id) DO NOTHING;

INSERT INTO shop_settings (store_id, service_level_target, max_markdown_pct, min_margin_pct, target_cover_days, auto_approve_enabled)
VALUES (1, 95.00, 40.00, 15.00, 14.00, false)
ON CONFLICT DO NOTHING;

INSERT INTO category (category_id, name, default_shelf_life_days, default_elasticity) VALUES
(1, 'Grains & Staples', 365, -0.85),
(2, 'Dairy & Fresh', 7, -1.90),
(3, 'Packaged & Confectionery', 180, -1.65),
(4, 'Edible Oils & Cooking', 240, -1.10),
(5, 'Beverages', 180, -1.40),
(6, 'Household & Cleaning', 730, -0.90)
ON CONFLICT (category_id) DO NOTHING;

INSERT INTO supplier (supplier_id, name, phone, email, reliability_score) VALUES
(1, 'Bharat Agro Foods Ltd', '+91 98450 11223', 'orders@bharatagro.com', 94.50),
(2, 'Nandini Dairy Federation', '+91 98450 44556', 'supply@nandinidairy.in', 98.20),
(3, 'Mondelez India Logistics', '+91 98450 77889', 'dispatch@mondelez.com', 91.00),
(4, 'Fortune Agrotech Supplies', '+91 98450 99001', 'b2b@fortuneagro.in', 96.00)
ON CONFLICT (supplier_id) DO NOTHING;

INSERT INTO product (product_id, sku, name, category_id, brand, unit_cost, list_price, shelf_life_days, is_active) VALUES
(1, 'SKU-4412', 'Royal Basmati Rice 5 kg', 1, 'Royal Aroma', 260.00, 395.00, 365, true),
(2, 'SKU-2209', 'Chakki Fresh Atta 10 kg', 1, 'Annapurna', 310.00, 420.00, 120, true),
(3, 'SKU-1044', 'Pasteurized Whole Milk 1L', 2, 'Nandini GoodLife', 42.00, 54.00, 5, true),
(4, 'SKU-8801', 'Celebration Assorted Gift Box 500g', 3, 'Cadbury Royal', 180.00, 320.00, 60, true),
(5, 'SKU-3110', 'Refined Sunflower Oil 5L Jar', 4, 'SunPure Gold', 520.00, 690.00, 240, true),
(6, 'SKU-5521', 'Premium South Indian Filter Coffee 500g', 5, 'Coorg Harvest', 175.00, 275.00, 180, true),
(7, 'SKU-6012', 'Lemon Power Dishwash Gel 750ml', 6, 'GlowClean', 85.00, 140.00, 730, true),
(8, 'SKU-6033', 'Citrus Surface Cleaner 2L', 6, 'PureHome Pro', 130.00, 220.00, 730, true)
ON CONFLICT (product_id) DO NOTHING;

INSERT INTO product_supplier (product_id, supplier_id, lead_time_mean_days, lead_time_std_days, moq, pack_size, unit_cost) VALUES
(1, 1, 6.0, 1.2, 50, 10, 260.00),
(2, 1, 4.0, 0.8, 30, 5, 310.00),
(3, 2, 1.0, 0.2, 100, 20, 42.00),
(4, 3, 7.0, 1.5, 40, 10, 180.00),
(5, 4, 5.0, 1.0, 25, 5, 520.00)
ON CONFLICT (product_id, supplier_id) DO NOTHING;

-- Zone 3: Business Context
INSERT INTO event (event_id, name, event_type, start_date, end_date, expected_uplift_pct, category_id) VALUES
(1, 'Grand Festival Mega Sale', 'festival', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '10 days', 35.00, 1),
(2, 'Diwali Confectionery Surge', 'festival', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '1 day', 45.00, 3)
ON CONFLICT (event_id) DO NOTHING;

INSERT INTO promotion (promo_id, name, promo_type, start_date, end_date, discount_pct, status) VALUES
(1, 'Festival Feast Specials', 'discount', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE + INTERVAL '7 days', 15.00, 'active'),
(2, 'Edible Oil Price Splash', 'discount', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '5 days', 20.00, 'active')
ON CONFLICT (promo_id) DO NOTHING;

INSERT INTO promotion_product (promo_id, product_id) VALUES
(1, 1),
(2, 5)
ON CONFLICT (promo_id, product_id) DO NOTHING;

-- Zone 4: Pipeline Run & AI Outputs
INSERT INTO pipeline_run (run_id, started_at, finished_at, status, engine_version, params, triggered_by)
VALUES ('run_20261031_080000', NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '13 minutes', 'completed', 'v2.4.0-cpg', '{"lookback_days": 90, "forecast_horizon": 21, "confidence_level": 0.90}'::jsonb, 'cron_daily')
ON CONFLICT (run_id) DO NOTHING;

INSERT INTO data_quality_issue (run_id, product_id, issue_type, severity, details) VALUES
('run_20261031_080000', 1, 'zero_stock_lost_demand', 'critical', 'SKU-4412 experienced 2 consecutive zero-inventory days last week. Recorded 0 sales was unconstrained lost demand (~42 units); unobserved demand has been reconstructed.'),
('run_20261031_080000', 4, 'negative_stock_anomaly', 'warning', 'Dirty POS sync reported -3 on_hand on Oct 28. Automatically clamped to 0 and logged to data quality audit ledger.')
ON CONFLICT DO NOTHING;

INSERT INTO risk_score (risk_id, run_id, store_id, product_id, risk_type, days_of_cover, stockout_prob, expected_stockout_date, excess_units, excess_value, money_at_stake) VALUES
(1, 'run_20261031_080000', 1, 1, 'stockout', 2.10, 92.40, CURRENT_DATE + INTERVAL '2 days', 0, 0.00, 38000.00),
(2, 'run_20261031_080000', 1, 4, 'excess', 48.00, 3.10, NULL, 185, 33300.00, 8420.00),
(3, 'run_20261031_080000', 1, 5, 'stockout', 3.80, 78.50, CURRENT_DATE + INTERVAL '4 days', 0, 0.00, 16800.00),
(4, 'run_20261031_080000', 1, 8, 'balanced', 14.20, 4.50, NULL, 0, 0.00, 0.00)
ON CONFLICT (risk_id) DO NOTHING;

INSERT INTO recommendation (rec_id, run_id, risk_id, store_id, product_id, action_type, quantity, params, expected_value, confidence, needs_review, rationale, status, expires_at) VALUES
(1, 'run_20261031_080000', 1, 1, 1, 'replenish', 120, '{"by_day": "Tuesday", "order_cost": 4500, "supplier": "Bharat Agro Foods Ltd", "moq": 50, "lead_time_days": 6}'::jsonb, 38000.00, 'high', false, 'Stock covers only 2.1 days, supplier lead time is 6 days. Festival promotion increases demand by ~35%, making a stockout likely by Thursday.', 'pending', NOW() + INTERVAL '24 hours'),
(2, 'run_20261031_080000', 2, 1, 4, 'markdown', 185, '{"markdown_pct": 25, "new_price": 240.00, "current_price": 320.00, "days_to_expiry": 22}'::jsonb, 8420.00, 'high', false, 'Stock covers 48 days against 14-day target. Shelf life expires in 22 days. A 25% markdown stimulates velocity and clears inventory before total expiry write-off.', 'pending', NOW() + INTERVAL '24 hours'),
(3, 'run_20261031_080000', 3, 1, 5, 'adjust_promotion', 0, '{"current_discount": 20, "recommended_discount": 10, "margin_recovery": 2850}'::jsonb, 16800.00, 'medium', false, 'Current 20% discount is driving depletion 2.4x faster than supplier lead time. Dampening discount to 10% extends cover by 6 days and preserves margin.', 'pending', NOW() + INTERVAL '24 hours'),
(4, 'run_20261031_080000', NULL, 1, 6, 'substitute', 40, '{"substitute_for_sku": "SKU-9901", "similarity": 0.88, "cross_merchandise_location": "Front Endcap"}'::jsonb, 6200.00, 'high', false, 'Primary Gourmet Arabica blend is delayed at customs. Cross-merchandise Premium South Indian Filter Coffee as substitute to capture 70% of displaced shoppers.', 'pending', NOW() + INTERVAL '24 hours'),
(5, 'run_20261031_080000', 4, 1, 8, 'no_action', 0, '{"current_cover": 14.2, "target_cover": 14.0}'::jsonb, 0.00, 'high', false, 'Inventory cover is 14.2 days, perfectly balanced with the 14-day target buffer. Reorder point not yet triggered.', 'approved', NOW() + INTERVAL '24 hours')
ON CONFLICT (rec_id) DO NOTHING;

INSERT INTO recommendation_alternative (alt_id, rec_id, action_type, quantity, expected_value, rejected_reason) VALUES
(1, 1, 'transfer', 0, 0.00, 'No secondary donor store within economic transfer radius (single-store deployment).'),
(2, 1, 'markdown', 0, -12000.00, 'Markdown would accelerate stockout of high-velocity staple, compounding revenue loss.'),
(3, 1, 'no_action', 0, -38000.00, 'Do nothing results in 4 days of empty shelves and ₹38,000 lost margin.'),
(4, 2, 'return_to_vendor', 185, 2500.00, 'Vendor return incurs 30% restocking penalty plus return freight; local markdown generates higher net recovery.')
ON CONFLICT (alt_id) DO NOTHING;

-- Zone 5: Users & Replay Runs
INSERT INTO app_user (user_id, name, email, role) VALUES
(1, 'James Collison', 'james@metrocentral.com', 'owner'),
(2, 'Priya Sharma', 'priya.sharma@metrocentral.com', 'manager'),
(3, 'Rajesh Kumar', 'rajesh.staff@metrocentral.com', 'staff')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO replay_run (replay_id, start_date, end_date, seed, status, summary) VALUES
(1, CURRENT_DATE - INTERVAL '42 days', CURRENT_DATE, 42, 'completed', '{"weeks_evaluated": 6, "total_skus": 120, "simulated_events": 4}'::jsonb)
ON CONFLICT (replay_id) DO NOTHING;

INSERT INTO kpi_snapshot (kpi_id, snapshot_date, policy, replay_id, stockout_rate, service_level, excess_value, revenue, gross_margin, holding_cost) VALUES
(1, CURRENT_DATE, 'baseline', 1, 14.80, 85.20, 24500.00, 198500.00, 36127.00, 3675.00),
(2, CURRENT_DATE, 'ai', 1, 4.20, 96.80, 7800.00, 224600.00, 52556.00, 1170.00)
ON CONFLICT (kpi_id) DO NOTHING;

-- Zone 6: WhatsApp Demo Link & Messages
INSERT INTO whatsapp_link (link_id, user_id, phone_hash, phone_display, verified_at, opted_in) VALUES
(1, 1, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', '+91 98*** **210', NOW(), true)
ON CONFLICT (link_id) DO NOTHING;

INSERT INTO whatsapp_message (msg_id, user_id, direction, body, intent, linked_rec_id, created_at) VALUES
(1, 1, 'outbound', '⚠️ *CRITICAL STOCKOUT ALERT*
Item: Royal Basmati Rice 5kg (SKU-4412)
Action: Replenish 120 units by Tuesday
Why: Stock covers 2.1 days, supplier takes 6 days, festival promo raises demand ~35%.
Money at stake: Avoids ₹38,000 lost sales.
Reply: 1 to Approve, 2 to Modify, 3 to Reject', 'alert_action', 1, NOW() - INTERVAL '2 hours'),
(2, 1, 'inbound', 'Which items will run out this week?', 'ask_stockout', NULL, NOW() - INTERVAL '1 hour'),
(3, 1, 'outbound', '📋 *Items at Risk This Week:*
1. Royal Basmati Rice 5kg: 2.1 days cover (Out on Thursday)
2. Refined Sunflower Oil 5L: 3.8 days cover (Out on Saturday)
Recommendation orders are ready in your dashboard.', 'ask_stockout_response', NULL, NOW() - INTERVAL '59 minutes')
ON CONFLICT (msg_id) DO NOTHING;

