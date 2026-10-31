import { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import { getStoredUser, clearAuthSession } from './services/auth';

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('signup') || hash.includes('login') || hash.includes('auth')) return 'auth';
      if (hash.includes('dashboard')) return 'dashboard';
    }
    return 'landing';
  });
  const [authMode, setAuthMode] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('signup')) return 'signup';
    return 'signin';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = getStoredUser();
    return saved || {
      name: 'Rithish',
      email: 'rithish@retailcorp.com',
      role: 'store_manager',
    };
  });

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '724191775115-ucph7ka0m8tgnnrm1r2r5gbob92qv5su.apps.googleusercontent.com';

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('signup')) {
        setAuthMode('signup');
        setCurrentView('auth');
      } else if (hash.includes('login') || hash.includes('auth')) {
        setAuthMode('signin');
        setCurrentView('auth');
      } else if (hash.includes('dashboard')) {
        setCurrentView('dashboard');
      } else if (hash === '' || hash === '#') {
        setCurrentView('landing');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenAuth = (mode = 'signin') => {
    setAuthMode(mode);
    setCurrentView('auth');
    window.location.hash = mode;
  };

  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
    setCurrentView('dashboard');
    window.location.hash = 'dashboard';
  };

  const handleLogout = () => {
    clearAuthSession();
    setCurrentUser({
      name: 'Rithish',
      email: 'rithish@retailcorp.com',
      role: 'store_manager',
    });
    setCurrentView('landing');
    window.location.hash = '';
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className={`bg-white ${currentView === 'auth' ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
        {currentView === 'landing' && (
          <LandingPage
            onLoginClick={() => handleOpenAuth('signin')}
            onSignupClick={() => handleOpenAuth('signup')}
          />
        )}

        {currentView === 'auth' && (
          <AuthPage
            initialMode={authMode}
            onAuthSuccess={handleAuthSuccess}
            onBackToHome={() => setCurrentView('landing')}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            currentUser={currentUser}
            onBackToLanding={handleLogout}
          />
        )}
      </div>
    </GoogleOAuthProvider>
  );
}
