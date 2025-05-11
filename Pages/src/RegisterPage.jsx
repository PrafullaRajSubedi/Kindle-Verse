import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import ErrorAlert from './ErrorAlert'; // Import the ErrorAlert component

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    // Form validation
    if (!firstName || !lastName || !email || !password) {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms and Conditions');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:5126/api/auth/register',
        { firstName, lastName, email, password, confirmPassword }
      );

      console.log('Registration successful:', response.data);
      localStorage.setItem('registrationEmail', email);
      navigate('/verify-email', { state: { email: response.data.email } });
    } catch (err) {
      console.error('Registration failed:', err);
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
          setError('Registration failed, please try again.');
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

  return (
    <div className="w-full max-w-xl px-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all">
        {/* Header */}
        <div className="px-10 pt-10 pb-6">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Create Account</h2>
          <p className="text-gray-600 text-lg">Join Kindle Verse and explore a world of books</p>
        </div>

        {/* Form */}
        <div className="p-10 pt-6">
          <div className="space-y-6">
            {/* Error Alert */}
            <ErrorAlert message={error} onDismiss={() => setError('')} />
            
            {/* First & Last Name */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-3">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm transition"
                    placeholder="John"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-3">Last Name</label>
                <input
                  type="text"
                    className="block w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm transition"
                    placeholder="Doe"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
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
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
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
                  onChange={e => setPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="block w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm transition"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-400 hover:text-gray-600">
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-center">
              <input id="terms" name="terms" type="checkbox" className="h-5 w-5 text-blue-700 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} />
              <label htmlFor="terms" className="ml-3 block text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="font-medium text-blue-700 hover:text-blue-800">
                  Terms and Conditions
                </Link>
              </label>
            </div>

            {/* Register Button */}
            <button onClick={handleRegister} disabled={loading} className={`w-full flex justify-center py-4 px-5 border border-transparent rounded-xl shadow text-sm font-medium text-white ${loading ? 'bg-blue-500 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800 cursor-pointer'} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition duration-200`}>{loading ? 'Creating Account...' : 'Create Account'}</button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">Already have an account?{' '}<Link to="/login" className="font-medium text-blue-700 hover:text-blue-800">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}