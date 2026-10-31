import { useState } from 'react';
import { 
  X, 
  User, 
  ClipboardList, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Info
} from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  initialMode = 'signin',
  onAuthSuccess 
}) {
  const [mode, setMode] = useState(initialMode); // 'signin' | 'signup'
  const [selectedRole, setSelectedRole] = useState('store_manager');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState('');


  const roles = [
    {
      id: 'store_manager',
      title: 'Store Manager',
      description: 'Store replenishment',
      icon: User,
    },
    {
      id: 'supply_chain',
      title: 'Supply Chain Lead',
      description: 'Inventory & logistics',
      icon: ClipboardList,
    },
    {
      id: 'executive',
      title: 'Category Lead',
      description: 'Pricing & margins',
      icon: ShieldCheck,
    },
  ];

  // Google OAuth via useGoogleLogin (top level)
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const profile = await res.json();
        
        onAuthSuccess({
          name: profile.name || 'Google User',
          email: profile.email,
          avatar: profile.picture,
          role: selectedRole,
          provider: 'google'
        });
      } catch (err) {
        console.error('Google profile fetch error:', err);
        onAuthSuccess({
          name: 'Google User',
          email: 'user@college.edu',
          role: selectedRole,
          provider: 'google'
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google Sign In Error:', error);
      setNotification('Google Sign-In was cancelled or failed.');
    },
  });

  const handleGoogleClick = () => {
    try {
      loginWithGoogle();
    } catch (err) {
      console.error('Google trigger error:', err);
      setNotification('Could not open Google Sign-In.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setNotification('Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onAuthSuccess({
        name: fullName || (email.split('@')[0] || 'User'),
        email: email,
        role: selectedRole,
        provider: 'credentials',
      });
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200" 
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-[460px] bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(15,23,42,0.25)] border border-slate-100 p-6 sm:p-8 z-10 transition-all duration-200 animate-in fade-in zoom-in-95">
        
        {/* Top Header: Brand Logo & Close Button */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2.5">
            <svg className="w-7 h-7" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="modalGradient" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F43F5E" />
                  <stop offset="0.5" stopColor="#D946EF" />
                  <stop offset="1" stopColor="#6366F1" />
                </linearGradient>
              </defs>
              <path
                d="M13.5 8C17 4.5 22.5 4.5 26 8C29.5 11.5 29.5 17 26 20.5L21.5 25C19 27.5 15 27.5 12.5 25C10 22.5 10 18.5 12.5 16L18 10.5"
                stroke="url(#modalGradient)"
                strokeWidth="3.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22.5 28C19 31.5 13.5 31.5 10 28C6.5 24.5 6.5 19 10 15.5L14.5 11C17 8.5 21 8.5 23.5 11C26 13.5 26 17.5 23.5 20L18 25.5"
                stroke="url(#modalGradient)"
                strokeWidth="3.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[17px] font-[800] text-slate-900 tracking-tight">
              VoiceOfCustomer
            </span>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title and Subtitle */}
        <div className="mt-4">
          <h2 className="text-[21px] font-[800] text-slate-900 tracking-[-0.02em]">
            {mode === 'signin' ? 'Welcome to RetailSense' : 'Create an Account'}
          </h2>
          <p className="text-[13px] text-slate-500 mt-0.5">
            {mode === 'signin' 
              ? 'Sign in to continue to your workspace.' 
              : 'Sign up to coordinate connected retail decisions.'}
          </p>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200/80 rounded-xl text-[12px] text-amber-800 flex items-center justify-between">
            <span>{notification}</span>
            <button onClick={() => setNotification('')} className="text-amber-500 hover:text-amber-700">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Continue as (Role Selection) */}
        <div className="mt-5">
          <label className="block text-[12px] font-semibold text-slate-700 mb-2">
            Continue as
          </label>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
            {roles.map((role) => {
              const isSelected = selectedRole === role.id;
              const Icon = role.icon;

              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl transition-all duration-150 text-center cursor-pointer ${
                    isSelected
                      ? 'border-2 border-[#5244E9] bg-[#F5F3FF] shadow-xs'
                      : 'border border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className={`mb-1.5 ${isSelected ? 'text-[#5244E9]' : 'text-slate-600'}`}>
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className={`text-[11px] sm:text-[12px] font-bold leading-tight ${isSelected ? 'text-[#5244E9]' : 'text-slate-800'}`}>
                    {role.title}
                  </span>
                  <span className={`text-[9.5px] leading-tight mt-0.5 ${isSelected ? 'text-[#5244E9]/80 font-medium' : 'text-slate-400'}`}>
                    {role.description}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2.5 pl-0.5">
            <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>Your access and workspace are based on your selected role.</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          
          {/* Full Name field in Signup mode */}
          {mode === 'signup' && (
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#5244E9] focus:ring-2 focus:ring-[#5244E9]/15 transition-all"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">
              Email address
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#5244E9] focus:ring-2 focus:ring-[#5244E9]/15 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#5244E9] focus:ring-2 focus:ring-[#5244E9]/15 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {mode === 'signin' && (
              <div className="text-right mt-1.5">
                <button
                  type="button"
                  onClick={() => setNotification('Password reset link sent to your email.')}
                  className="text-[12px] font-semibold text-[#5244E9] hover:text-[#4536db] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#5244E9] hover:bg-[#4536db] active:scale-[0.99] text-white font-semibold text-[14px] py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all mt-4 cursor-pointer disabled:opacity-70"
          >
            <span>{isLoading ? 'Processing...' : (mode === 'signin' ? 'Sign in' : 'Create Account')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* OR Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="w-full border-t border-slate-200/80" />
          <span className="absolute bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            OR
          </span>
        </div>

        {/* Google Login Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={isLoading}
            className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-[13px] py-2.5 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-2xs hover:shadow-xs active:scale-[0.99] cursor-pointer"
          >
            {/* Multicolored Google Logo */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Bottom Switcher: Sign in / Sign up */}
        <div className="text-center mt-5 text-[12px] text-slate-500">
          {mode === 'signin' ? (
            <p>
              New to VoiceOfCustomer?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setNotification('');
                }}
                className="font-bold text-[#5244E9] hover:underline"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setNotification('');
                }}
                className="font-bold text-[#5244E9] hover:underline"
              >
                Sign in
              </button>
            </p>
          )}

          <p className="text-[10px] text-slate-400 mt-2">
            By continuing, you agree to our{' '}
            <a href="#terms" className="text-slate-600 underline">Terms of Service</a> and{' '}
            <a href="#privacy" className="text-slate-600 underline">Privacy Policy</a>.
          </p>
        </div>

      </div>

    </div>
  );
}
