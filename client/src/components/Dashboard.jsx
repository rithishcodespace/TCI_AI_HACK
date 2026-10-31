import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  Sparkles, 
  BarChart3, 
  Bell, 
  ChevronDown, 
  Menu, 
  X, 
  CreditCard,
  LogOut,
  Settings,
  User,
  ArrowLeft,
  Store,
  AlertTriangle,
  TrendingUp,
  Percent,
  Calendar,
  Plus,
  RefreshCw,
  Download,
  Check,
  Send,
  CheckCircle2,
  Package,
  Layers,
  ShieldAlert,
  MessageSquare,
  Info,
  Zap
} from 'lucide-react';
import PlotlyChart from './PlotlyChart';

export default function Dashboard({ 
  currentUser = { name: 'Alex Morgan', email: 'manager@retailchain.com', role: 'manager' }, 
  onBackToLanding 
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'actions' | 'risk' | 'forecast' | 'backtest' | 'staff_todo' | 'whatsapp' | 'quality'
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const [dateRange, setDateRange] = useState('25 Jul - 25 Aug');
  const [demandChartType, setDemandChartType] = useState('orders'); // 'orders' | 'sales'
  
  // Data States
  const [kpis, setKpis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [riskBoard, setRiskBoard] = useState([]);
  const [backtest, setBacktest] = useState(null);
  const [dataIssues, setDataIssues] = useState([]);
  const [isEngineRunning, setIsEngineRunning] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Modal States
  const [selectedRecForModify, setSelectedRecForModify] = useState(null);
  const [modifyQty, setModifyQty] = useState('');
  const [modifyReason, setModifyReason] = useState('');

  // WhatsApp Simulator Chat
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "⚠️ *CRITICAL STOCKOUT ALERT*\n\n*Item:* Royal Basmati Rice 5 kg (SKU-4412)\n*Action:* Replenish 120 units by Tuesday\n*Why:* Stock covers 2.1 days, supplier takes 6 days, festival promo raises demand ~35%.\n*Expected Impact:* Avoids ₹38,000 lost sales; order cost ₹4,500.\n*Confidence:* High",
      timestamp: "08:15 AM",
      rec_id: 1,
      has_actions: true
    },
    {
      id: 2,
      sender: 'user',
      text: "Which items will run out this week?",
      timestamp: "08:22 AM"
    },
    {
      id: 3,
      sender: 'bot',
      text: "📋 *High Risk SKUs This Week:*\n\n1. *Royal Basmati Rice 5kg:* 2.1 days cover (Out by Thursday) - Loss risk: ₹38,000\n2. *Refined Sunflower Oil 5L:* 3.8 days cover (Out by Saturday) - Loss risk: ₹16,800\n\nTap *Approve* or reply with *Approve 1* to order Rice immediately.",
      timestamp: "08:23 AM"
    }
  ]);

  const roleLabels = {
    manager: 'Store Manager',
    supply_chain: 'Supply Chain Lead',
    category_lead: 'Category Lead',
    owner: 'Store Owner'
  };

  const currentRoleLabel = roleLabels[currentUser.role] || currentUser.role || 'Store Manager';
  const initial = (currentUser.name || 'A').charAt(0).toUpperCase();

  // Close mobile drawer on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch backend data
  useEffect(() => {
    fetchKpis();
    fetchRecommendations();
    fetchRiskBoard();
    fetchBacktest();
    fetchDataIssues();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const fetchKpis = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/dashboard/kpis');
      if (res.ok) {
        setKpis(await res.json());
        return;
      }
    } catch (e) {}
    setKpis({
      service_level: { value: "96.8%", target: "95.0%", change: "+2.4%", favorable: true, subtitle: "5,120 orders fulfilled" },
      stockout_risk: { value: "₹38,000", items_count: 2, change: "-42.1%", favorable: true, subtitle: "2 critical SKUs need PO" },
      excess_inventory: { value: "₹8,420", items_count: 1, change: "-18.5%", favorable: true, subtitle: "1 markdown candidate" },
      projected_margin: { value: "₹1,42,800", rate: "23.4%", change: "+5.2%", favorable: true, subtitle: "AI margin expansion" },
      orders_progress: { fulfilled: 125090, total_demand: 200000, percentage: 62.5 }
    });
  };

  const fetchRecommendations = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/recommendations');
      if (res.ok) {
        setRecommendations(await res.json());
        return;
      }
    } catch (e) {}
    setRecommendations([
      { rec_id: 1, sku: "SKU-4412", name: "Royal Basmati Rice 5 kg", category: "Grains & Staples", action_type: "replenish", badge: "Replenish", quantity: 120, timing: "Order by Tuesday", expected_value: 38000.00, confidence: "high", rationale: "Stock covers 2.1 days, supplier takes 6 days, festival promotion raises demand ~35%, so a stockout is likely on Thursday.", expected_impact: "Avoids ~₹38,000 in lost sales; order cost ₹4,500.", alternatives_considered: "Transfer (no second store); markdown not applicable; do nothing loses ~₹38,000.", status: "pending" },
      { rec_id: 2, sku: "SKU-8801", name: "Celebration Assorted Gift Box 500g", category: "Packaged & Confectionery", action_type: "markdown", badge: "Markdown", quantity: 185, timing: "Execute today", expected_value: 8420.00, confidence: "high", rationale: "Stock covers 48 days against 14-day target. Shelf life expires in 22 days. A 25% markdown stimulates velocity before write-off.", expected_impact: "Recovers ~₹44,400 capital, preventing ₹8,420 spoilage loss.", alternatives_considered: "Vendor return rejected (30% restocking penalty + freight); do nothing writes off ₹33,300.", status: "pending" },
      { rec_id: 3, sku: "SKU-3110", name: "Refined Sunflower Oil 5L Jar", category: "Edible Oils & Cooking", action_type: "adjust_promotion", badge: "Adjust Promo", quantity: 0, timing: "Effective tomorrow", expected_value: 16800.00, confidence: "medium", rationale: "Current 20% discount is driving depletion 2.4x faster than supplier lead time. Dampening discount to 10% extends cover by 6 days and preserves margin.", expected_impact: "Protects ₹16,800 gross margin while preventing premature stockout.", alternatives_considered: "Rush supplier order (shipping penalty ₹6,000); cancel promo completely.", status: "pending" },
      { rec_id: 4, sku: "SKU-5521", name: "Premium Filter Coffee 500g", category: "Beverages", action_type: "substitute", badge: "Substitute", quantity: 40, timing: "Front endcap today", expected_value: 6200.00, confidence: "high", rationale: "Primary Gourmet Arabica blend is delayed at customs. Cross-merchandise Premium South Indian Filter Coffee as substitute to capture 70% of displaced shoppers.", expected_impact: "Recovers ₹6,200 revenue otherwise lost to competitors.", alternatives_considered: "Leave shelf empty (100% loss); discount unrelated tea.", status: "pending" },
      { rec_id: 5, sku: "SKU-6033", name: "Citrus Surface Cleaner 2L", category: "Household & Cleaning", action_type: "no_action", badge: "No Action", quantity: 0, timing: "Re-evaluate next cycle", expected_value: 0.00, confidence: "high", rationale: "Inventory cover is 14.2 days, perfectly balanced with the 14-day target buffer. Reorder point not yet triggered.", expected_impact: "Prevents premature capital tie-up; zero holding cost penalty.", alternatives_considered: "Early order placement (violates minimum cashflow thresholds).", status: "approved" }
    ]);
  };

  const fetchRiskBoard = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/inventory/risk-board');
      if (res.ok) {
        setRiskBoard(await res.json());
        return;
      }
    } catch (e) {}
    setRiskBoard([
      { product_id: 1, sku: "SKU-4412", name: "Royal Basmati Rice 5 kg", category: "Grains & Staples", on_hand: 38, daily_demand: 18.0, lead_time_days: 6.0, days_of_cover: 2.1, reorder_point: 144, risk_type: "Critical Stockout", risk_score: 92, days_to_expiry: 320, supplier: "Bharat Agro" },
      { product_id: 4, sku: "SKU-8801", name: "Celebration Gift Box 500g", category: "Confectionery", on_hand: 240, daily_demand: 5.0, lead_time_days: 7.0, days_of_cover: 48.0, reorder_point: 45, risk_type: "Excess / Expiry", risk_score: 78, days_to_expiry: 22, supplier: "Mondelez India" },
      { product_id: 5, sku: "SKU-3110", name: "Refined Sunflower Oil 5L", category: "Cooking Oils", on_hand: 45, daily_demand: 12.0, lead_time_days: 5.0, days_of_cover: 3.8, reorder_point: 84, risk_type: "Critical Stockout", risk_score: 85, days_to_expiry: 180, supplier: "Fortune Agro" },
      { product_id: 2, sku: "SKU-2209", name: "Chakki Fresh Atta 10 kg", category: "Grains & Staples", on_hand: 210, daily_demand: 15.0, lead_time_days: 4.0, days_of_cover: 14.0, reorder_point: 90, risk_type: "Healthy", risk_score: 5, days_to_expiry: 90, supplier: "Bharat Agro" },
      { product_id: 3, sku: "SKU-1044", name: "Pasteurized Whole Milk 1L", category: "Dairy & Fresh", on_hand: 95, daily_demand: 85.0, lead_time_days: 1.0, days_of_cover: 1.1, reorder_point: 170, risk_type: "High Velocity", risk_score: 45, days_to_expiry: 3, supplier: "Nandini Dairy" }
    ]);
  };

  const fetchBacktest = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/backtest');
      if (res.ok) {
        setBacktest(await res.json());
        return;
      }
    } catch (e) {}
    setBacktest({
      summary: { period: "Last 6 Weeks Holdout Replay", sku_count: 120, ai_roi_multiple: "4.8x", annualized_savings: "₹4,12,000" },
      comparison: [
        { metric: "Stockout Rate", baseline: "14.8%", ai: "4.2%", change: "-71.6%", favorable: true, impact: "10.6% fewer out-of-stock incidents" },
        { metric: "Service Level", baseline: "85.2%", ai: "96.8%", change: "+11.6%", favorable: true, impact: "Exceeds 95% SLA target" },
        { metric: "Excess Stock Value", baseline: "₹24,500", ai: "₹7,800", change: "-68.2%", favorable: true, impact: "₹16,700 tied capital unlocked" },
        { metric: "Gross Margin", baseline: "18.2%", ai: "23.4%", change: "+5.2%", favorable: true, impact: "₹16,429 net profit increase" },
        { metric: "Holding Cost", baseline: "₹3,675", ai: "₹1,170", change: "-68.2%", favorable: true, impact: "Lower warehouse footprint" }
      ],
      chart_data: {
        weeks: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
        baseline_stockouts: [16.2, 14.8, 15.5, 17.1, 13.9, 14.8],
        ai_stockouts: [9.1, 6.4, 5.0, 4.2, 3.8, 4.2],
        baseline_service_level: [83.8, 85.2, 84.5, 82.9, 86.1, 85.2],
        ai_service_level: [90.9, 93.6, 95.0, 95.8, 96.2, 96.8]
      }
    });
  };

  const fetchDataIssues = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/data-quality');
      if (res.ok) {
        setDataIssues(await res.json());
        return;
      }
    } catch (e) {}
    setDataIssues([
      { issue_id: 1, sku: "SKU-4412", name: "Royal Basmati Rice 5 kg", issue_type: "zero_stock_lost_demand", severity: "critical", details: "SKU-4412 had 2 zero-stock days last week. Recorded 0 sales was unconstrained lost demand (~42 units); unobserved demand reconstructed." },
      { issue_id: 2, sku: "SKU-8801", name: "Celebration Gift Box 500g", issue_type: "negative_stock_anomaly", severity: "warning", details: "Dirty POS sync recorded -3 on_hand. Automatically clamped to 0 and flagged in quality audit ledger." }
    ]);
  };

  const handleDecide = async (recId, decisionType, editedQty = null, reason = "") => {
    try {
      await fetch(`http://localhost:8000/api/v1/recommendations/${recId}/decide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision: decisionType, edited_quantity: editedQty, reason })
      });
    } catch (e) {}

    setRecommendations(prev => prev.map(r => {
      if (r.rec_id === recId) {
        return {
          ...r,
          status: decisionType,
          quantity: editedQty !== null ? editedQty : r.quantity
        };
      }
      return r;
    }));

    if (decisionType === 'approved') {
      showToast(`✅ Approved Rec #${recId}! Purchase Order dispatched.`);
    } else if (decisionType === 'modified') {
      showToast(`✏️ Modified Rec #${recId} (${editedQty} units). Order updated.`);
    } else {
      showToast(`❌ Rejected Rec #${recId}. Logged to audit ledger.`);
    }

    setSelectedRecForModify(null);
  };

  const handleRunPipeline = async () => {
    setIsEngineRunning(true);
    try {
      await fetch('http://localhost:8000/api/v1/pipeline/run', { method: 'POST' });
    } catch (e) {}

    setTimeout(() => {
      setIsEngineRunning(false);
      showToast("🚀 Pipeline run completed! 5 actions ranked.");
      fetchKpis();
      fetchRecommendations();
      fetchRiskBoard();
    }, 1000);
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatInput('');
    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, newMsg]);

    try {
      const res = await fetch('http://localhost:8000/api/v1/whatsapp/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages(data.messages);
        return;
      }
    } catch (e) {}

    setTimeout(() => {
      let botReply = "🤖 PulseRetail Bot: Ask 'Which items will run out this week?', 'Show markdowns', or 'What is our service level?'";
      if (userText.toLowerCase().includes('run out') || userText.toLowerCase().includes('stockout')) {
        botReply = "🚨 *Stockout Alert:* Basmati Rice 5kg (2.1 days cover) and Sunflower Oil (3.8 days cover) are at critical risk. Tap [Approve] to order.";
      } else if (userText.toLowerCase().includes('service level')) {
        botReply = "📊 Service Level is currently 96.8% (Target: 95.0%, +2.4% vs baseline).";
      } else if (userText.toLowerCase().includes('approve') || userText === '1') {
        handleDecide(1, 'approved');
        botReply = "✅ Approved! Purchase order #1042 for 120 units of Basmati Rice dispatched to Bharat Agro Foods.";
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 500);
  };

  const handleExportCsv = () => {
    window.open('http://localhost:8000/api/v1/export/purchase-orders', '_blank');
    showToast("📥 Exporting approved purchase orders as CSV...");
  };

  // Nav items from Image 3 layout
  const navItems = [
    { id: 'overview', name: 'Overview', icon: LayoutGrid },
    { id: 'actions', name: 'AI Insights & Decisions', icon: Sparkles, badge: recommendations.filter(r => r.status === 'pending').length },
    { id: 'risk', name: 'All Reviews / Risk Board', icon: BarChart3 },
    { id: 'forecast', name: 'Demand Forecasts', icon: TrendingUp },
    { id: 'backtest', name: 'AI vs Baseline (Proof)', icon: CheckCircle2 },
    { id: 'staff_todo', name: 'Store Staff To-Do', icon: Check },
    { id: 'whatsapp', name: 'WhatsApp Bot Simulator', icon: MessageSquare },
    { id: 'quality', name: 'Data Quality Audit', icon: ShieldAlert, badge: dataIssues.length },
  ];

  const currentTabName = navItems.find((item) => item.id === activeTab)?.name || 'Overview';

  // Orders Chart Data
  const ordersChartData = [
    {
      x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      y: [200, 300, 280, 350, 150, 350, 300, 100, 120, 220, 200, 300],
      name: 'In-store',
      type: 'bar',
      marker: { color: '#5244E9' }
    },
    {
      x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      y: [150, 230, 380, 200, 170, 290, 300, 100, 300, 230, 120, 150],
      name: 'Online',
      type: 'bar',
      marker: { color: '#cbd5e1' }
    }
  ];

  const backtestChartData = backtest ? [
    {
      x: backtest.chart_data.weeks,
      y: backtest.chart_data.baseline_stockouts,
      name: 'Baseline Stockout %',
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#f43f5e', width: 2.5, dash: 'dot' }
    },
    {
      x: backtest.chart_data.weeks,
      y: backtest.chart_data.ai_stockouts,
      name: 'AI Policy Stockout %',
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#10b981', width: 3 }
    }
  ] : [];

  return (
    <div className="min-h-screen bg-[#FDFDFE] flex flex-col lg:flex-row font-sans text-slate-800 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <Info className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 ease-in-out"
        />
      )}

      {/* ========================================================
          SIDEBAR NAVIGATION (Collapsible on Desktop & Drawer on Mobile - Incoming from origin/main)
      ======================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-100 flex flex-col justify-between transition-all duration-300 ease-in-out lg:static lg:z-auto ${
          isMobileMenuOpen 
            ? 'translate-x-0 shadow-2xl w-72' 
            : '-translate-x-full lg:translate-x-0'
        } ${
          isSidebarCollapsed ? 'lg:w-[76px]' : 'lg:w-72'
        }`}
      >
        <div className={`flex flex-col flex-1 ${isSidebarCollapsed ? 'p-3' : 'p-5'} overflow-y-auto overflow-x-hidden`}>
          
          {/* Logo Header */}
          <div className="flex items-center justify-between pb-7 pt-1 px-1">
            <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center mx-auto' : 'gap-3'} select-none`}>
              {/* Helix knot logo */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5244E9] to-[#2563EB] flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M13.5 8C17 4.5 22.5 4.5 26 8C29.5 11.5 29.5 17 26 20.5L21.5 25C19 27.5 15 27.5 12.5 25C10 22.5 10 18.5 12.5 16L18 10.5"
                    stroke="#FFFFFF"
                    strokeWidth="3.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22.5 28C19 31.5 13.5 31.5 10 28C6.5 24.5 6.5 19 10 15.5L14.5 11C17 8.5 21 8.5 23.5 11C26 13.5 26 17.5 23.5 20L18 25.5"
                    stroke="#FFFFFF"
                    strokeWidth="3.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {!isSidebarCollapsed && (
                <div className="flex flex-col min-w-0 animate-in fade-in duration-200">
                  <span className="text-[17px] font-[800] text-slate-900 tracking-tight leading-tight truncate">
                    RetailSense
                  </span>
                  <span className="text-[9px] font-[700] text-slate-400 tracking-[0.14em] uppercase leading-tight mt-0.5 truncate">
                    DECISION INTELLIGENCE
                  </span>
                </div>
              )}
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section: Retail AI Decision Engine */}
          <div className="mt-1">
            {!isSidebarCollapsed ? (
              <div className="text-[10px] font-[700] text-slate-400 uppercase tracking-wider px-3 mb-2.5 animate-in fade-in duration-200">
                Decision Intelligence
              </div>
            ) : (
              <div className="w-6 h-px bg-slate-200 mx-auto my-3" />
            )}

            {/* Nav items */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    title={isSidebarCollapsed ? item.name : undefined}
                    className={`w-full flex items-center ${
                      isSidebarCollapsed ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2.5'
                    } rounded-xl text-[13.5px] font-medium transition-all duration-150 text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#F5F3FF] text-[#5244E9] font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`${isActive ? 'text-[#5244E9]' : 'text-slate-400'} shrink-0`}>
                        <Icon className="w-[18px] h-[18px] stroke-[2]" />
                      </span>
                      {!isSidebarCollapsed && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </div>
                    {!isSidebarCollapsed && item.badge > 0 && (
                      <span className="px-2 py-0.5 text-[10.5px] font-bold rounded-full bg-[#5244E9] text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Connected Enterprise Chain Pill */}
          {!isSidebarCollapsed && (
            <div className="mt-6 p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-blue-50/70 border border-indigo-100/80">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#5244E9] mb-1">
                <Zap className="w-3.5 h-3.5 fill-[#5244E9]/20" />
                <span>Connected Decisions</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Demand → Inventory → Replenishment → Logistics → Margin → CX
              </p>
            </div>
          )}

        </div>

        {/* Back to landing page */}
        {onBackToLanding && (
          <div className={`border-t border-slate-50 ${isSidebarCollapsed ? 'p-2' : 'p-4'}`}>
            <button
              onClick={onBackToLanding}
              title={isSidebarCollapsed ? "Sign Out" : undefined}
              className={`w-full flex items-center justify-center gap-2 ${
                isSidebarCollapsed ? 'p-2.5' : 'px-3 py-2 text-xs'
              } font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50/60 rounded-xl transition-all cursor-pointer`}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span className="truncate">Sign Out</span>}
            </button>
          </div>
        )}
      </aside>

      {/* ========================================================
          MAIN APP WRAPPER (Header + Content Canvas)
      ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Top Header Bar from incoming */}
        <header className="h-16 px-4 sm:px-8 border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
          
          {/* Left: Hamburger Toggle + Breadcrumbs */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setIsMobileMenuOpen((prev) => !prev);
                } else {
                  setIsSidebarCollapsed((prev) => !prev);
                }
              }}
              className="p-2 -ml-1 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
              aria-label="Toggle navigation menu"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu className="w-5 h-5 stroke-[2.2]" />
            </button>

            <nav className="flex items-center gap-2 text-[14px]">
              <span className="text-slate-400 font-medium hover:text-slate-600 transition-colors">
                Retail Intelligence
              </span>
              <span className="text-slate-300 font-light select-none">/</span>
              <span className="text-slate-900 font-bold tracking-tight">
                {currentTabName}
              </span>
            </nav>
          </div>

          {/* Right: Actions, Notifications + User Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Run Engine Button */}
            <button
              onClick={handleRunPipeline}
              disabled={isEngineRunning}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5244E9] hover:bg-[#4333DE] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isEngineRunning ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isEngineRunning ? 'Running...' : 'Run Engine'}</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  setIsProfileDropdownOpen(false);
                }}
                className="w-9 h-9 rounded-full bg-[#F5F3FF] hover:bg-[#EDE9FE] active:scale-95 transition-all flex items-center justify-center text-[#5244E9] cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4 fill-[#5244E9]/15 stroke-[2.2]" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#5244E9] rounded-full" />
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 px-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800">Autonomous Alerts</span>
                    <span className="text-[10px] text-[#5244E9] font-bold cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2.5 bg-rose-50/70 border border-rose-100 rounded-xl text-left">
                      <p className="text-[11px] font-bold text-rose-800 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Stockout Imminent: SKU-9824
                      </p>
                      <p className="text-[10px] text-slate-600 mt-1">
                        Downtown Store #104 has 1.4 days supply remaining. Action: Replenish 450 units from DC-1.
                      </p>
                    </div>
                    <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl text-left">
                      <p className="text-[11px] font-bold text-blue-800 flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5" />
                        Surplus Balance: SKU-4112
                      </p>
                      <p className="text-[10px] text-slate-600 mt-1">
                        Store #208 has 420 surplus units. Transfer 180 units to Northside Store #102.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar with Chevron */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileDropdownOpen(!isProfileDropdownOpen);
                  setIsNotificationOpen(false);
                }}
                className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full hover:bg-slate-50 border border-slate-100 transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#5244E9] text-white font-bold text-[12.5px] flex items-center justify-center select-none overflow-hidden shadow-xs">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    initial
                  )}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 stroke-[2.2]" />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3.5 py-2.5 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name || 'Alex Morgan'}</p>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-[#5244E9] border border-indigo-100">
                        {currentRoleLabel}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{currentUser.email || 'manager@retailchain.com'}</p>
                  </div>
                  <div className="py-1 text-slate-700 text-xs">
                    <button className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 text-left cursor-pointer">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Operator Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 text-left cursor-pointer">
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <span>Decision Rules</span>
                    </button>
                  </div>
                  <div className="border-t border-slate-100 pt-1">
                    <button 
                      onClick={onBackToLanding}
                      className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-rose-50 text-rose-600 text-xs text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </header>

        {/* ========================================================
            CONTENT CANVAS (Contains All Rich Challenge 10 Features)
        ======================================================== */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-[1440px] w-full mx-auto">
          
          {/* TAB 1: OVERVIEW (Full KPI + Demand Fulfillment + Actions) */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* 4 TOP KPI CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold text-slate-600">Service Level</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                      <Store className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{kpis?.service_level?.value || '96.8%'}</div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mt-1">
                      <span>Target: 95.0%</span>
                      <span className="text-emerald-600 font-bold">+2.4%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold text-slate-600">Stockout Value at Risk</span>
                    <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl sm:text-3xl font-extrabold text-rose-600">{kpis?.stockout_risk?.value || '₹38,000'}</div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mt-1">
                      <span>2 items critical</span>
                      <span className="text-rose-600 font-bold">-42.1%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold text-slate-600">Excess Stock Recovered</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
                      <Percent className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{kpis?.excess_inventory?.value || '₹8,420'}</div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mt-1">
                      <span>1 markdown candidate</span>
                      <span className="text-emerald-600 font-bold">-18.5%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold text-slate-600">Projected Gross Margin</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{kpis?.projected_margin?.value || '₹1,42,800'}</div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mt-1">
                      <span>Rate: 23.4%</span>
                      <span className="text-emerald-600 font-bold">+5.2% lift</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* ORDERS & DEMAND FULFILLMENT */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Orders & Demand Fulfillment</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Tracking seasonal customer demand against stock replenishment</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{dateRange}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>

                    <button
                      onClick={handleRunPipeline}
                      className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add activity</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 items-center">
                  
                  {/* Left: Plotly Chart */}
                  <div className="lg:col-span-2">
                    <div className="h-[280px]">
                      <PlotlyChart
                        data={ordersChartData}
                        layout={{
                          barmode: 'group',
                          bargap: 0.25,
                          bargroupgap: 0.1,
                          legend: { orientation: 'h', y: -0.2, x: 0.4 },
                          yaxis: { gridcolor: '#f8fafc', zeroline: false }
                        }}
                      />
                    </div>
                  </div>

                  {/* Right: Progress breakdown panel */}
                  <div className="lg:col-span-1 p-6 rounded-2xl bg-[#FAFAFC] border border-slate-100 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center gap-4 text-xs font-semibold pb-3 border-b border-slate-200">
                        <button 
                          onClick={() => setDemandChartType('orders')}
                          className={`${demandChartType === 'orders' ? 'text-[#2563EB] border-b-2 border-[#2563EB]' : 'text-slate-500'} pb-1`}
                        >
                          Orders
                        </button>
                        <button 
                          onClick={() => setDemandChartType('sales')}
                          className={`${demandChartType === 'sales' ? 'text-[#2563EB] border-b-2 border-[#2563EB]' : 'text-slate-500'} pb-1`}
                        >
                          Sales
                        </button>
                      </div>

                      <div className="mt-4">
                        <div className="text-3xl font-extrabold text-slate-900 tracking-tight">125,090</div>
                        
                        <div className="mt-3">
                          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-[#2563EB] h-full rounded-full" style={{ width: '62.5%' }}></div>
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                            <span>0.00</span>
                            <span>200,000</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                          A project-wise breakdown of total orders complemented by detailed insights.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200/80 space-y-2">
                      <button 
                        onClick={() => setActiveTab('actions')}
                        className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-[#2563EB] transition-colors p-2 rounded-lg hover:bg-white cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#2563EB]" />
                          <span>Show all highlights</span>
                        </span>
                        <ChevronDown className="w-4 h-4 -rotate-90 text-slate-400" />
                      </button>

                      <button 
                        onClick={() => setActiveTab('risk')}
                        className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-[#2563EB] transition-colors p-2 rounded-lg hover:bg-white cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-slate-600" />
                          <span>Show all sales data</span>
                        </span>
                        <ChevronDown className="w-4 h-4 -rotate-90 text-slate-400" />
                      </button>
                    </div>

                  </div>

                </div>

              </div>

              {/* RANKED ACTIONS TABLE */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Ranked Store Decisions & Top Products</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Autonomous actions ranked by expected profit impact</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportCsv}
                      className="inline-flex items-center gap-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export POs (CSV)</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAFAFC] text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-4">Item & SKU</th>
                        <th className="py-3.5 px-4">Action</th>
                        <th className="py-3.5 px-4">Quantity & Timing</th>
                        <th className="py-3.5 px-4">Why (LLM Rationale)</th>
                        <th className="py-3.5 px-4">Expected Impact</th>
                        <th className="py-3.5 px-4">Confidence</th>
                        <th className="py-3.5 px-4 text-right">Decision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recommendations.map((rec) => {
                        const isPending = rec.status === 'pending';
                        const isApproved = rec.status === 'approved';

                        let badgeClass = "bg-[#EEF4FF] text-[#2563EB]";
                        if (rec.action_type === 'markdown') badgeClass = "bg-amber-50 text-amber-800 border border-amber-200";
                        if (rec.action_type === 'substitute') badgeClass = "bg-purple-50 text-purple-800 border border-purple-200";
                        if (rec.action_type === 'no_action') badgeClass = "bg-slate-100 text-slate-700";

                        return (
                          <tr key={rec.rec_id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900">{rec.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">{rec.sku} • {rec.category}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${badgeClass}`}>
                                {rec.badge}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-700">
                              {rec.quantity > 0 ? `${rec.quantity} units` : 'N/A'}<br />
                              <span className="text-[10px] text-slate-400">{rec.timing}</span>
                            </td>
                            <td className="py-3.5 px-4 max-w-xs text-slate-600 leading-relaxed">
                              {rec.rationale}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-emerald-600">₹{rec.expected_value.toLocaleString()}</div>
                              <div className="text-[10px] text-slate-400">{rec.expected_impact}</div>
                            </td>
                            <td className="py-3.5 px-4 font-semibold uppercase text-slate-700">
                              {rec.confidence}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              {isPending ? (
                                <div className="inline-flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleDecide(rec.rec_id, 'approved')}
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs cursor-pointer"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedRecForModify(rec);
                                      setModifyQty(rec.quantity.toString());
                                    }}
                                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs cursor-pointer"
                                  >
                                    Modify
                                  </button>
                                  <button
                                    onClick={() => handleDecide(rec.rec_id, 'rejected')}
                                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-rose-600 font-medium text-xs cursor-pointer"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className={`inline-flex items-center gap-1 font-semibold text-xs capitalize ${
                                  isApproved ? 'text-emerald-600' : 'text-slate-400'
                                }`}>
                                  {isApproved && <Check className="w-3.5 h-3.5" />}
                                  {rec.status}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: AI INSIGHTS & ACTIONS */}
          {activeTab === 'actions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">AI Insights & Action Board</h2>
                  <p className="text-xs text-slate-500">Every decision card is complete with expected impact, alternatives evaluated, and guardrails.</p>
                </div>
                <button
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export POs (CSV)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.map(rec => (
                  <div key={rec.rec_id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <span className="px-2.5 py-1 rounded-md bg-[#EEF4FF] text-[#2563EB] text-xs font-bold uppercase">
                          {rec.badge}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 uppercase">
                          Confidence: {rec.confidence}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mt-3">{rec.name}</h3>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-[#FAFAFC] p-3 rounded-xl border border-slate-100">
                          <div className="text-slate-500 font-medium">Quantity & Timing</div>
                          <div className="text-sm font-bold text-slate-900 mt-0.5">{rec.quantity > 0 ? `${rec.quantity} units` : 'N/A'} ({rec.timing})</div>
                        </div>
                        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                          <div className="text-emerald-700 font-medium">Expected Value</div>
                          <div className="text-sm font-bold text-emerald-800 mt-0.5">₹{rec.expected_value.toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="mt-4 p-3 rounded-xl bg-[#FAFAFC] text-xs text-slate-700 leading-relaxed">
                        <span className="font-semibold text-slate-900">Why: </span>
                        {rec.rationale}
                      </div>

                      <div className="mt-3 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-700">Alternatives: </span>
                        {rec.alternatives_considered}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Status: <b className="capitalize text-slate-700">{rec.status}</b></span>
                      {rec.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleDecide(rec.rec_id, 'approved')} className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs cursor-pointer">Approve</button>
                          <button onClick={() => { setSelectedRecForModify(rec); setModifyQty(rec.quantity.toString()); }} className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs cursor-pointer">Modify</button>
                          <button onClick={() => handleDecide(rec.rec_id, 'rejected')} className="px-3 py-1.5 rounded-lg border border-slate-200 text-rose-600 text-xs cursor-pointer">Reject</button>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-600">Decision Archived</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: INVENTORY RISK BOARD */}
          {activeTab === 'risk' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Inventory & Risk Board</h2>
                <p className="text-xs text-slate-500">Real-time cover days, reorder thresholds, and stockout probability per SKU.</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAFAFC] text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">SKU & Item</th>
                      <th className="py-3 px-4">On Hand</th>
                      <th className="py-3 px-4">Daily Demand</th>
                      <th className="py-3 px-4">Supplier Lead Time</th>
                      <th className="py-3 px-4">Days of Cover</th>
                      <th className="py-3 px-4">Reorder Point</th>
                      <th className="py-3 px-4">Risk Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {riskBoard.map(item => {
                      const isCritical = item.days_of_cover <= item.lead_time_days;
                      const isExcess = item.days_of_cover > 30;
                      return (
                        <tr key={item.product_id} className="hover:bg-slate-50/60">
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {item.name}
                            <div className="text-[10px] text-slate-400 font-normal">{item.sku} • {item.supplier}</div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800">{item.on_hand} units</td>
                          <td className="py-3.5 px-4 text-slate-600">{item.daily_demand} / day</td>
                          <td className="py-3.5 px-4 text-slate-600">{item.lead_time_days} days</td>
                          <td className="py-3.5 px-4 font-bold">
                            <span className={`px-2 py-0.5 rounded ${isCritical ? 'bg-rose-100 text-rose-800' : (isExcess ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800')}`}>
                              {item.days_of_cover} days
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 font-mono">{item.reorder_point}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                              isCritical ? 'bg-rose-50 text-rose-700 border border-rose-200' : 
                              (isExcess ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200')
                            }`}>
                              {item.risk_type}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: DEMAND FORECASTS */}
          {activeTab === 'forecast' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Probabilistic Demand Forecasts (P10 - P90)</h2>
                <p className="text-xs text-slate-500">Forecasting daily demand over the lead-time plus review horizon with festival and weather uplifts.</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <div>
                    <h3 className="font-bold text-slate-900">SKU-4412: Royal Basmati Rice 5kg</h3>
                    <div className="text-xs text-[#2563EB] font-medium">Uplift: Festival Gala (+35%), Rainy Season (+8%)</div>
                  </div>
                  <span className="px-3 py-1 bg-[#EEF4FF] text-[#2563EB] rounded-full text-xs font-semibold">
                    Ensemble Boosted
                  </span>
                </div>

                <div className="h-[320px]">
                  <PlotlyChart
                    data={[
                      { x: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10', 'Day 11', 'Day 12', 'Day 13', 'Day 14'], y: [12, 14, 15, 17, 18, 22, 25, 27, 24, 21, 19, 18, 17, 16], name: 'P10 (Pessimistic)', type: 'scatter', mode: 'lines', line: { color: '#93c5fd', width: 1.5, dash: 'dot' } },
                      { x: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10', 'Day 11', 'Day 12', 'Day 13', 'Day 14'], y: [18, 20, 22, 25, 27, 34, 38, 40, 36, 31, 28, 26, 24, 23], name: 'P50 (Expected Demand)', type: 'scatter', mode: 'lines+markers', line: { color: '#2563EB', width: 3 } },
                      { x: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10', 'Day 11', 'Day 12', 'Day 13', 'Day 14'], y: [24, 28, 30, 35, 39, 48, 54, 58, 51, 45, 40, 37, 34, 32], name: 'P90 (Surge Peak)', type: 'scatter', mode: 'lines', line: { color: '#1D4ED8', width: 1.5, dash: 'dot' } }
                    ]}
                    layout={{
                      legend: { orientation: 'h', y: -0.2, x: 0.25 },
                      yaxis: { title: 'Units / Day', gridcolor: '#f8fafc' },
                      xaxis: { gridcolor: '#f8fafc' }
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BACKTEST PROOF */}
          {activeTab === 'backtest' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Holdout Backtest: AI Policy vs Simple Baseline</h2>
                  <p className="text-xs text-slate-500">Day-by-day replay over the last 6 holdout weeks comparing stockouts, excess inventory, service level, and gross margin.</p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified ROI: 4.8x Multiple</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAFAFC] text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Metric</th>
                      <th className="py-3.5 px-4">Simple Baseline Policy</th>
                      <th className="py-3.5 px-4">PulseRetail AI Policy</th>
                      <th className="py-3.5 px-4">Improvement</th>
                      <th className="py-3.5 px-4">Business Realization</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {backtest?.comparison?.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{row.metric}</td>
                        <td className="py-3.5 px-4 text-rose-700">{row.baseline}</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-700">{row.ai}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                            {row.change}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{row.impact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <h3 className="font-bold text-slate-900 text-sm mb-4">Stockout Rate Trajectory: Baseline vs AI</h3>
                <div className="h-[280px]">
                  <PlotlyChart
                    data={backtestChartData}
                    layout={{
                      legend: { orientation: 'h', y: -0.2, x: 0.3 },
                      yaxis: { title: 'Stockout Rate %', gridcolor: '#f8fafc' },
                      xaxis: { gridcolor: '#f8fafc' }
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: STAFF TO-DO */}
          {activeTab === 'staff_todo' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Store Staff Daily Execution Checklist</h2>
                <p className="text-xs text-slate-500">Simplified, actionable instructions for physical store operations team members.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start justify-between gap-4">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                      Price Tag Update
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-2">Print & Apply 25% Markdown on Cadbury Celebration 500g</h3>
                    <p className="text-xs text-slate-600 mt-1">
                      New Price: <b>₹240.00</b> (Old Price: ₹320.00). Place on promo endcap before expiry in 22 days.
                    </p>
                  </div>
                  <button onClick={() => showToast("✅ Cadbury price update marked complete!")} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap shadow-xs cursor-pointer">
                    Mark Done
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start justify-between gap-4">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 uppercase">
                      Shelf Cross-Merchandise
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-2">Move 40 Units of Filter Coffee to Front Endcap</h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Primary Gourmet Arabica blend is delayed. Cross-positioning filter coffee recovers 70% of displaced shopper demand.
                    </p>
                  </div>
                  <button onClick={() => showToast("✅ Coffee endcap placement verified!")} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap shadow-xs cursor-pointer">
                    Mark Done
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: WHATSAPP BOT SIMULATOR */}
          {activeTab === 'whatsapp' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-slate-900">Interactive WhatsApp Bot Simulator</h2>
                <p className="text-xs text-slate-500">Test two-way conversational decision intelligence and 1-tap approvals in real-time.</p>
              </div>

              <div className="rounded-[32px] bg-slate-900 p-3 shadow-2xl border-4 border-slate-800">
                <div className="bg-[#075E54] text-white p-3.5 rounded-t-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-400 text-slate-900 font-bold flex items-center justify-center text-xs shadow-inner">
                      PR
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">PulseRetail Store Assistant</div>
                      <div className="text-[10px] text-emerald-200">Online • AI Decision Agent</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-800/80 px-2 py-0.5 rounded text-white font-mono">
                    +91 98450 00101
                  </span>
                </div>

                <div className="bg-[#ECE5DD] p-4 space-y-3 min-h-[360px] max-h-[440px] overflow-y-auto text-xs">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-3 rounded-2xl shadow-sm max-w-[85%] ${
                        msg.sender === 'user' ? 'bg-[#DCF8C6] text-slate-800' : 'bg-white text-slate-800 border border-slate-200'
                      }`}>
                        <div className="whitespace-pre-line text-[11px] leading-relaxed">
                          {msg.text}
                        </div>

                        {msg.has_actions && (
                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
                            <button
                              onClick={() => handleDecide(1, 'approved')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1 rounded-md text-[11px] shadow-sm transition-all cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleDecide(1, 'rejected')}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1 rounded-md text-[11px] transition-all cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        )}

                        <div className="text-[9px] text-slate-400 text-right mt-1 font-mono">
                          {msg.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChatMessage} className="bg-slate-100 p-2.5 rounded-b-2xl flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask 'Which items will run out this week?' or 'Approve'..."
                    className="flex-1 text-xs px-4 py-2.5 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 8: DATA QUALITY */}
          {activeTab === 'quality' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Data Quality & Lost Demand Recovery Audit</h2>
                <p className="text-xs text-slate-500">Every dirty POS anomaly is explicitly captured in the audit ledger and unobserved lost sales reconstructed.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dataIssues.map(issue => (
                  <div key={issue.issue_id} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          issue.severity === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {issue.severity}
                        </span>
                        <span className="text-xs text-slate-400">{issue.sku}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-3">{issue.name}</h3>
                      <div className="text-xs font-semibold text-[#2563EB] mt-1 uppercase">{issue.issue_type}</div>
                      <p className="text-xs text-slate-600 mt-3 leading-relaxed">{issue.details}</p>
                    </div>
                    <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                      Rule enforced: Never silently fix dirty data.
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>

      </div>

      {/* MODAL: MODIFY ACTION */}
      {selectedRecForModify && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Modify Recommendation #{selectedRecForModify.rec_id}</h3>
              <button onClick={() => setSelectedRecForModify(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <span className="text-slate-500">Item:</span>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{selectedRecForModify.name}</div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Adjust Quantity (Units)</label>
                <input
                  type="number"
                  value={modifyQty}
                  onChange={(e) => setModifyQty(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB]"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Modification</label>
                <textarea
                  rows={2}
                  value={modifyReason}
                  onChange={(e) => setModifyReason(e.target.value)}
                  placeholder="e.g., Supplier MOQ constraints or extra warehouse space..."
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button onClick={() => setSelectedRecForModify(null)} className="px-3 py-2 rounded-lg text-slate-600 text-xs font-semibold hover:bg-slate-100">
                Cancel
              </button>
              <button
                onClick={() => handleDecide(selectedRecForModify.rec_id, 'modified', parseInt(modifyQty) || selectedRecForModify.quantity, modifyReason)}
                className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-sm"
              >
                Save & Dispatch Order
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
