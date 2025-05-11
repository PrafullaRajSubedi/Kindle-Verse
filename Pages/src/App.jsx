import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage.jsx';
import RegisterPage from './RegisterPage.jsx';
import ForgotPasswordPage from './ForgotPasswordPage.jsx';
import VerifyEmailPage from './VerifyEmailPage.jsx';
import Home from './Home.jsx';

// Determine a page key based on pathname
function usePageKey() {
  const { pathname } = useLocation();
  switch (pathname) {
    case '/login': return 'login';
    case '/register': return 'register';
    case '/forgot-password': return 'forgot-password';
    case '/verify-email': return 'verify-email';
    case '/home': return 'home';
    default: return 'login';
  }
}

// Tagline helpers
function getTagline(page) {
  switch (page) {
    case 'login': return 'Enter a World of Stories';
    case 'register': return 'Begin Your Literary Journey';
    case 'forgot-password': return 'Unlock Your Account';
    case 'verify-email': return 'One Step Closer';
    default: return 'Welcome to Kindle Verse';
  }
}
function getSubtagline(page) {
  switch (page) {
    case 'login': return 'Reconnect with your virtual bookshelf';
    case 'register': return 'Create your personal library in the cloud';
    case 'forgot-password': return 'Reset your key to the world of literature';
    case 'verify-email': return 'Your literary adventure awaits';
    default: return 'Your gateway to endless stories';
  }
}

export default function App() {
  return (
    <Router>
      <InnerApp />
    </Router>
  );
}

function InnerApp() {
  const page = usePageKey();
  const navigate = useNavigate();
  const tagline = getTagline(page);
  const subtag = getSubtagline(page);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 to-amber-50 flex flex-col">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-repeat opacity-5"
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 35 L50 15 L70 35 L50 55 Z\' fill=\'%230369a1\' fill-opacity=\'0.8\'/\%3E%3C/svg%3E")' }} />
        {/* Floating book icons */}
        <div className="absolute top-1/4 left-1/6 w-12 h-16 bg-blue-100 rounded-md shadow-md transform -rotate-12 opacity-30" />
        <div className="absolute top-2/3 left-1/4 w-16 h-20 bg-amber-100 rounded-md shadow-md transform rotate-6 opacity-30" />
        <div className="absolute top-1/3 right-1/6 w-14 h-18 bg-blue-200 rounded-md shadow-md transform rotate-12 opacity-30" />
        <div className="absolute bottom-1/4 right-1/5 w-10 h-14 bg-amber-200 rounded-md shadow-md transform -rotate-3 opacity-30" />
      </div>

      {/* Main Content - Two Column Layout */}
      <main className="flex-grow flex flex-col md:flex-row items-center justify-center p-4 py-8 md:py-0 relative z-10">
        {/* Left side: Illustration and tagline on desktop, hidden on mobile */}
        <div className="hidden md:flex md:w-1/2 md:h-screen bg-blue-700 bg-opacity-10 flex-col justify-center items-center p-12">
          <div className="max-w-md">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-900">{tagline}</h2>
            <p className="text-lg md:text-xl text-blue-800">{subtag}</p>
            {/* Decorative book stack illustration */}
            <div className="relative h-64 w-full">
              <div className="absolute bottom-0 left-8 w-32 h-40 bg-gradient-to-br from-blue-700 to-blue-800 rounded-r-md rounded-b-md shadow-lg transform -rotate-6" />
              <div className="absolute bottom-0 left-16 w-32 h-40 bg-gradient-to-br from-amber-500 to-amber-600 rounded-r-md rounded-b-md shadow-lg transform rotate-3" />
              <div className="absolute bottom-0 left-24 w-32 h-40 bg-gradient-to-br from-blue-500 to-blue-600 rounded-r-md rounded-b-md shadow-lg transform -rotate-2" />
              <div className="absolute bottom-0 left-32 w-32 h-40 bg-gradient-to-br from-amber-400 to-amber-500 rounded-r-md rounded-b-md shadow-lg transform rotate-1" />
            </div>
          </div>
        </div>

        {/* Right side: Form Container */}
        <div className="w-full md:w-1/2 flex justify-center items-center py-8 md:py-0">
          {/* Mobile only: Tagline */}
          <div className="md:hidden text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-blue-900">{tagline}</h2>
            <p className="text-lg text-blue-800">{subtag}</p>
          </div>

          {/* Router Routes */}
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
