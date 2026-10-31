import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BarChart3, 
  Bell, 
  ChevronDown, 
  Menu, 
  X, 
  LogOut, 
  Settings, 
  User, 
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  ExternalLink,
  Zap,
  TrendingUp,
  Boxes,
  Truck,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Percent,
  Clock,
  Filter
} from 'lucide-react';

export default function Dashboard({ 
  currentUser = { name: 'Rithish', email: 'rithish@retailcorp.com', role: 'store_manager' }, 
  onBackToLanding 
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('prescriptions');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Retail Decisions State
  const [decisions, setDecisions] = useState([]);
  const [baselineData, setBaselineData] = useState(null);
  const [selectedActionFilter, setSelectedActionFilter] = useState('all');
  const [selectedStoreFilter, setSelectedStoreFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDecisionDetail, setSelectedDecisionDetail] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [executingId, setExecutingId] = useState(null);

  const roleLabels = {
    store_manager: 'Store Manager',
    supply_chain: 'Supply Chain Lead',
    executive: 'Category Executive',
  };

  const currentRoleLabel = roleLabels[currentUser.role] || currentUser.role || 'Retail Operations';
  const initial = (currentUser.name || 'R').charAt(0).toUpperCase();

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdowns on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsProfileDropdownOpen(false);
        setIsNotificationOpen(false);
        setSelectedDecisionDetail(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch Decisions & Baseline from Backend with Instant Local Fallback
  useEffect(() => {
    const fetchDecisionsData = async () => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/v1';
      try {
        const [resDecisions, resBaseline] = await Promise.all([
          fetch(`${apiUrl}/decisions`),
          fetch(`${apiUrl}/decisions/baseline-comparison`)
        ]);

        if (resDecisions.ok) {
          const data = await resDecisions.json();
          setDecisions(data);
        }
        if (resBaseline.ok) {
          const baseline = await resBaseline.json();
          setBaselineData(baseline);
        }
      } catch (err) {
        console.warn('Backend note (using local demo dataset):', err);
        // Fallback local rich data
        setDecisions([
          {
            id: "DEC-8091",
            sku_id: "SKU-9824",
            sku_name: "Organic Silk Almond Milk 64oz",
            category: "Chilled Dairy & Plant-Based",
            store_id: "STR-104",
            store_name: "Store #104 Downtown Hub",
            channel: "Physical Retail (Express)",
            recommended_action: "replenish",
            urgency: "Critical Risk",
            rationale: "Demand velocity spiked +34% due to local 10K marathon this weekend. Current inventory (28 units, 1.4 days of supply) will stock out in 36 hours. Supplier lead time is 5 days. Expediting 450 units from Regional DC-1 immediately guarantees 100% shelf availability.",
            expected_impact: "Protects $3,850 in weekend revenue; prevents 180 projected customer stockout walkaways.",
            signals: {
              sales_velocity: "+34% surge (82 units/day)",
              inventory_on_hand: 28,
              days_of_supply: 1.4,
              supplier_lead_time_days: 5,
              active_promotion: "None",
              unit_price: 4.89,
              weather_condition: "Sunny & Warm (+12°F above avg)",
              competitor_price: 4.99,
              local_event: "Downtown Metro Marathon"
            },
            chain_impact: {
              demand: "Surge +34% via weekend outdoor footfall",
              inventory: "Depletes to 0 within 36h if no action",
              replenishment: "Expedited truck delivery from DC-1 (ETA 14h)",
              logistics: "Consolidated with Route #12 morning run",
              margin: "Gross margin preserved at 38.2%",
              customer_experience: "Zero shelf stockouts during peak event"
            },
            status: "pending",
            confidence_score: 0.984
          },
          {
            id: "DEC-8092",
            sku_id: "SKU-4112",
            sku_name: "Tide Pods Spring Meadow 42ct",
            category: "Household Essentials",
            store_id: "STR-208",
            store_name: "Store #208 Westside Suburb",
            channel: "Omnichannel Supercenter",
            recommended_action: "transfer inventory",
            urgency: "High",
            rationale: "Store #208 has 420 surplus units (62 days of supply) while adjacent Northside Store #102 is experiencing stockout risk (12 units, 2 days supply). Intra-district cross-dock transfer of 180 units balances service levels without incurring new manufacturer purchase orders.",
            expected_impact: "Averts stockout at Store #102; cuts $4,200 tied-up working capital in Westside storage.",
            signals: {
              sales_velocity: "-8% steady (6 units/day)",
              inventory_on_hand: 420,
              days_of_supply: 62.0,
              supplier_lead_time_days: 7,
              active_promotion: "None",
              unit_price: 14.99,
              weather_condition: "Normal",
              competitor_price: 15.29,
              local_event: null
            },
            chain_impact: {
              demand: "Balanced across Northside & Westside zones",
              inventory: "Reduces holding cost by 42% at Store #208",
              replenishment: "Zero external PO required",
              logistics: "Low-cost van transfer ($45 transit cost)",
              margin: "Maintains full retail margin (no clearance needed)",
              customer_experience: "Restores 99% in-stock rate across both stores"
            },
            status: "pending",
            confidence_score: 0.965
          },
          {
            id: "DEC-8093",
            sku_id: "SKU-2041",
            sku_name: "Chobani Greek Vanilla Yogurt 32oz",
            category: "Chilled Dairy",
            store_id: "STR-310",
            store_name: "Store #310 Metro Plaza",
            channel: "Physical Retail",
            recommended_action: "markdown",
            urgency: "Critical Risk",
            rationale: "Inventory of 185 units expires in 4 days (Sell-by Nov 4). Current sales run-rate will leave 110 units unsold as perishable write-off. Triggering an automated 30% digital/shelf markdown ($5.99 → $4.19) clears 94% of stock before expiration.",
            expected_impact: "Recovers $775 in gross cash flow; reduces perishable landfill waste by 92%.",
            signals: {
              sales_velocity: "-14% sluggish (18 units/day)",
              inventory_on_hand: 185,
              days_of_supply: 10.2,
              supplier_lead_time_days: 3,
              active_promotion: "Expiring Batch Alert",
              unit_price: 5.99,
              weather_condition: "Overcast",
              competitor_price: 5.79,
              local_event: null
            },
            chain_impact: {
              demand: "Price elasticity lift expected at +68%",
              inventory: "Clears expiring lot to 8 units prior to cut-off",
              replenishment: "Next fresh batch order shifted by 2 days",
              logistics: "Local shelf re-tagging & mobile app push",
              margin: "Recovers 70% cost basis vs 0% total write-off",
              customer_experience: "Value-seeking shoppers rewarded; fresh image kept"
            },
            status: "pending",
            confidence_score: 0.978
          },
          {
            id: "DEC-8094",
            sku_id: "SKU-6520",
            sku_name: "Sparkling Ice Black Raspberry 17oz",
            category: "Beverages & Refreshment",
            store_id: "STR-104",
            store_name: "Store #104 Downtown Hub",
            channel: "Express Grab & Go",
            recommended_action: "increase allocation",
            urgency: "High",
            rationale: "Unseasonably high temperature (+14°F above norm) and promotional flyer feature is driving 2.6x demand lift. Central warehouse allocation should be increased from standard 30 cases to 85 cases for the next replenishment cycle.",
            expected_impact: "Captures $2,840 incremental margin; prevents peak-hour afternoon cooler stockout.",
            signals: {
              sales_velocity: "+160% extreme spike (140 units/day)",
              inventory_on_hand: 95,
              days_of_supply: 0.7,
              supplier_lead_time_days: 4,
              active_promotion: "Buy 2 Get 1 Free flyer",
              unit_price: 1.49,
              weather_condition: "Heatwave (88°F)",
              competitor_price: 1.59,
              local_event: "Street Food Carnival"
            },
            chain_impact: {
              demand: "Surging beverage impulse buys",
              inventory: "Cooler doors clearing 4x faster than usual",
              replenishment: "Priority allocation at Central DC slotting",
              logistics: "Direct store delivery wave scheduled 06:00",
              margin: "Strong unit velocity yields +$1,120 profit",
              customer_experience: "Ice-cold drinks ready on shelves"
            },
            status: "pending",
            confidence_score: 0.991
          },
          {
            id: "DEC-8095",
            sku_id: "SKU-7731",
            sku_name: "Barilla Penne Rigate Pasta 16oz",
            category: "Dry Grocery & Pantry",
            store_id: "STR-502",
            store_name: "Store #502 Eastgate Center",
            channel: "Omnichannel",
            recommended_action: "adjust promotion",
            urgency: "Moderate",
            rationale: "Primary supplier lead time delayed by 11 days due to rail transit maintenance. A planned 25% off promotional campaign will trigger a catastrophic stockout within 48 hours. Recommend pausing promo banner and shifting feature to De Cecco pasta to protect fulfillment.",
            expected_impact: "Prevents 340 backorders; protects 98.4% omni-channel order fill rate.",
            signals: {
              sales_velocity: "+45% promo anticipation",
              inventory_on_hand: 140,
              days_of_supply: 3.1,
              supplier_lead_time_days: 18,
              active_promotion: "Planned 25% Weekly Feature",
              unit_price: 1.89,
              weather_condition: "Normal",
              competitor_price: 1.79,
              local_event: null
            },
            chain_impact: {
              demand: "Pacing demand to match delayed supplier arrival",
              inventory: "Stretches remaining inventory until new restock",
              replenishment: "PO #4928 expedited via alternative trucking",
              logistics: "Prevents backlogged store receiving docks",
              margin: "Protects full price margin while supply is constrained",
              customer_experience: "Eliminates cancelled online grocery orders"
            },
            status: "pending",
            confidence_score: 0.952
          },
          {
            id: "DEC-8096",
            sku_id: "SKU-3319",
            sku_name: "Oatly Barista Edition Oat Milk 32oz",
            category: "Chilled Dairy & Plant-Based",
            store_id: "STR-104",
            store_name: "Store #104 Downtown Hub",
            channel: "Coffee Bar & Retail",
            recommended_action: "substitute product",
            urgency: "High",
            rationale: "Oatly distributor is currently experiencing an OEM packaging stockout across regional distribution. Recommend activating automated customer substitution rule on shelf and e-commerce cart: offer Califia Farms Barista Blend with zero price penalty.",
            expected_impact: "Retains 92% of barista-grade plant milk sales; zero lost basket conversions.",
            signals: {
              sales_velocity: "Stockout (0 units on hand)",
              inventory_on_hand: 0,
              days_of_supply: 0.0,
              supplier_lead_time_days: 14,
              active_promotion: "None",
              unit_price: 5.49,
              weather_condition: "Normal",
              competitor_price: 5.49,
              local_event: null
            },
            chain_impact: {
              demand: "Redirected to Califia Farms Barista (+48 units/day)",
              inventory: "Califia on-hand at 140 units (healthy 8 days)",
              replenishment: "Califia supplier order boosted by 30%",
              logistics: "Seamless shelf sticker re-slotting",
              margin: "Neutral margin parity ($2.10 gross/unit)",
              customer_experience: "Shopper finds suitable premium alternative"
            },
            status: "pending",
            confidence_score: 0.971
          },
          {
            id: "DEC-8097",
            sku_id: "SKU-1088",
            sku_name: "Heinz Tomato Ketchup 32oz",
            category: "Condiments & Sauces",
            store_id: "STR-208",
            store_name: "Store #208 Westside Suburb",
            channel: "Physical Retail",
            recommended_action: "take no action",
            urgency: "Optimal",
            rationale: "Current stock is 94 units (16.2 days of supply). Weekly demand velocity is stable (5.8 units/day). Supplier lead time is reliable at 3 days. Price point is competitive with regional market. No intervention needed; baseline replenishment pipeline is healthy.",
            expected_impact: "Avoids unnecessary logistic overhead and labor churn; preserves stable supply.",
            signals: {
              sales_velocity: "Stable (5.8 units/day)",
              inventory_on_hand: 94,
              days_of_supply: 16.2,
              supplier_lead_time_days: 3,
              active_promotion: "None",
              unit_price: 3.99,
              weather_condition: "Normal",
              competitor_price: 4.19,
              local_event: null
            },
            chain_impact: {
              demand: "Steady predictable baseline",
              inventory: "Within optimal safety stock band (14-21 days)",
              replenishment: "Standard automated reorder trigger in 8 days",
              logistics: "No special routing required",
              margin: "Consistent 34% margin",
              customer_experience: "Consistent product availability"
            },
            status: "pending",
            confidence_score: 0.995
          }
        ]);
        setBaselineData({
          summary: "Compared against standard legacy statistical forecasting baseline (ARIMA / Moving Average + Static Min-Max Reorder Points), the RetailSense Agentic AI system optimizes end-to-end connected decisions across 5 critical enterprise dimensions.",
          metrics: [
            {
              metric_name: "Stockout Rate",
              baseline_value: "14.8%",
              ai_value: "2.1%",
              improvement: "-85.8% (Stockouts averted)",
              description: "AI connects real-time sales spikes with supplier lead times and weather to order before shelf empty."
            },
            {
              metric_name: "Excess Inventory Tied Capital",
              baseline_value: "$480,000",
              ai_value: "$140,000",
              improvement: "-70.8% ($340K cash freed)",
              description: "Intra-store transfers and dynamic markdown rules eliminate dormant warehouse deadstock."
            },
            {
              metric_name: "Customer Service Level (In-Stock %)",
              baseline_value: "91.2%",
              ai_value: "98.6%",
              improvement: "+7.4 percentage points",
              description: "Consistent cross-channel product availability keeps shoppers loyal and prevents basket abandonment."
            },
            {
              metric_name: "Gross Profit Margin",
              baseline_value: "26.4%",
              ai_value: "31.8%",
              improvement: "+5.4 percentage points",
              description: "Protects full-price sell-through and reduces deep emergency fire-sale write-downs."
            },
            {
              metric_name: "Decision Accuracy vs Actual Need",
              baseline_value: "68.5%",
              ai_value: "98.2%",
              improvement: "+29.7 percentage points",
              description: "Agentic multi-signal reasoning prevents bullwhip distortion across upstream supply chains."
            }
          ],
          total_stockouts_averted: 3420,
          excess_inventory_savings_usd: 340000.0,
          margin_expansion_pts: 5.4
        });
      }
    };

    fetchDecisionsData();
  }, []);

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen((prev) => !prev);
    } else {
      setIsSidebarCollapsed((prev) => !prev);
    }
  };

  const handleExecuteAction = async (decision) => {
    setExecutingId(decision.id);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/v1';

    try {
      await fetch(`${apiUrl}/decisions/${decision.id}/execute`, { method: 'POST' });
    } catch (err) {
      console.warn('Backend execute fallback:', err);
    }

    // Optimistic local state update
    setDecisions((prev) =>
      prev.map((d) => (d.id === decision.id ? { ...d, status: 'executed' } : d))
    );

    const actionVerb = decision.recommended_action === 'replenish'
      ? 'Replenishment order dispatched'
      : decision.recommended_action === 'transfer inventory'
      ? 'Intra-store transfer order routed'
      : decision.recommended_action === 'markdown'
      ? 'Digital shelf markdown scheduled'
      : `${decision.recommended_action.toUpperCase()} action executed`;

    setToastMessage(`✓ ${actionVerb} for ${decision.sku_name} at ${decision.store_name}.`);
    setExecutingId(null);

    setTimeout(() => {
      setToastMessage('');
    }, 4500);
  };

  const navItems = [
    {
      id: 'prescriptions',
      name: 'Prescribed Decisions',
      icon: Sparkles,
      count: decisions.filter(d => d.status === 'pending').length
    },
    {
      id: 'signals',
      name: 'Signals & Telemetry',
      icon: Activity,
    },
    {
      id: 'flow',
      name: 'Agentic Flow (Observe→Measure)',
      icon: Layers,
    },
    {
      id: 'baseline',
      name: 'AI vs Baseline ROI',
      icon: TrendingUp,
    },
  ];

  const currentTabName = navItems.find((item) => item.id === activeTab)?.name || 'Prescribed Decisions';

  // Action badge color styling
  const getActionBadgeClass = (action) => {
    switch (action.toLowerCase()) {
      case 'replenish':
        return 'bg-indigo-50 text-[#5244E9] border-indigo-200/80';
      case 'transfer inventory':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'increase allocation':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'markdown':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'adjust promotion':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      case 'substitute product':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200/80';
      case 'take no action':
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200/80';
    }
  };

  const getUrgencyBadge = (urgency) => {
    if (urgency === 'Critical Risk') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          Critical Risk
        </span>
      );
    }
    if (urgency === 'High') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          High Priority
        </span>
      );
    }
    if (urgency === 'Moderate') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
          Moderate
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        Optimal State
      </span>
    );
  };

  // Filtered decisions list
  const filteredDecisions = decisions.filter((d) => {
    const matchesAction = selectedActionFilter === 'all' || d.recommended_action.toLowerCase() === selectedActionFilter.toLowerCase();
    const matchesStore = selectedStoreFilter === 'all' || d.store_id.toLowerCase() === selectedStoreFilter.toLowerCase();
    const matchesSearch = !searchQuery || 
      d.sku_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.sku_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.store_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAction && matchesStore && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FDFDFE] flex flex-col lg:flex-row font-sans text-slate-800 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-medium leading-relaxed">{toastMessage}</p>
          <button onClick={() => setToastMessage('')} className="text-slate-400 hover:text-white ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 ease-in-out"
          aria-hidden="true"
        />
      )}

      {/* ========================================================
          SIDEBAR NAVIGATION (Collapsible on Desktop & Drawer on Mobile)
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
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
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
                    } rounded-xl text-[13.5px] font-medium transition-all duration-150 text-left ${
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
                    {!isSidebarCollapsed && item.count !== undefined && item.count > 0 && (
                      <span className="px-2 py-0.5 text-[10.5px] font-bold rounded-full bg-[#5244E9] text-white">
                        {item.count}
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
        
        {/* Top Header Bar */}
        <header className="h-16 px-4 sm:px-8 border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
          
          {/* Left: Hamburger Toggle + Breadcrumbs */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            <button
              onClick={handleToggleSidebar}
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

          {/* Right: Notifications + User Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
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
                      <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-[#5244E9] border border-indigo-100">
                        {currentRoleLabel}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{currentUser.email}</p>
                  </div>
                  <div className="py-1 text-slate-700 text-xs">
                    <button className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 text-left">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Operator Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 text-left">
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <span>Decision Rules</span>
                    </button>
                  </div>
                  <div className="border-t border-slate-100 pt-1">
                    <button 
                      onClick={onBackToLanding}
                      className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-rose-50 text-rose-600 text-xs text-left"
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

        {/* Content Canvas */}
        <main className="flex-1 p-4 sm:p-7 lg:p-8 max-w-[1400px] w-full mx-auto space-y-6">

          {/* Top Executive KPI Ribbon */}
          <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-2xs hover:shadow-xs transition-all">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Stockouts Averted</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-[22px] font-[800] text-slate-900 tracking-tight">3,420</div>
              <p className="text-[11px] font-semibold text-emerald-600 mt-0.5 flex items-center gap-1">
                <span>↓ 85.8%</span>
                <span className="text-slate-400 font-normal">vs legacy baseline</span>
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-2xs hover:shadow-xs transition-all">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Active Prescriptions</span>
                <Sparkles className="w-4 h-4 text-[#5244E9]" />
              </div>
              <div className="text-[22px] font-[800] text-slate-900 tracking-tight">
                {decisions.filter(d => d.status === 'pending').length} Actions
              </div>
              <p className="text-[11px] font-semibold text-[#5244E9] mt-0.5">
                Ready to coordinate
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-2xs hover:shadow-xs transition-all">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Excess Capital Freed</span>
                <DollarSign className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-[22px] font-[800] text-slate-900 tracking-tight">$340,000</div>
              <p className="text-[11px] font-semibold text-blue-600 mt-0.5">
                -70.8% Deadstock cut
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100/90 shadow-2xs hover:shadow-xs transition-all">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">In-Stock Service Level</span>
                <Percent className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-[22px] font-[800] text-slate-900 tracking-tight">98.6%</div>
              <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">
                +7.4 pts vs 91.2% base
              </p>
            </div>

            <div className="col-span-2 md:col-span-1 bg-white p-4 rounded-2xl border border-slate-100/90 shadow-2xs hover:shadow-xs transition-all">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Decision Accuracy</span>
                <CheckCircle2 className="w-4 h-4 text-[#5244E9]" />
              </div>
              <div className="text-[22px] font-[800] text-slate-900 tracking-tight">98.2%</div>
              <p className="text-[11px] font-semibold text-[#5244E9] mt-0.5">
                Multi-signal reasoned
              </p>
            </div>
          </section>

          {/* ========================================================
              TAB 1: PRESCRIBED DECISIONS
          ======================================================== */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Filter & Search Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                
                {/* Search SKU or Store */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search SKU name, ID, or Store..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#5244E9] focus:bg-white transition-all"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-1">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Filter:</span>
                  </div>

                  {/* Action filter */}
                  <select
                    value={selectedActionFilter}
                    onChange={(e) => setSelectedActionFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-[#5244E9] cursor-pointer"
                  >
                    <option value="all">All Actions (7 Types)</option>
                    <option value="replenish">Replenish</option>
                    <option value="transfer inventory">Transfer Inventory</option>
                    <option value="increase allocation">Increase Allocation</option>
                    <option value="markdown">Markdown</option>
                    <option value="adjust promotion">Adjust Promotion</option>
                    <option value="substitute product">Substitute Product</option>
                    <option value="take no action">Take No Action</option>
                  </select>

                  {/* Store filter */}
                  <select
                    value={selectedStoreFilter}
                    onChange={(e) => setSelectedStoreFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-[#5244E9] cursor-pointer"
                  >
                    <option value="all">All Stores & Channels</option>
                    <option value="STR-104">Store #104 Downtown Hub</option>
                    <option value="STR-208">Store #208 Westside Suburb</option>
                    <option value="STR-310">Store #310 Metro Plaza</option>
                    <option value="STR-502">Store #502 Eastgate Center</option>
                  </select>
                </div>

              </div>

              {/* Main Prescribed Decisions Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      Store & Channel Prescription Queue
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                      {filteredDecisions.length} Prescriptions
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Ordered by risk priority & financial impact
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/75 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">Store / Channel</th>
                        <th className="py-3 px-4">SKU & Category</th>
                        <th className="py-3 px-4">Signals Detected</th>
                        <th className="py-3 px-4">Prescribed Action</th>
                        <th className="py-3 px-4 min-w-[280px]">Action Rationale ("Why")</th>
                        <th className="py-3 px-4">Expected Impact</th>
                        <th className="py-3 px-4 text-right">Execute Decision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80 text-slate-700">
                      {filteredDecisions.map((decision) => {
                        const isExecuted = decision.status === 'executed';
                        const isExecuting = executingId === decision.id;

                        return (
                          <tr 
                            key={decision.id}
                            className={`hover:bg-slate-50/70 transition-colors ${
                              isExecuted ? 'bg-slate-50/40 opacity-75' : ''
                            }`}
                          >
                            {/* Store & Channel */}
                            <td className="py-3.5 px-4 align-top">
                              <div className="font-bold text-slate-900">{decision.store_name}</div>
                              <div className="text-[11px] text-slate-400 mt-0.5">{decision.channel}</div>
                              <div className="mt-1.5">{getUrgencyBadge(decision.urgency)}</div>
                            </td>

                            {/* SKU / Category */}
                            <td className="py-3.5 px-4 align-top">
                              <div className="font-bold text-slate-900">{decision.sku_name}</div>
                              <div className="text-[11px] font-mono text-slate-400 mt-0.5">{decision.sku_id}</div>
                              <div className="text-[10.5px] text-indigo-600 font-medium mt-1">{decision.category}</div>
                            </td>

                            {/* Signals */}
                            <td className="py-3.5 px-4 align-top">
                              <div className="space-y-1">
                                <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10.5px]">
                                  Sales: {decision.signals.sales_velocity}
                                </span>
                                <div className="text-[11px] text-slate-600">
                                  Stock: <strong className="text-slate-900">{decision.signals.inventory_on_hand} units</strong> ({decision.signals.days_of_supply}d supply)
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  Lead Time: {decision.signals.supplier_lead_time_days} days
                                </div>
                                {decision.signals.weather_condition && (
                                  <div className="text-[10px] text-amber-600 font-medium">
                                    ☁ {decision.signals.weather_condition}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Recommended Action */}
                            <td className="py-3.5 px-4 align-top">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border ${getActionBadgeClass(decision.recommended_action)}`}>
                                <Sparkles className="w-3 h-3 shrink-0" />
                                <span className="capitalize">{decision.recommended_action}</span>
                              </span>
                              <div className="text-[10px] text-slate-400 mt-1">
                                Confidence: {(decision.confidence_score * 100).toFixed(1)}%
                              </div>
                            </td>

                            {/* Rationale */}
                            <td className="py-3.5 px-4 align-top">
                              <p className="text-[11.5px] text-slate-700 leading-relaxed font-normal">
                                {decision.rationale}
                              </p>
                              <button
                                onClick={() => setSelectedDecisionDetail(decision)}
                                className="mt-1.5 text-[10.5px] font-bold text-[#5244E9] hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <span>Inspect Connected Chain (Demand → CX)</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </td>

                            {/* Expected Impact */}
                            <td className="py-3.5 px-4 align-top">
                              <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50/80 border border-emerald-200/60 p-2 rounded-xl leading-snug">
                                {decision.expected_impact}
                              </div>
                            </td>

                            {/* Execute CTA */}
                            <td className="py-3.5 px-4 align-top text-right">
                              {isExecuted ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Executed
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleExecuteAction(decision)}
                                  disabled={isExecuting}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#5244E9] hover:bg-[#4333DE] active:scale-95 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                                >
                                  {isExecuting ? (
                                    <>
                                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                      <span>Dispatching...</span>
                                    </>
                                  ) : (
                                    <>
                                      <span>Execute Action</span>
                                      <ArrowRight className="w-3.5 h-3.5" />
                                    </>
                                  )}
                                </button>
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

          {/* ========================================================
              TAB 2: SIGNALS & TELEMETRY MATRIX
          ======================================================== */}
          {activeTab === 'signals' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Connected Signal Ingestion Pipeline
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                  Retail decisions cannot exist in isolation. Our agentic pipeline continuously ingests and correlates 
                  multimodal enterprise telemetry to determine ripple effects before committing capital or replenishment trucks.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Signal Card 1: SKU Sales Velocity */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#5244E9]" />
                      SKU Sales Velocity & Demand Lift
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-[#5244E9]">
                      Real-time POS
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal">
                    Monitors scan data down to the hour. Detects sudden velocity spikes (+34% to +160%) vs seasonality baselines.
                  </p>
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Active Tracked SKUs:</span>
                      <strong className="text-slate-800">148,200</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Hourly Scan Ingestion:</span>
                      <strong className="text-emerald-600">3.2M transactions/hr</strong>
                    </div>
                  </div>
                </div>

                {/* Signal Card 2: Live Inventory & Days of Supply */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <Boxes className="w-4 h-4 text-blue-500" />
                      Live Inventory & Expiry Tracking
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-600">
                      WMS & Store ERP
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal">
                    Tracks on-hand shelf inventory, backroom cases, and perishable lot sell-by dates to prevent expired stockouts.
                  </p>
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Stores Integrated:</span>
                      <strong className="text-slate-800">42 Locations + 3 DCs</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Perishable Waste Averted:</span>
                      <strong className="text-emerald-600">92.4%</strong>
                    </div>
                  </div>
                </div>

                {/* Signal Card 3: Supplier Lead Times */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-amber-500" />
                      Supplier Lead Time & Reliability
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">
                      EDI / Supply Chain
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal">
                    Dynamically recalculates replenishment safety buffers when suppliers encounter transit bottlenecks or rail delays.
                  </p>
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Supplier OTIF Metric:</span>
                      <strong className="text-slate-800">88.4% On-Time</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Lead Time Variance:</span>
                      <strong className="text-amber-600">± 3.4 days accounted</strong>
                    </div>
                  </div>
                </div>

                {/* Signal Card 4: Weather & Micro-climate */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-500" />
                      Weather & Local Events
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-700">
                      External Feeds
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal">
                    Correlates heatwaves, marathons, and sporting events with hyper-localized demand surges for beverages and grab-and-go.
                  </p>
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Heatwave Coefficient:</span>
                      <strong className="text-emerald-600">+160% Cold Drinks</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Active Event Triggers:</span>
                      <strong className="text-slate-800">2 Metro Marathons</strong>
                    </div>
                  </div>
                </div>

                {/* Signal Card 5: Competitor Pricing */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <Percent className="w-4 h-4 text-rose-500" />
                      Competitor Pricing & Promos
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700">
                      Market Intelligence
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal">
                    Scrapes competitor basket prices and flyer deals to dynamically optimize markdowns and preserve gross margin.
                  </p>
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Price Index vs Market:</span>
                      <strong className="text-slate-800">101.2% (Parity)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Margin Protection:</span>
                      <strong className="text-emerald-600">31.8% Gross</strong>
                    </div>
                  </div>
                </div>

                {/* Signal Card 6: Intra-Store Balancing */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-emerald-500" />
                      District Cross-Dock Balancing
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                      Optimization
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal">
                    Identifies surplus in Store A and transfers to near-empty Store B within a 20-mile radius, cutting external supplier lead time.
                  </p>
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Intra-District Transfers:</span>
                      <strong className="text-slate-800">180 units today</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Transit Cost vs Saved PO:</span>
                      <strong className="text-emerald-600">$45 vs $4,200 PO</strong>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================
              TAB 3: AGENTIC FLOW (Observe → Predict → Reason → Decide → Act → Measure)
          ======================================================== */}
          {activeTab === 'flow' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  The 6-Stage Agentic Intelligence Pipeline
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                  Traditional solutions stop at sales forecasts. RetailSense connects intelligence into automated decisions 
                  by reasoning across the enterprise chain and measuring real business impact.
                </p>
              </div>

              {/* Step By Step Interactive Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Step 1: Observe */}
                <div className="bg-white p-5 rounded-2xl border border-indigo-100/80 shadow-2xs relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-[#5244E9]">
                      Stage 01
                    </span>
                    <Activity className="w-5 h-5 text-[#5244E9]" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Observe</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Continuously ingests POS scanner telemetry, live ERP inventory, local weather, events, and supplier EDI feeds.
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                    Input: 9 Multi-modal Signal Streams
                  </div>
                </div>

                {/* Step 2: Predict */}
                <div className="bg-white p-5 rounded-2xl border border-blue-100/80 shadow-2xs relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
                      Stage 02
                    </span>
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Predict</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Generates probabilistic demand distribution curves per SKU per store, predicting exact stockout horizons.
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                    Horizon: 36h, 7-day, and 30-day confidence bands
                  </div>
                </div>

                {/* Step 3: Reason */}
                <div className="bg-white p-5 rounded-2xl border border-purple-100/80 shadow-2xs relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700">
                      Stage 03
                    </span>
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Reason</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Traverses the enterprise ripple graph: Demand → Inventory → Replenishment → Logistics → Margin → CX.
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                    Engine: Cross-enterprise constraint evaluation
                  </div>
                </div>

                {/* Step 4: Decide */}
                <div className="bg-white p-5 rounded-2xl border border-emerald-100/80 shadow-2xs relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                      Stage 04
                    </span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Decide</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Recommends exact business action from 7 choices: Replenish, Transfer, Markdown, Allocation, Promotion, Substitute, No Action.
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                    Output: Prescribed action + "Why" rationale
                  </div>
                </div>

                {/* Step 5: Act */}
                <div className="bg-white p-5 rounded-2xl border border-amber-100/80 shadow-2xs relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
                      Stage 05
                    </span>
                    <Truck className="w-5 h-5 text-amber-600" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Act</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Direct automated dispatch into ERP / WMS or one-click approval by Store Manager or Supply Chain Lead.
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                    Integration: Direct REST/EDI order triggers
                  </div>
                </div>

                {/* Step 6: Measure */}
                <div className="bg-white p-5 rounded-2xl border border-rose-100/80 shadow-2xs relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700">
                      Stage 06
                    </span>
                    <BarChart3 className="w-5 h-5 text-rose-600" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Measure</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Tracks performance against baseline: Stockouts avoided, excess capital freed, gross margin expansion, decision accuracy.
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                    Closed-loop: Reinforces agentic reward weights
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================
              TAB 4: AI VS BASELINE ROI COMPARISON
          ======================================================== */}
          {activeTab === 'baseline' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  AI Decision Intelligence vs Legacy Statistical Baseline
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                  {baselineData?.summary || "Direct comparison of RetailSense against traditional statistical forecasting with static reorder points."}
                </p>
              </div>

              {/* Head to Head Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/75 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                      <tr>
                        <th className="py-3.5 px-5">Enterprise Metric</th>
                        <th className="py-3.5 px-5">Legacy Baseline (ARIMA / Min-Max)</th>
                        <th className="py-3.5 px-5 bg-indigo-50/40 text-[#5244E9]">RetailSense Agentic AI</th>
                        <th className="py-3.5 px-5">Measured Improvement</th>
                        <th className="py-3.5 px-5">Why AI Wins</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {baselineData?.metrics.map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-4 px-5 font-bold text-slate-900">{m.metric_name}</td>
                          <td className="py-4 px-5 text-slate-500 font-medium">{m.baseline_value}</td>
                          <td className="py-4 px-5 font-bold text-[#5244E9] bg-indigo-50/20">{m.ai_value}</td>
                          <td className="py-4 px-5 font-bold text-emerald-600">{m.improvement}</td>
                          <td className="py-4 px-5 text-slate-500 leading-normal max-w-xs">{m.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/40 p-5 rounded-2xl border border-emerald-200/80">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Total Stockouts Averted</span>
                  <div className="text-3xl font-[800] text-emerald-900 mt-1">3,420</div>
                  <p className="text-xs text-emerald-700 mt-1">Zero shelf outages during high-demand events</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/40 p-5 rounded-2xl border border-blue-200/80">
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Working Capital Freed</span>
                  <div className="text-3xl font-[800] text-blue-900 mt-1">$340,000</div>
                  <p className="text-xs text-blue-700 mt-1">Eliminated idle warehouse inventory</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/40 p-5 rounded-2xl border border-indigo-200/80">
                  <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Gross Margin Expansion</span>
                  <div className="text-3xl font-[800] text-[#5244E9] mt-1">+5.4 pts</div>
                  <p className="text-xs text-indigo-700 mt-1">Protected full-price selling with targeted markdowns</p>
                </div>
              </div>

            </div>
          )}

        </main>

      </div>

      {/* ========================================================
          DECISION DETAIL MODAL (Inspect Connected Chain)
      ======================================================== */}
      {selectedDecisionDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full p-6 sm:p-7 relative overflow-hidden max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${getActionBadgeClass(selectedDecisionDetail.recommended_action)}`}>
                    Action: {selectedDecisionDetail.recommended_action.toUpperCase()}
                  </span>
                  {getUrgencyBadge(selectedDecisionDetail.urgency)}
                </div>
                <h3 className="text-lg font-[800] text-slate-900">
                  {selectedDecisionDetail.sku_name}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedDecisionDetail.store_name} • {selectedDecisionDetail.channel}
                </p>
              </div>

              <button
                onClick={() => setSelectedDecisionDetail(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Connected Decision Chain: Demand → CX */}
            <div className="mt-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Connected Decision Chain Analysis
              </h4>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <strong className="text-[#5244E9]">1. Demand: </strong>
                  <span className="text-slate-700">{selectedDecisionDetail.chain_impact.demand}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <strong className="text-blue-600">2. Inventory: </strong>
                  <span className="text-slate-700">{selectedDecisionDetail.chain_impact.inventory}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <strong className="text-purple-600">3. Replenishment: </strong>
                  <span className="text-slate-700">{selectedDecisionDetail.chain_impact.replenishment}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <strong className="text-amber-600">4. Logistics: </strong>
                  <span className="text-slate-700">{selectedDecisionDetail.chain_impact.logistics}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <strong className="text-emerald-600">5. Margin: </strong>
                  <span className="text-slate-700">{selectedDecisionDetail.chain_impact.margin}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <strong className="text-rose-600">6. Customer Experience: </strong>
                  <span className="text-slate-700">{selectedDecisionDetail.chain_impact.customer_experience}</span>
                </div>
              </div>

              {/* Rationale & Impact */}
              <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs space-y-2">
                <div className="font-bold text-[#5244E9]">Prescription Rationale</div>
                <p className="text-slate-700 leading-relaxed">{selectedDecisionDetail.rationale}</p>
                <div className="font-bold text-emerald-700 pt-1">Expected Financial Impact</div>
                <p className="text-emerald-800 font-medium">{selectedDecisionDetail.expected_impact}</p>
              </div>

              {/* CTA */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  onClick={() => setSelectedDecisionDetail(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Close
                </button>
                {selectedDecisionDetail.status !== 'executed' && (
                  <button
                    onClick={() => {
                      handleExecuteAction(selectedDecisionDetail);
                      setSelectedDecisionDetail(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#5244E9] hover:bg-[#4333DE] shadow-xs transition-all"
                  >
                    Confirm & Execute Action
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
