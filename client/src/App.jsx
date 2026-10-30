import React, { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'dashboard'
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: 'signin', // 'signin' | 'signup'
  });

  const [currentUser, setCurrentUser] = useState({
    name: 'Rithish',
    email: 'you@college.edu',
    role: 'student',
  });

  // Google OAuth Client ID from .env, or fallback client ID for local dev
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1088461528574-dummyclientidforvoiceofcustomer.apps.googleusercontent.com';

  const handleOpenAuth = (mode = 'signin') => {
    setAuthModal({
      isOpen: true,
      mode: mode,
    });
  };

  const handleCloseAuth = () => {
    setAuthModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
    handleCloseAuth();
    setCurrentView('dashboard');
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="relative min-h-screen">
        {currentView === 'landing' ? (
          <LandingPage 
            onLoginClick={() => handleOpenAuth('signin')}
            onSignupClick={() => handleOpenAuth('signup')}
          />
        ) : (
          <Dashboard 
            currentUser={currentUser}
            onBackToLanding={() => setCurrentView('landing')}
          />
        )}

        {/* Floating Auth Modal Overlay */}
        <AuthModal 
          isOpen={authModal.isOpen}
          initialMode={authModal.mode}
          onClose={handleCloseAuth}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    </GoogleOAuthProvider>
  );
}
