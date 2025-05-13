import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import ErrorAlert from './ErrorAlert'; // Import the ErrorAlert component

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home', { replace: true });
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleLogin = async () => {
    // Form validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(
        'http://localhost:5126/api/auth/login',
        { email, password }
      );

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user.id);
      navigate('/home');
    } catch (err) {
      console.error('Login failed:', err);
      if (err.response) {
        if (err.response.status === 404) {
          setError('API endpoint not found. Please make sure the server is running correctly.');
        } else if (err.response.data && typeof err.response.data === 'object') {
          const msgs = [];
          if (err.response.data.errors) {
            Object.values(err.response.data.errors).forEach(arr => msgs.push(arr[0]));
          } else {
            Object.values(err.response.data).forEach(val => {
              if (typeof val === 'string') msgs.push(val);
              else if (Array.isArray(val)) msgs.push(val.join('. '));
            });
          }
          setError(msgs.join('. '));
        } else if (typeof err.response.data === 'string') {
          setError(err.response.data);
        } else {
          setError('Invalid credentials. Please check your email and password.');
        }
      } else if (err.request) {
        setError('No response from server. Please check if the server is running.');
      } else {
        setError('An error occurred while sending the request.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-xl px-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all">
        <div className="px-10 pt-10 pb-6">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600 text-lg">Sign in to continue your reading journey</p>
        </div>

        <div className="p-10 pt-6">
          <div className="space-y-6">
            {/* Error Alert */}
            <ErrorAlert message={error} onDismiss={() => setError('')} />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm transition"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm transition"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleLogin();
                    }
                  }}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-700 cursor-pointer">
                  Remember me
                </label>
              </div>

              <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                Forgot password?
              </Link>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full flex justify-center py-4 px-5 border border-transparent rounded-xl shadow text-sm font-medium text-white ${
                loading ? 'bg-blue-500 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800 cursor-pointer'
              } focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition duration-200`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">New to Kindle Verse?</span>
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/register"
                className="w-full flex items-center justify-center px-5 py-4 border border-blue-700 rounded-xl shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 cursor-pointer transition duration-200"
              >
                Create an account
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}