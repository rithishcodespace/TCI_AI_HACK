import React, { useState } from 'react';
import { 
  ChevronDown, 
  Share2, 
  Bell, 
  Menu,
  X
} from 'lucide-react';

export default function LandingPage({ onLoginClick, onSignupClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900 font-sans antialiased overflow-x-hidden">
      
      {/* Top Navigation */}
      <header className="w-full max-w-[1360px] mx-auto px-6 sm:px-12 pt-7 pb-6 flex items-center justify-between relative z-30">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer select-none">
          {/* Custom Syncly Helix/Loop Logo */}
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
          <span className="text-[21px] font-[800] tracking-tight text-[#0F172A]">
            VoiceOfCustomer
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-10 text-[15px] font-medium text-[#1E293B]">
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-indigo-600 transition-colors group">
            <span>Product</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors stroke-[2.2]" />
          </div>
          <a href="#solution" className="hover:text-indigo-600 transition-colors">
            Solution
          </a>
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-indigo-600 transition-colors group">
            <span>Resources</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors stroke-[2.2]" />
          </div>
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
            Sign up
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
            <nav className="flex flex-col gap-3 text-[16px] font-medium text-slate-700">
              <a href="#product" className="py-1 hover:text-indigo-600">Product</a>
              <a href="#solution" className="py-1 hover:text-indigo-600">Solution</a>
              <a href="#resources" className="py-1 hover:text-indigo-600">Resources</a>
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
                Sign up
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Hero Section */}
      <main className="w-full max-w-[1360px] mx-auto px-6 sm:px-12 pt-8 sm:pt-14 pb-16 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-5 flex flex-col items-start text-left z-10 lg:pr-2">
            <h1 className="text-[40px] sm:text-[50px] lg:text-[52px] font-[800] text-[#0F172A] tracking-[-0.03em] leading-[1.12]">
              Turn Customer Feedback <br />
              into Actionable Insights
            </h1>
            
            <p className="mt-6 text-[17px] text-[#64748B] leading-[1.65] font-normal max-w-[460px]">
              Uncover valuable insights with a customer-centric approach to enhance overall customer satisfaction, boost retention, and accelerate growth.
            </p>

            {/* Hero CTA Button */}
            <div className="mt-8">
              <button 
                onClick={onSignupClick}
                className="group relative overflow-hidden bg-[#5244E9] hover:bg-[#4536db] active:scale-[0.98] transition-all text-white font-medium text-[16px] px-7 py-3 rounded-xl shadow-[0_8px_20px_-4px_rgba(82,68,233,0.35)] flex items-center gap-3 cursor-pointer"
              >
                <div 
                  className="absolute inset-x-0 top-0 h-[48%] pointer-events-none opacity-25"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                    backgroundSize: '5px 5px'
                  }}
                />
                
                <span className="relative z-10 font-semibold tracking-[-0.01em]">Get Started Free</span>
                <span className="relative z-10 text-white/90 text-[18px] font-bold transition-transform group-hover:translate-x-1 duration-200">
                  ›
                </span>
              </button>
            </div>
          </div>

          {/* Right Hero Visuals / Platform Mockup */}
          <div className="lg:col-span-7 relative w-full flex items-center justify-center lg:justify-end pt-2 pb-10">
            
            {/* Ambient Radial Glow */}
            <div className="absolute w-[500px] h-[400px] bg-gradient-to-tr from-indigo-100/50 via-purple-50/40 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

            {/* Main Application Container */}
            <div className="relative w-full max-w-[620px] bg-white rounded-2xl border border-slate-200/80 shadow-[0_20px_50px_rgba(15,23,42,0.06)] overflow-visible">
              
              <div className="grid grid-cols-12 min-h-[365px]">
                
                {/* Left Panel: Taxonomy */}
                <div className="col-span-5 p-5 border-r border-slate-100 flex flex-col bg-white rounded-l-2xl">
                  <h3 className="text-[17px] font-bold text-slate-900 tracking-tight mb-3">
                    Taxonomy
                  </h3>

                  {/* Taxonomy Stats */}
                  <div className="grid grid-cols-2 gap-2 pb-4 mb-4 border-b border-slate-100">
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium tracking-tight">Total feedback</div>
                      <div className="text-[15px] font-bold text-slate-800 tracking-tight mt-0.5">245,234</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium tracking-tight">Analyzed issues</div>
                      <div className="text-[15px] font-bold text-slate-800 tracking-tight mt-0.5">135</div>
                    </div>
                  </div>

                  {/* Tree Navigation */}
                  <div className="space-y-2 text-[11px] font-medium text-slate-600">
                    <div className="relative">
                      <div className="border border-[#7C3AED] bg-[#FBF9FE] text-slate-800 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-[0_1px_3px_rgba(124,58,237,0.08)]">
                        <span className="text-[10px] text-slate-400 font-bold">›</span>
                        <span className="w-3.5 h-3.5 flex items-center justify-center text-[#7C3AED]">
                          <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm2 1v3h3V4H4zm5 0v3h3V4H9zM4 9v3h3V9H4zm5 0v3h3V9H9z"/>
                          </svg>
                        </span>
                        <span className="text-[11px] font-semibold text-slate-800">Customer Service</span>
                      </div>

                      <div className="ml-4 pl-3 border-l border-dashed border-slate-300 pt-2 space-y-2">
                        <div className="relative flex items-center">
                          <span className="absolute -left-3 top-1/2 w-2.5 border-t border-dashed border-slate-300" />
                          <div className="border border-slate-200/90 bg-white px-2.5 py-1 rounded-md text-[10px] text-slate-700 flex items-center gap-1 shadow-xs">
                            <span className="text-[9px] text-slate-400">›</span>
                            <span>Compensation</span>
                          </div>
                        </div>

                        <div className="ml-3 pl-2.5 border-l border-dashed border-slate-300 pt-1">
                          <div className="relative flex items-center">
                            <span className="absolute -left-2.5 top-1/2 w-2 border-t border-dashed border-slate-300" />
                            <div className="border border-slate-200/90 bg-white px-2 py-0.5 rounded text-[10px] text-slate-600 flex items-center gap-1 shadow-xs">
                              <span className="text-[9px] text-slate-400">›</span>
                              <span>Refund</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 space-y-2">
                      <div className="border border-slate-200/80 bg-white px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-600">
                        <span className="text-[10px] text-slate-400">›</span>
                        <span className="text-[11px] font-medium">App Interface</span>
                      </div>
                      <div className="border border-slate-200/80 bg-white px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-600">
                        <span className="text-[10px] text-slate-400">›</span>
                        <span className="text-[11px] font-medium">Privacy and Safety</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Feed Details */}
                <div className="col-span-7 p-5 bg-[#FBFBFC] flex flex-col justify-between rounded-r-2xl">
                  <div>
                    <div className="flex items-center justify-between pb-3">
                      <div className="flex items-center gap-1 text-slate-800 font-bold text-[14px]">
                        <span className="text-slate-400 font-semibold text-[15px]">#</span>
                        <span>Customer Service</span>
                      </div>
                      <button className="bg-[#5244E9] hover:bg-[#4637DB] transition-colors text-white text-[11px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm">
                        <Share2 className="w-2.5 h-2.5 stroke-[2.5]" />
                        <span>Share</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-5 border-b border-slate-200/80 text-[11px] pt-1">
                      <button className="font-bold text-slate-900 border-b-2 border-slate-900 pb-2 -mb-[1px]">
                        All feedback (42,430)
                      </button>
                      <button className="font-medium text-slate-400 hover:text-slate-600 pb-2">
                        Not classified 1,273 (3%)
                      </button>
                    </div>

                    <div className="mt-4 space-y-3.5">
                      <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="bg-[#EFF6FF] text-[#2563EB] text-[9px] font-bold px-1.5 py-0.5 rounded">
                            Issue-1
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          </div>
                        </div>
                        <div className="w-4/5 h-2 bg-slate-200/70 rounded-full" />
                        <div className="w-3/5 h-2 bg-slate-100 rounded-full" />
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="bg-[#EEF2FF] text-[#4F46E5] text-[9px] font-bold px-1.5 py-0.5 rounded">
                            Issue-2
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          </div>
                        </div>
                        <div className="w-full h-2 bg-slate-200/70 rounded-full" />
                        <div className="w-2/3 h-2 bg-slate-100 rounded-full" />
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-xs space-y-2 opacity-60">
                        <div className="flex items-center justify-between">
                          <span className="bg-[#F1F5F9] text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            Issue-3
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          </div>
                        </div>
                        <div className="w-3/4 h-2 bg-slate-200/70 rounded-full" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  </div>
                </div>
              </div>

              {/* OVERLAY CARD 1: Negative Feedback Alert */}
              <div className="absolute -bottom-8 -left-5 sm:-left-8 z-20 bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_20px_45px_rgba(15,23,42,0.12)] max-w-[320px] sm:max-w-[335px]">
                <div className="absolute -top-3.5 left-4 w-7 h-7 bg-[#FEF3C7] rounded-full flex items-center justify-center text-[#D97706] shadow-sm border border-amber-200/60">
                  <Bell className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>

                <div className="flex items-center gap-2 pt-1 mb-2">
                  <span className="text-[13px] font-[800] text-slate-900 tracking-tight">
                    32 negative feedback
                  </span>
                  <span className="bg-[#EEF2FF] text-[#4F46E5] text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                    <span>↑</span>
                    <span>56%</span>
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                  "Support staff was very supportive and professional,{' '}
                  <span className="bg-[#FFE4E6] text-[#E11D48] px-1 py-0.5 rounded font-medium">
                    but the app crashes ..."
                  </span>
                </p>
              </div>

              {/* OVERLAY CARD 2: Sentiment Stacked Bar Chart */}
              <div className="absolute -bottom-10 -right-4 sm:-right-8 z-20 bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_25px_50px_rgba(15,23,42,0.15)] w-[270px] sm:w-[295px]">
                <div className="absolute -top-3.5 right-4 z-30 bg-white rounded-full px-2 py-1 shadow-md border border-slate-100 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center text-white shadow-xs">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707a1 1 0 00-1.414-1.414A5.98 5.98 0 0110 9a5.98 5.98 0 01-2.293-1.121 1 1 0 10-1.414 1.414A7.98 7.98 0 0010 11a7.98 7.98 0 003.707-1.707z" clipRule="evenodd"/>
                    </svg>
                  </span>
                  <span className="w-5 h-5 rounded-full bg-[#F43F5E] flex items-center justify-center text-white shadow-xs">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-3.707-6.293a1 1 0 001.414 1.414A5.98 5.98 0 0110 12a5.98 5.98 0 012.293 1.121 1 1 0 001.414-1.414A7.98 7.98 0 0010 10a7.98 7.98 0 00-3.707 1.707z" clipRule="evenodd"/>
                    </svg>
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
                    <div style={{ width: '48%' }} className="bg-[#FF6565] h-full" />
                    <div style={{ width: '22%' }} className="bg-[#FBBF24] h-full" />
                    <div style={{ width: '30%' }} className="bg-[#2DD4BF] h-full" />
                  </div>

                  <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
                    <div style={{ width: '20%' }} className="bg-[#FF6565] h-full" />
                    <div style={{ width: '22%' }} className="bg-[#FBBF24] h-full" />
                    <div style={{ width: '18%' }} className="bg-[#CBD5E1] h-full" />
                    <div style={{ width: '40%' }} className="bg-[#2DD4BF] h-full" />
                  </div>

                  <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
                    <div style={{ width: '16%' }} className="bg-[#FF6565] h-full" />
                    <div style={{ width: '16%' }} className="bg-[#FBBF24] h-full" />
                    <div style={{ width: '68%' }} className="bg-[#2DD4BF] h-full" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[9px] font-medium text-slate-500 pt-4 mt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF6565]" />
                    <span>Negative</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FBBF24]" />
                    <span>Neutral</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
                    <span>Positive</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Social Proof / Footer Bar */}
      <footer className="w-full py-6 sm:py-8 bg-white border-t border-slate-100/60">
        <div className="max-w-[1360px] mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-7 text-center">
          <div className="flex items-center gap-2">
            <div className="w-[22px] h-[22px] bg-[#FF6600] rounded-[2px] flex items-center justify-center text-white font-bold text-[13px] leading-none select-none shadow-xs">
              Y
            </div>
            <span className="text-[15px] font-[600] text-[#D97706] tracking-tight">
              Backed by Y Combinator
            </span>
          </div>

          <div className="text-[15px] font-[500] text-[#64748B] tracking-tight">
            Trusted by True Customer-Centric Teams
          </div>
        </div>
      </footer>

    </div>
  );
}
