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
  ArrowLeft
} from 'lucide-react';

export default function Dashboard({ currentUser = { name: 'Rithish', email: 'user@college.edu', role: 'student' }, onBackToLanding }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all-reviews');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const roleLabels = {
    student: 'Student',
    canteen_manager: 'Canteen Manager',
    admin: 'Administrator',
  };

  const currentRoleLabel = roleLabels[currentUser.role] || currentUser.role || 'Member';
  const initial = (currentUser.name || 'U').charAt(0).toUpperCase();

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

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsProfileDropdownOpen(false);
        setIsNotificationOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    {
      id: 'overview',
      name: 'Overview',
      icon: LayoutGrid,
    },
    {
      id: 'ai-insights',
      name: 'AI Insights',
      icon: Sparkles,
    },
    {
      id: 'all-reviews',
      name: 'All Reviews',
      customIcon: (
        <svg className="w-[18px] h-[18px]" viewBox="0 0 20 20" fill="none" stroke="currentColor">
          <rect x="2.5" y="3.5" width="15" height="13" rx="2.5" strokeWidth="1.6" />
          <path d="M6 7.5H14" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M6 11.5H11" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'reports',
      name: 'Reports',
      icon: BarChart3,
    },
  ];

  const currentTabName = navItems.find((item) => item.id === activeTab)?.name || 'All Reviews';

  return (
    <div className="min-h-screen bg-[#FDFDFE] flex flex-col lg:flex-row font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      
      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 ease-in-out"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 p-5 overflow-y-auto">
          {/* Logo Header */}
          <div className="flex items-center justify-between pb-7 pt-1 px-1">
            <div className="flex items-center gap-3 select-none">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="4" y="11" width="3.2" height="9" rx="1.6" />
                  <rect x="10.4" y="4" width="3.2" height="16" rx="1.6" />
                  <rect x="16.8" y="8" width="3.2" height="12" rx="1.6" />
                </svg>
              </div>

              <div className="flex flex-col">
                <span className="text-[17px] font-[800] text-slate-900 tracking-tight leading-tight">
                  VoiceOfCustomer
                </span>
                <span className="text-[9.5px] font-[700] text-slate-400 tracking-[0.14em] uppercase leading-tight mt-0.5">
                  FEEDBACK INTELLIGENCE
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section: Workspace */}
          <div className="mt-2">
            <div className="text-[11px] font-[700] text-slate-400 uppercase tracking-wider px-3 mb-2.5">
              Workspace
            </div>

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
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-150 text-left ${
                      isActive
                        ? 'bg-[#EEF4FF] text-[#2563EB] font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`${isActive ? 'text-[#2563EB]' : 'text-slate-400'}`}>
                      {item.customIcon ? item.customIcon : <Icon className="w-[18px] h-[18px] stroke-[2]" />}
                    </span>
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Optional back to landing page */}
        {onBackToLanding && (
          <div className="p-4 border-t border-slate-50">
            <button
              onClick={onBackToLanding}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50/60 rounded-xl transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Landing Page</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 px-4 sm:px-8 border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5 stroke-[2.2]" />
            </button>

            <nav className="flex items-center gap-2 text-[14px]">
              <span className="text-slate-400 font-medium hover:text-slate-600 transition-colors cursor-pointer">
                Workspace
              </span>
              <span className="text-slate-300 font-light select-none">/</span>
              <span className="text-slate-900 font-bold tracking-tight">
                {currentTabName}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  setIsProfileDropdownOpen(false);
                }}
                className="w-9 h-9 rounded-full bg-[#F0F5FF] hover:bg-[#E2ECFF] active:scale-95 transition-all flex items-center justify-center text-[#2563EB]"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4 fill-[#2563EB]/15 stroke-[2.2]" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 py-3 px-3 z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800">Notifications</span>
                    <span className="text-[10px] text-blue-600 font-medium cursor-pointer hover:underline">Mark all as read</span>
                  </div>
                  <div className="p-2 bg-blue-50/50 rounded-lg text-left">
                    <p className="text-[11px] font-semibold text-slate-800">Workspace Ready</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Your VoiceOfCustomer environment is connected and active.</p>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileDropdownOpen(!isProfileDropdownOpen);
                  setIsNotificationOpen(false);
                }}
                className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full hover:bg-slate-50 border border-slate-100 transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#E0EDFF] text-[#2563EB] font-bold text-[13px] flex items-center justify-center select-none overflow-hidden">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    initial
                  )}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 stroke-[2.2]" />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3.5 py-2.5 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
                      <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
                        {currentRoleLabel}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{currentUser.email}</p>
                  </div>
                  <div className="py-1 text-slate-700 text-xs">
                    <button className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 text-left">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Account Settings</span>
                    </button>
                    <button className="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-slate-50 text-left">
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <span>Preferences</span>
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
        <main className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-center">
          <div className="w-full max-w-4xl border-2 border-dashed border-slate-200/80 rounded-2xl min-h-[460px] flex flex-col items-center justify-center p-8 text-center bg-white/50">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 shadow-xs">
              <CreditCard className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {currentTabName} Workspace
            </h3>
            <p className="text-sm text-slate-400 max-w-sm mt-1">
              The navigation and responsive header are active. Build your reviews table, insights view, or dashboard components here.
            </p>
          </div>
        </main>
      </div>

    </div>
  );
}
