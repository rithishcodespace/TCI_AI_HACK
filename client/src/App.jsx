import { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import { getStoredUser, clearAuthSession } from './services/auth';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'auth' | 'dashboard'
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = getStoredUser();
    return saved || {
      name: 'Rithish',
      email: 'you@college.edu',
      role: 'student',
    };
  });

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '724191775115-ucph7ka0m8tgnnrm1r2r5gbob92qv5su.apps.googleusercontent.com';

  const handleOpenAuth = (mode = 'signin') => {
    setAuthMode(mode);
    setCurrentView('auth');
  };

  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    clearAuthSession();
    setCurrentUser({
      name: 'Rithish',
      email: 'you@college.edu',
      role: 'student',
    });
    setCurrentView('landing');
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
