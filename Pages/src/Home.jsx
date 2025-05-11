import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove JWT token from localStorage on logout
    localStorage.removeItem('token');
    // Redirect to the login page
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Home Page</h1>
      <button
        onClick={handleLogout}
        className="px-6 py-3 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition"
      >
        Logout
      </button>
    </div>
  );
}