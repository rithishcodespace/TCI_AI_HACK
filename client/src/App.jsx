import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'dashboard'

  return (
    <>
      {currentView === 'landing' ? (
        <LandingPage 
          onLoginClick={() => setCurrentView('dashboard')}
          onSignupClick={() => setCurrentView('dashboard')}
        />
      ) : (
        <Dashboard 
          onBackToLanding={() => setCurrentView('landing')}
        />
      )}
    </>
  );
}
