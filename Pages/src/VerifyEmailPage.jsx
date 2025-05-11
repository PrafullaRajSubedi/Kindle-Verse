import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import ErrorAlert from './ErrorAlert'; // Import the ErrorAlert component

export default function VerifyEmailPage() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve email from URL state or localStorage
  useEffect(() => {
    const stateEmail = location.state?.email;
    if (stateEmail) {
      setEmail(stateEmail);
    } else {
      const storedEmail = localStorage.getItem('registrationEmail');
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        setError('Email not found. Please register again.');
      }
    }
  }, [location.state]);

  const handleChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        const next = document.getElementById(`code-${index + 1}`);
        if (next) next.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prev = document.getElementById(`code-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  const handlePaste = e => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text/plain').trim();
    if (/^\d{6}$/.test(pasted)) {
      setCode(pasted.split(''));
      const last = document.getElementById('code-5');
      if (last) last.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = code.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }
    if (!email) {
      setError('Email address is missing. Please try registering again.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5126/api/auth/verify-email', { email, otp: otpCode });
      setVerified(true);
      localStorage.removeItem('registrationEmail');
    } catch (err) {
      console.error('Verification failed:', err);
      setError(
        err.response?.status === 401
          ? 'Invalid verification code. Please check and try again.'
          : err.response?.data || 'Verification failed. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError('Email address is missing. Please try registering again.');
      return;
    }
    setResendLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5126/api/auth/resend-otp', { email });
      alert('A new verification code has been sent to your email.');
    } catch (err) {
      console.error('Failed to resend code:', err);
      setError(err.response?.data || 'Failed to resend verification code. Please try again later.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl px-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all">
        <div className="px-10 pt-10 pb-6">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Verify Email</h2>
          <p className="text-gray-600 text-lg">Enter the verification code sent to {email || 'your email'}</p>
        </div>
        <div className="p-10 pt-6">
          {!verified ? (
            <>
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                  <Mail className="h-8 w-8 text-blue-700" />
                </div>
                <p className="text-lg text-gray-600">
                  We've sent a verification code to your email address. Please enter the code below.
                </p>
              </div>
              
              {/* Error Alert */}
              <ErrorAlert message={error} onDismiss={() => setError('')} />
              
              <div className="flex justify-center gap-4 mb-6">
                {code.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`code-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={e => handleChange(idx, e.target.value)}
                    onKeyDown={e => handleKeyDown(idx, e)}
                    onPaste={idx === 0 ? handlePaste : undefined}
                    className="w-16 h-16 text-center border border-gray-200 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg bg-gray-50"
                  />
                ))}
              </div>
              <button
                onClick={handleVerify}
                disabled={loading}
                className={`w-full flex justify-center py-4 px-5 border border-transparent rounded-xl shadow text-sm font-medium text-white ${
                  loading ? 'bg-blue-500 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800 cursor-pointer'
                } focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition duration-200`}
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?{' '}
                  <button
                    onClick={handleResendCode}
                    disabled={resendLoading}
                    className={`font-medium ${
                      resendLoading ? 'text-gray-400 cursor-not-allowed' : 'text-blue-700 hover:text-blue-800 cursor-pointer'
                    }`}
                  >
                    {resendLoading ? 'Sending...' : 'Resend'}
                  </button>
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-medium text-gray-900 mb-4">Email Verified</h3>
              <p className="text-lg text-gray-600 mb-8">Your email has been successfully verified.</p>
              <Link
                to="/login"
                className="w-full flex justify-center items-center py-4 px-5 border border-transparent rounded-xl shadow text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 cursor-pointer transition duration-200"
              >
                Continue to Login
              </Link>
            </div>
          )}
          <div className="mt-8 text-center">
            <Link to="/login" className="text-sm font-medium text-blue-700 hover:text-blue-800 cursor-pointer flex items-center justify-center mx-auto">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}