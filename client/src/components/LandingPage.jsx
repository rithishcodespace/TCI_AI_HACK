import React, { useState } from 'react';
import { 
  ChevronDown, 
  Menu,
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Store,
  Layers,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Tag,
  Package,
  Check
} from 'lucide-react';

export default function LandingPage({ onLoginClick, onSignupClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedDemoTab, setSelectedDemoTab] = useState('decide');

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900 font-sans antialiased overflow-x-hidden">
      
      {/* Top Navigation */}
      <header className="w-full max-w-[1360px] mx-auto px-6 sm:px-12 pt-7 pb-6 flex items-center justify-between relative z-30">
        
        {/* Brand Logo with Helix Loop */}
        <div className="flex items-center gap-3 cursor-pointer select-none">
          <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="synclyGradient" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F43F5E" />
                <stop offset="0.5" stopColor="#D946EF" />
                <stop offset="1" stopColor="#6366F1" />
              </linearGradient>
            </defs>
            <path
              d="M13.5 8C17 4.5 22.5 4.5 26 8C29.5 11.5 29.5 17 26 20.5L21.5 25C19 27.5 15 27.5 12.5 25C10 22.5 10 18.5 12.5 16L18 10.5"
              stroke="url(#synclyGradient)"
              strokeWidth="3.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22.5 28C19 31.5 13.5 31.5 10 28C6.5 24.5 6.5 19 10 15.5L14.5 11C17 8.5 21 8.5 23.5 11C26 13.5 26 17.5 23.5 20L18 25.5"
              stroke="url(#synclyGradient)"
              strokeWidth="3.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex flex-col">
            <span className="text-[21px] font-[800] tracking-tight text-[#0F172A] leading-tight">
              PulseRetail <span className="text-[#5244E9]">AI</span>
            </span>
            <span className="text-[9.5px] font-[700] text-slate-400 tracking-[0.12em] uppercase leading-tight">
              CHALLENGE 10 • DECISION INTELLIGENCE
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-10 text-[15px] font-medium text-[#1E293B]">
          <a href="#loop" className="hover:text-[#5244E9] transition-colors">The 6-Step Loop</a>
          <a href="#decisions" className="hover:text-[#5244E9] transition-colors">Decisions</a>
          <a href="#backtest" className="hover:text-[#5244E9] transition-colors">AI vs Baseline</a>
          <a href="#whatsapp" className="hover:text-[#5244E9] transition-colors">WhatsApp Bot</a>
          <a href="#roles" className="hover:text-[#5244E9] transition-colors">Roles</a>
        </nav>

        {/* Right CTA Actions: Login & Sign up buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button 
            onClick={onLoginClick}
            className="text-slate-700 hover:text-slate-900 font-semibold text-[15px] px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Login
          </button>
          <button 
            onClick={onSignupClick}
            className="bg-[#5244E9] hover:bg-[#4536db] active:scale-[0.98] transition-all text-white text-[15px] font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md cursor-pointer"
          >
            Open Console
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="sm:hidden flex items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl p-6 sm:hidden flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
            <nav className="flex flex-col gap-3 text-[16px] font-medium text-slate-700">
              <a href="#loop" onClick={() => setIsMobileMenuOpen(false)}>The 6-Step Loop</a>
              <a href="#decisions" onClick={() => setIsMobileMenuOpen(false)}>Decisions</a>
              <a href="#backtest" onClick={() => setIsMobileMenuOpen(false)}>AI vs Baseline</a>
              <a href="#whatsapp" onClick={() => setIsMobileMenuOpen(false)}>WhatsApp Bot</a>
            </nav>
            <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
              <button 
                onClick={onLoginClick}
                className="w-full text-center py-2.5 text-slate-700 font-semibold text-[15px] hover:bg-slate-50 rounded-xl"
              >
                Login
              </button>
              <button 
                onClick={onSignupClick}
                className="w-full text-center py-2.5 bg-[#5244E9] hover:bg-[#4536db] text-white font-semibold text-[15px] rounded-xl shadow-sm"
              >
                Open Console
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Hero Section (Original Hero Layout Restored) */}
      <main className="w-full max-w-[1360px] mx-auto px-6 sm:px-12 pt-8 sm:pt-14 pb-16 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-5 flex flex-col items-start text-left z-10 lg:pr-2">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF4FF] text-[#5244E9] text-[12px] font-semibold mb-5 border border-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-[#5244E9]" />
              <span>Theme 2: AI for Business (Retail / CPG)</span>
            </div>

            <h1 className="text-[38px] sm:text-[48px] lg:text-[50px] font-[800] text-[#0F172A] tracking-[-0.03em] leading-[1.12]">
              Turn Retail Signals <br />
              into Store Decisions
            </h1>
            
            <p className="mt-5 text-[16px] text-[#64748B] leading-[1.65] font-normal max-w-[460px]">
              Retail decisions are connected: <span className="font-semibold text-slate-800">Demand → Inventory → Replenishment → Logistics → Margin</span>. 
              PulseRetail AI goes beyond sales forecasts to tell every store exactly what action to take next, and why.
            </p>

            {/* Hero CTA Button (Exact Original Style) */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={onSignupClick}
                className="group relative overflow-hidden bg-[#5244E9] hover:bg-[#4536db] active:scale-[0.98] transition-all text-white font-medium text-[16px] px-7 py-3 rounded-xl shadow-[0_8px_20px_-4px_rgba(82,68,233,0.35)] flex items-center gap-3 cursor-pointer w-full sm:w-auto justify-center"
              >
                <div 
                  className="absolute inset-x-0 top-0 h-[48%] pointer-events-none opacity-25"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                    backgroundSize: '5px 5px'
                  }}
                />
                <span className="relative z-10 font-semibold tracking-[-0.01em]">Launch Decision Console</span>
                <span className="relative z-10 text-white/90 text-[18px] font-bold transition-transform group-hover:translate-x-1 duration-200">
                  ›
                </span>
              </button>

              <a
                href="#whatsapp"
                className="text-slate-600 hover:text-[#5244E9] text-[14px] font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Bot Demo</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-8 grid grid-cols-3 gap-3 pt-6 border-t border-slate-100 w-full max-w-[460px]">
              <div>
                <div className="text-[20px] font-extrabold text-[#0F172A]">-71.6%</div>
                <div className="text-[11px] text-slate-400 font-medium">Stockouts vs Base</div>
              </div>
              <div>
                <div className="text-[20px] font-extrabold text-emerald-600">96.8%</div>
                <div className="text-[11px] text-slate-400 font-medium">Target Service Level</div>
              </div>
              <div>
                <div className="text-[20px] font-extrabold text-[#5244E9]">+5.2%</div>
                <div className="text-[11px] text-slate-400 font-medium">Margin Expansion</div>
              </div>
            </div>

          </div>

          {/* Right Hero Visuals / Platform Mockup (Original Layout Restored) */}
          <div className="lg:col-span-7 relative w-full flex items-center justify-center lg:justify-end pt-2 pb-10">
            
            {/* Ambient Radial Glow */}
            <div className="absolute w-[500px] h-[400px] bg-gradient-to-tr from-indigo-100/50 via-purple-50/40 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

            {/* Main Application Container */}
            <div className="relative w-full max-w-[620px] bg-white rounded-2xl border border-slate-200/80 shadow-[0_20px_50px_rgba(15,23,42,0.06)] overflow-visible">
              
              <div className="grid grid-cols-12 min-h-[380px]">
                
                {/* Left Panel: Decision Engine Signals */}
                <div className="col-span-5 p-5 border-r border-slate-100 flex flex-col bg-white rounded-l-2xl">
                  <h3 className="text-[16px] font-bold text-slate-900 tracking-tight mb-3">
                    Store Signals
                  </h3>

                  {/* Signal Stats */}
                  <div className="grid grid-cols-2 gap-2 pb-4 mb-4 border-b border-slate-100">
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Monitored SKUs</div>
                      <div className="text-[15px] font-bold text-slate-800 mt-0.5">120 Items</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">At Risk Today</div>
                      <div className="text-[15px] font-bold text-rose-600 mt-0.5">2 Critical</div>
                    </div>
                  </div>

                  {/* Stepper Navigation */}
                  <div className="space-y-2 text-[11px] font-medium text-slate-600">
                    
                    <div className="border border-[#7C3AED] bg-[#FBF9FE] text-slate-800 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-[0_1px_3px_rgba(124,58,237,0.08)]">
                      <span className="text-[10px] text-[#7C3AED] font-bold">●</span>
                      <span className="text-[11px] font-semibold text-slate-800">1. Observe & Reconstruct</span>
                    </div>

                    <div className="border border-slate-200/90 bg-white px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-700">
                      <span className="text-[10px] text-slate-400">●</span>
                      <span>2. Predict (P10–P90)</span>
                    </div>

                    <div className="border border-slate-200/90 bg-white px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-700">
                      <span className="text-[10px] text-slate-400">●</span>
                      <span>3. Reason & Guardrails</span>
                    </div>

                    <div className="border border-[#5244E9] bg-[#EEF4FF] text-[#5244E9] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-bold shadow-xs">
                      <span className="text-[10px] text-[#5244E9]">●</span>
                      <span>4. Ranked Actions</span>
                    </div>

                    <div className="border border-slate-200/90 bg-white px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-700">
                      <span className="text-[10px] text-slate-400">●</span>
                      <span>5. Web & WhatsApp</span>
                    </div>

                    <div className="border border-slate-200/90 bg-white px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-700">
                      <span className="text-[10px] text-slate-400">●</span>
                      <span>6. Backtest Verification</span>
                    </div>

                  </div>
                </div>

                {/* Right Panel: Live Action Card Mockup */}
                <div className="col-span-7 p-5 flex flex-col justify-between bg-[#FAFAFC] rounded-r-2xl">
                  
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EEF4FF] text-[#5244E9] uppercase">
                          Action #1 • Replenish
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        High Confidence
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="text-[14px] font-bold text-slate-900">Royal Basmati Rice 5 kg</div>
                      <div className="text-[10px] text-slate-400 font-mono">SKU-4412 • Grains & Staples</div>
                    </div>

                    {/* Metric Pills */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                        <span className="text-slate-400 block text-[9.5px]">Stock Cover</span>
                        <span className="font-bold text-rose-600">2.1 Days</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                        <span className="text-slate-400 block text-[9.5px]">Supplier Lead</span>
                        <span className="font-bold text-slate-800">6 Days (MOQ 50)</span>
                      </div>
                    </div>

                    {/* Reasoning box */}
                    <div className="mt-3 p-2.5 rounded-xl bg-white border border-slate-200/80 text-[10.5px] text-slate-600 leading-snug">
                      <b className="text-slate-900">Why: </b>
                      Festival promo increases demand ~35%, causing empty shelves by Thursday. Order <b>120 units by Tuesday</b>.
                    </div>

                    <div className="mt-2 text-[10px] text-emerald-600 font-semibold">
                      Expected Value: Avoids ₹38,000 lost margin
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Human Approval:</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={onLoginClick}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg text-[11px] shadow-sm transition-all"
                      >
                        Approve Order
                      </button>
                      <button 
                        onClick={onLoginClick}
                        className="bg-white border border-slate-200 text-slate-700 font-medium px-2.5 py-1.5 rounded-lg text-[11px]"
                      >
                        Modify
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </main>

      {/* The 6-Step Loop Section */}
      <section id="loop" className="py-16 bg-[#FAFAFC] border-t border-slate-100">
        <div className="max-w-[1360px] mx-auto px-6 sm:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold text-[#5244E9] uppercase tracking-wider">
              Expected System Flow
            </span>
            <h2 className="text-[28px] sm:text-[34px] font-bold text-[#0F172A] tracking-tight mt-1">
              Observe → Predict → Reason → Decide → Act → Measure
            </h2>
            <p className="mt-2 text-[15px] text-slate-500">
              Transforming raw dirty POS transactions into automated, profitable store execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="w-8 h-8 rounded-xl bg-[#EEF4FF] text-[#5244E9] font-bold text-xs flex items-center justify-center mb-3">01</span>
              <h3 className="text-[16px] font-bold text-slate-900">Observe & Ingest</h3>
              <p className="text-[13px] text-slate-500 mt-2 leading-relaxed">
                Connects sales history, on-hand inventory, and supplier lead times. Unmasks unobserved lost sales on stockout days.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="w-8 h-8 rounded-xl bg-[#EEF4FF] text-[#5244E9] font-bold text-xs flex items-center justify-center mb-3">02</span>
              <h3 className="text-[16px] font-bold text-slate-900">Predict Demand</h3>
              <p className="text-[13px] text-slate-500 mt-2 leading-relaxed">
                Generates probabilistic P10, P50, and P90 forecast bands covering supplier lead time plus review period.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="w-8 h-8 rounded-xl bg-[#EEF4FF] text-[#5244E9] font-bold text-xs flex items-center justify-center mb-3">03</span>
              <h3 className="text-[16px] font-bold text-slate-900">Reason Across Constraints</h3>
              <p className="text-[13px] text-slate-500 mt-2 leading-relaxed">
                Computes days of cover, reorder thresholds, shelf-life expiry risk, holding costs, and total money at stake.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="w-8 h-8 rounded-xl bg-[#EEF4FF] text-[#5244E9] font-bold text-xs flex items-center justify-center mb-3">04</span>
              <h3 className="text-[16px] font-bold text-slate-900">Decide Actions</h3>
              <p className="text-[13px] text-slate-500 mt-2 leading-relaxed">
                Ranks candidate actions (Replenish, Markdown, Adjust Promo, Substitute) respecting business guardrails (max markdown 40%, min margin 15%).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="w-8 h-8 rounded-xl bg-[#EEF4FF] text-[#5244E9] font-bold text-xs flex items-center justify-center mb-3">05</span>
              <h3 className="text-[16px] font-bold text-slate-900">Act via Web & WhatsApp</h3>
              <p className="text-[13px] text-slate-500 mt-2 leading-relaxed">
                Dispatches 1-tap decision cards to store managers via Web Console and WhatsApp; creates Purchase Orders and price sheets.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="w-8 h-8 rounded-xl bg-[#EEF4FF] text-[#5244E9] font-bold text-xs flex items-center justify-center mb-3">06</span>
              <h3 className="text-[16px] font-bold text-slate-900">Measure & Backtest</h3>
              <p className="text-[13px] text-slate-500 mt-2 leading-relaxed">
                Replays holdout periods to prove AI Policy beats simple baseline policies across stockouts, excess inventory, and gross margin.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* WhatsApp Section */}
      <section id="whatsapp" className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-[1360px] mx-auto px-6 sm:px-12 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <div className="max-w-xl">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              Real-Time WhatsApp Bot
            </span>
            <h2 className="text-[28px] sm:text-[34px] font-bold text-[#0F172A] tracking-tight mt-1">
              Store Decisions Directly on WhatsApp
            </h2>
            <p className="mt-4 text-[15px] text-slate-600 leading-relaxed">
              Store managers are rarely in front of a computer. PulseRetail delivers decision cards directly to their phones with 1-tap Approve, Modify, and Reject triggers.
            </p>
            <div className="mt-6 space-y-3 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Ask: "Which items will run out this week?" for instant ranked summaries.</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Tap [Approve] to dispatch purchase orders immediately to suppliers.</span>
              </div>
            </div>
            <div className="mt-8">
              <button
                onClick={onLoginClick}
                className="bg-[#5244E9] hover:bg-[#4536db] text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-sm transition-all"
              >
                Test in Live Simulator
              </button>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-[32px] bg-slate-900 p-3 shadow-xl border-4 border-slate-800">
            <div className="bg-[#075E54] text-white p-3 rounded-t-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-400 text-slate-900 font-bold flex items-center justify-center text-xs">
                PR
              </div>
              <div>
                <div className="text-xs font-bold">PulseRetail Assistant</div>
                <div className="text-[10px] text-emerald-200">Online • AI Decision Agent</div>
              </div>
            </div>
            <div className="bg-[#ECE5DD] p-3 space-y-2.5 min-h-[300px] text-xs">
              <div className="bg-white rounded-lg p-2.5 shadow-sm border border-slate-200">
                <div className="font-bold text-amber-700 mb-1">CRITICAL STOCKOUT ALERT</div>
                <div className="text-[11px] text-slate-700">
                  <b>Royal Basmati Rice 5kg</b><br />
                  • Cover: 2.1 days | Supplier Lead: 6 days<br />
                  • Action: <b>Order 120 units by Tuesday</b><br />
                  • Money at Stake: <b>₹38,000 avoided loss</b>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5">
                  <button onClick={onLoginClick} className="bg-emerald-600 text-white font-semibold px-2 py-0.5 rounded text-[10px]">Approve</button>
                  <button onClick={onLoginClick} className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded text-[10px]">Modify</button>
                </div>
              </div>
              <div className="bg-[#DCF8C6] text-slate-800 p-2 rounded-lg ml-auto max-w-[80%] text-[11px]">
                Which items will run out this week?
              </div>
              <div className="bg-white text-slate-800 p-2 rounded-lg max-w-[85%] text-[11px]">
                📋 1. Basmati Rice (2.1d cover)<br />2. Sunflower Oil (3.8d cover)
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-100 py-8 px-6 sm:px-12 text-center text-xs text-slate-400">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
            <span>PulseRetail AI</span>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">Challenge 10</span>
          </div>
          <div>Autonomous Retail Decision Intelligence • Observe → Predict → Reason → Decide → Act → Measure</div>
        </div>
      </footer>

    </div>
  );
}
