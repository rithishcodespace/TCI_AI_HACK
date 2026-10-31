import { useState } from 'react';
import { 
  ChevronDown, 
  Menu, 
  X, 
  Sparkles, 
  LayoutGrid, 
  Share2, 
  Bell, 
  ShieldCheck,
  Folder
} from 'lucide-react';

export default function LandingPage({ onLoginClick, onSignupClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900 font-sans antialiased overflow-x-hidden">
      
      {/* Top Navigation */}
      <header className="w-full max-w-[1360px] mx-auto px-6 sm:px-12 pt-7 pb-6 flex items-center justify-between relative z-30">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer select-none">
          {/* Custom Helix/Loop Gradient Logo */}
          <svg className="w-8 h-8 shrink-0" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="retailSynclyGrad" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F43F5E" />
                <stop offset="0.5" stopColor="#D946EF" />
                <stop offset="1" stopColor="#6366F1" />
              </linearGradient>
            </defs>
            <path
              d="M13.5 8C17 4.5 22.5 4.5 26 8C29.5 11.5 29.5 17 26 20.5L21.5 25C19 27.5 15 27.5 12.5 25C10 22.5 10 18.5 12.5 16L18 10.5"
              stroke="url(#retailSynclyGrad)"
              strokeWidth="3.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22.5 28C19 31.5 13.5 31.5 10 28C6.5 24.5 6.5 19 10 15.5L14.5 11C17 8.5 21 8.5 23.5 11C26 13.5 26 17.5 23.5 20L18 25.5"
              stroke="url(#retailSynclyGrad)"
              strokeWidth="3.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex flex-col">
            <span className="text-[21px] font-[800] tracking-tight text-[#0F172A] leading-none">
              RetailSense
            </span>
            <span className="text-[9px] font-[700] text-slate-400 tracking-[0.14em] uppercase leading-tight mt-1">
              DECISION INTELLIGENCE
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-9 text-[14.5px] font-medium text-[#1E293B]">
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-indigo-600 transition-colors group">
            <span>Prescriptions</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors stroke-[2.2]" />
          </div>
          <a href="#signals" className="hover:text-indigo-600 transition-colors">
            Connected Signals
          </a>
          <a href="#pipeline" className="hover:text-indigo-600 transition-colors">
            Agentic Flow
          </a>
          <a href="#baseline" className="hover:text-indigo-600 transition-colors">
            Impact vs Baseline
          </a>
        </nav>

        {/* Right CTA Actions: Login & Sign up buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button 
            onClick={onLoginClick}
            className="text-slate-700 hover:text-slate-900 font-semibold text-[14.5px] px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Login
          </button>
          <button 
            onClick={onSignupClick}
            className="bg-[#5244E9] hover:bg-[#4536db] active:scale-[0.98] transition-all text-white text-[14.5px] font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md cursor-pointer"
          >
            Launch Engine
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="sm:hidden flex items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl p-6 sm:hidden flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-3 text-[15px] font-medium text-slate-700">
              <a href="#prescriptions" className="py-1 hover:text-indigo-600">Prescriptions</a>
              <a href="#signals" className="py-1 hover:text-indigo-600">Connected Signals</a>
              <a href="#pipeline" className="py-1 hover:text-indigo-600">Agentic Flow</a>
              <a href="#baseline" className="py-1 hover:text-indigo-600">Impact vs Baseline</a>
            </nav>
            <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
              <button 
                onClick={onLoginClick}
                className="w-full text-center py-2.5 text-slate-700 font-semibold text-[14px] hover:bg-slate-50 rounded-xl"
              >
                Login
              </button>
              <button 
                onClick={onSignupClick}
                className="w-full text-center py-2.5 bg-[#5244E9] hover:bg-[#4536db] text-white font-semibold text-[14px] rounded-xl shadow-sm"
              >
                Launch Decision Engine
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Hero Section */}
      <main className="w-full max-w-[1360px] mx-auto px-6 sm:px-12 pt-6 sm:pt-10 pb-16 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-5 flex flex-col items-start text-left z-10 lg:pr-2">
            
            {/* Retail AI Product Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50/90 border border-indigo-200/60 text-[#5244E9] text-[11px] font-bold mb-4 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>RETAIL AI • AUTONOMOUS DECISION INTELLIGENCE</span>
            </div>

            <h1 className="text-[38px] sm:text-[48px] lg:text-[50px] font-[800] text-[#0F172A] tracking-[-0.03em] leading-[1.12]">
              Turn Enterprise Signals <br />
              into Connected Decisions
            </h1>
            
            <p className="mt-4 sm:mt-5 text-[15px] sm:text-[16px] text-[#64748B] leading-[1.65] font-normal max-w-[470px]">
              Retail decisions rarely exist independently. An agentic AI decision-intelligence engine that reasons across demand, store inventory, promotions, and supplier lead times to determine what action each store or channel should take next, and why.
            </p>

            {/* Expected Flow Pipeline Pills */}
            <div className="mt-6 flex flex-wrap items-center gap-1.5 p-2 bg-slate-50/80 rounded-xl border border-slate-200/80 text-[10.5px] font-bold text-slate-600">
              <span className="px-2 py-0.5 bg-white rounded-md shadow-2xs text-[#5244E9]">Observe</span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 bg-white rounded-md shadow-2xs text-blue-600">Predict</span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 bg-white rounded-md shadow-2xs text-purple-600">Reason</span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 bg-white rounded-md shadow-2xs text-emerald-600">Decide</span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 bg-white rounded-md shadow-2xs text-amber-600">Act</span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 bg-white rounded-md shadow-2xs text-rose-600">Measure</span>
            </div>

            {/* Hero CTA Button */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button 
                onClick={onSignupClick}
                className="group relative overflow-hidden bg-[#5244E9] hover:bg-[#4536db] active:scale-[0.98] transition-all text-white font-medium text-[15px] px-6 py-3 rounded-xl shadow-[0_8px_20px_-4px_rgba(82,68,233,0.35)] flex items-center gap-2.5 cursor-pointer"
              >
                <span className="relative z-10 font-semibold tracking-[-0.01em]">Launch Decision Engine</span>
                <span className="relative z-10 text-white/90 text-[17px] font-bold transition-transform group-hover:translate-x-1 duration-200">
                  ›
                </span>
              </button>

              <button
                onClick={onLoginClick}
                className="px-5 py-3 rounded-xl border border-slate-200/90 text-slate-700 font-semibold text-[14px] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                View Live Demo
              </button>
            </div>
          </div>

          {/* Right Hero Visuals / Platform Mockup */}
          <div className="lg:col-span-7 relative w-full flex items-center justify-center lg:justify-end pt-2 pb-10">
            
            {/* Ambient Radial Glow */}
            <div className="absolute w-[500px] h-[400px] bg-gradient-to-tr from-indigo-100/50 via-purple-50/40 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

            {/* Main Application Container */}
            <div className="relative w-full max-w-[630px] bg-white rounded-2xl border border-slate-200/80 shadow-[0_20px_50px_rgba(15,23,42,0.08)] overflow-visible">
              
              <div className="grid grid-cols-12 min-h-[385px]">
                
                {/* Left Panel: Taxonomy */}
                <div className="col-span-5 p-4 sm:p-5 border-r border-slate-100 flex flex-col bg-white rounded-l-2xl">
                  <h3 className="text-[15px] font-bold text-slate-900 tracking-tight mb-2.5">
                    Taxonomy
                  </h3>

                  {/* Top Stats */}
                  <div className="grid grid-cols-2 gap-2 pb-3 mb-3 border-b border-slate-100">
                    <div>
                      <div className="text-[9.5px] text-slate-400 font-medium tracking-tight">Total feedback</div>
                      <div className="text-[15px] font-bold text-slate-800 tracking-tight mt-0.5">245,234</div>
                    </div>
                    <div>
                      <div className="text-[9.5px] text-slate-400 font-medium tracking-tight">Analyzed issues</div>
                      <div className="text-[15px] font-bold text-slate-800 tracking-tight mt-0.5">135</div>
                    </div>
                  </div>

                  {/* Tree Hierarchy */}
                  <div className="space-y-2 text-[10.5px] font-medium text-slate-600">
                    <div className="relative">
                      {/* Active Parent Node */}
                      <div className="border border-[#7C3AED] bg-white text-slate-800 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs">
                        <span className="text-[9px] text-slate-400 font-bold">›</span>
                        <LayoutGrid className="w-3.5 h-3.5 text-[#7C3AED]" />
                        <span className="text-[11px] font-semibold text-slate-800 truncate">Customer Service</span>
                      </div>

                      {/* Sub-tree with dotted lines */}
                      <div className="ml-3.5 pl-3 border-l border-dashed border-slate-300 pt-2 space-y-2">
                        {/* Nested Level 1: Compensation */}
                        <div className="relative flex items-center">
                          <span className="absolute -left-3 top-1/2 w-2.5 border-t border-dashed border-slate-300" />
                          <div className="border border-slate-200/80 bg-white px-2.5 py-1 rounded-md text-[10px] text-slate-700 flex items-center gap-1.5 font-medium shadow-2xs">
                            <span className="text-[8.5px] text-slate-400 font-bold">›</span>
                            <Folder className="w-3 h-3 text-[#7C3AED]" />
                            <span>Compensation</span>
                          </div>
                        </div>

                        {/* Nested Level 2: Refund */}
                        <div className="ml-3 pl-3 border-l border-dashed border-slate-300 pt-1">
                          <div className="relative flex items-center">
                            <span className="absolute -left-3 top-1/2 w-2.5 border-t border-dashed border-slate-300" />
                            <div className="border border-slate-200/80 bg-white px-2 py-0.5 rounded text-[9.5px] text-slate-700 flex items-center gap-1.5 font-medium shadow-2xs">
                              <span className="text-[8px] text-slate-400 font-bold">›</span>
                              <span className="w-2.5 h-2.5 rounded-xs border border-blue-500 bg-blue-50" />
                              <span>Refund</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sibling items */}
                    <div className="pt-2 space-y-1.5">
                      <div className="border border-slate-200/80 bg-white px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-600 shadow-2xs">
                        <span className="text-[9px] text-slate-400 font-bold">›</span>
                        <LayoutGrid className="w-3.5 h-3.5 text-[#7C3AED]" />
                        <span className="text-[11px]">App Interface</span>
                      </div>
                      <div className="border border-slate-200/80 bg-white px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-600 shadow-2xs">
                        <span className="text-[9px] text-slate-400 font-bold">›</span>
                        <LayoutGrid className="w-3.5 h-3.5 text-[#7C3AED]" />
                        <span className="text-[11px]">Privacy and Safety</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Content Area */}
                <div className="col-span-7 p-4 sm:p-5 bg-white flex flex-col justify-between rounded-r-2xl">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-800 font-bold text-[13.5px]">
                        <LayoutGrid className="w-3.5 h-3.5 text-[#7C3AED]" />
                        <span>Customer Service</span>
                      </div>
                      <button className="bg-[#5244E9] hover:bg-[#4333DE] transition-colors text-white text-[11px] font-semibold px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer">
                        <Share2 className="w-3 h-3 stroke-[2.2]" />
                        <span>Share</span>
                      </button>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-5 mt-2.5 mb-3 text-[11px]">
                      <button className="font-bold text-slate-900 border-b-2 border-[#5244E9] pb-1.5 cursor-pointer">
                        All feedback (42,430)
                      </button>
                      <button className="font-medium text-slate-400 hover:text-slate-600 pb-1.5 cursor-pointer">
                        Not classified 1,273 (3%)
                      </button>
                    </div>

                    {/* Issue Cards */}
                    <div className="space-y-2.5">
                      {/* Issue 1 */}
                      <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="bg-indigo-100 text-[#5244E9] text-[9.5px] font-bold px-1.5 py-0.5 rounded">
                            Issue 1
                          </span>
                          <div className="h-2 bg-slate-200/80 rounded-full w-36 sm:w-44" />
                        </div>
                        <div className="flex items-center gap-1 text-[11px]">
                          <span className="text-amber-500">😐</span>
                          <span className="text-emerald-500">😊</span>
                        </div>
                      </div>

                      {/* Issue 2 */}
                      <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="bg-indigo-100 text-[#5244E9] text-[9.5px] font-bold px-1.5 py-0.5 rounded">
                            Issue 2
                          </span>
                          <div className="h-2 bg-slate-200/80 rounded-full w-28 sm:w-36" />
                        </div>
                        <div className="flex items-center gap-1 text-[11px]">
                          <span className="text-amber-500">😐</span>
                          <span className="text-rose-500">☹</span>
                        </div>
                      </div>

                      {/* Issue 3 */}
                      <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="bg-indigo-100 text-[#5244E9] text-[9.5px] font-bold px-1.5 py-0.5 rounded">
                            Issue 3
                          </span>
                          <div className="h-2 bg-slate-200/80 rounded-full w-32 sm:w-40" />
                        </div>
                        <div className="flex items-center gap-1 text-[11px]">
                          <span className="text-amber-500">😐</span>
                          <span className="text-emerald-500">😊</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* OVERLAY CARD 1: Negative Feedback Alert */}
              <div className="absolute -bottom-6 -left-4 sm:-left-7 z-20 bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100 shadow-[0_20px_45px_rgba(15,23,42,0.12)] max-w-[285px]">
                {/* Floating Bell Icon */}
                <div className="absolute -top-3 left-4 w-7 h-7 bg-[#FEF3C7] rounded-full flex items-center justify-center text-[#D97706] shadow-xs border border-amber-200">
                  <Bell className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>

                <div className="flex items-center gap-1.5 pt-0.5 mb-1.5">
                  <span className="text-rose-600 font-bold text-[12px] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full border border-rose-500 text-rose-500 flex items-center justify-center text-[7px] font-bold">☹</span>
                    32 negative feedback
                  </span>
                  <span className="bg-indigo-50 text-[#5244E9] text-[9.5px] font-bold px-1.5 py-0.5 rounded border border-indigo-100">
                    ↑ 56%
                  </span>
                </div>

                <p className="text-[10px] text-slate-500 leading-snug font-normal">
                  "Support staff was very supportive and professional, <span className="bg-rose-50 text-rose-700 px-1 py-0.5 rounded font-semibold">but the app crashes ...</span>"
                </p>
              </div>

              {/* OVERLAY CARD 2: Sentiment Stacked Bar Chart */}
              <div className="absolute -bottom-8 -right-4 sm:-right-7 z-20 bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_25px_50px_rgba(15,23,42,0.15)] w-[265px]">
                {/* Floating Speech Emoji Bubble */}
                <div className="absolute -top-3 right-4 bg-white border border-slate-100 rounded-full px-2 py-0.5 shadow-xs flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">😊</span>
                  <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px]">☹</span>
                </div>

                {/* 3 Stacked Horizontal Segmented Bars */}
                <div className="space-y-2 mt-1">
                  {/* Bar 1 */}
                  <div className="flex h-2.5 w-full rounded-md overflow-hidden gap-0.5">
                    <div className="w-[18%] bg-rose-500 rounded-l-xs" />
                    <div className="w-[14%] bg-amber-400" />
                    <div className="w-[18%] bg-slate-300" />
                    <div className="w-[24%] bg-emerald-300" />
                    <div className="w-[26%] bg-emerald-500 rounded-r-xs" />
                  </div>

                  {/* Bar 2 */}
                  <div className="flex h-2.5 w-full rounded-md overflow-hidden gap-0.5">
                    <div className="w-[12%] bg-rose-500 rounded-l-xs" />
                    <div className="w-[16%] bg-amber-400" />
                    <div className="w-[14%] bg-slate-300" />
                    <div className="w-[22%] bg-emerald-300" />
                    <div className="w-[36%] bg-emerald-500 rounded-r-xs" />
                  </div>

                  {/* Bar 3 */}
                  <div className="flex h-2.5 w-full rounded-md overflow-hidden gap-0.5">
                    <div className="w-[22%] bg-rose-500 rounded-l-xs" />
                    <div className="w-[12%] bg-amber-400" />
                    <div className="w-[16%] bg-slate-300" />
                    <div className="w-[28%] bg-emerald-300" />
                    <div className="w-[22%] bg-emerald-500 rounded-r-xs" />
                  </div>
                </div>

                {/* Legend below */}
                <div className="flex items-center justify-between text-[8.5px] text-slate-500 pt-2.5 mt-2 border-t border-slate-100 font-medium">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full border border-rose-500 text-rose-500 flex items-center justify-center text-[7px] font-bold">☹</span>
                    Negative
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full border border-slate-400 text-slate-400 flex items-center justify-center text-[7px] font-bold">●</span>
                    Neutral
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full border border-emerald-500 text-emerald-500 flex items-center justify-center text-[7px] font-bold">😊</span>
                    Positive
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Enterprise Infrastructure & Integrations Footer */}
      <footer className="w-full py-5 sm:py-6 bg-white border-t border-slate-100">
        <div className="max-w-[1360px] mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 font-bold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Certified Connectors:
            </span>
            <span className="text-slate-500">
              SAP S/4HANA • Oracle Retail • Blue Yonder • Manhattan WMS • Snowflake Data Cloud
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 text-[11.5px] font-semibold text-slate-400">
            <span className="flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              SOC-2 Type II Certified
            </span>
            <span>•</span>
            <span className="text-slate-600">99.99% Enterprise SLA</span>
            <span>•</span>
            <span className="text-slate-600">Sub-second POS Telemetry</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
