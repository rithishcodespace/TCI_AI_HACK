import React, { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'auth' | 'dashboard'
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'

  const [currentUser, setCurrentUser] = useState({
    name: 'Rithish',
    email: 'you@college.edu',
    role: 'student',
  });

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1088461528574-dummyclientidforvoiceofcustomer.apps.googleusercontent.com';

  const handleOpenAuth = (mode = 'signin') => {
    setAuthMode(mode);
    setCurrentView('auth');
  };

  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
    setCurrentView('dashboard');
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="min-h-screen bg-white">
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
            onBackToLanding={() => setCurrentView('landing')}
          />
        )}
      </div>
    </GoogleOAuthProvider>
  );
}
