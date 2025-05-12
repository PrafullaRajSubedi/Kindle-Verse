import React, { useState } from 'react';
import { Mail, CheckCircle, ArrowLeft, Key, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import ErrorAlert from './ErrorAlert'; // Import the ErrorAlert component

export default function ForgotPasswordPage() {
  // Flow states
  const [currentStep, setCurrentStep] = useState('request'); // 'request', 'verify', 'newPassword', 'success'
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRequestSubmit = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5126/api/auth/forgot-password', { email });
      setLoading(false);
      setCurrentStep('verify');
    } catch (err) {
      setLoading(false);
      console.error('Forgot password error:', err);
      setError(
        err.response?.data ||
        (err.request
          ? 'No response from the server. Please check your network connection.'
          : 'An error occurred while processing your request. Please try again.')
      );
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    if (value.length <= 1) {
      const newOtp = [...otpCode];
      newOtp[index] = value;
      setOtpCode(newOtp);
      if (value && index < 5) {
        const next = document.getElementById(`otp-${index + 1}`);
        if (next) next.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text/plain').trim();
    if (/^\d{6}$/.test(paste)) {
      setOtpCode(paste.split(''));
      const last = document.getElementById('otp-5');
      if (last) last.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const fullOtp = otpCode.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter all 6 digits of the verification code');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5126/api/auth/verify-email', { email, otp: fullOtp });
      setLoading(false);
      setCurrentStep('newPassword');
    } catch (err) {
      setLoading(false);
      console.error('Verification failed:', err);
      setError(
        err.response?.status === 401
          ? 'Invalid verification code. Please check and try again.'
          : err.response?.data || 'Verification failed. Please try again.'
      );
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setError('Email address is missing.');
      return;
    }
    setResendLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5126/api/auth/resend-otp', { email });
      alert('A new verification code has been sent to your email.');
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Failed to resend code. Try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!password) return setError('Please enter a new password');
    if (password.length < 8) return setError('Password must be at least 8 characters long');
    if (password !== confirmPassword) return setError("Passwords don't match");

    setError('');
    setLoading(true);
    try {
      await axios.post('http://localhost:5126/api/auth/reset-password', {
        email,
        otp: otpCode.join(''),
        newPassword: password,
      });
      setLoading(false);
      setCurrentStep('success');
    } catch (err) {
      setLoading(false);
      console.error('Password reset failed:', err);
      setError(err.response?.data || 'Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-xl px-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all">
        <div className="px-10 pt-10 pb-6">
          {currentStep === 'request' && (
            <><h2 className="text-4xl font-bold text-gray-800 mb-2">Reset Password</h2><p className="text-gray-600 text-lg">We'll send you a verification code to reset your password</p></>
          )}
          {currentStep === 'verify' && (
            <><h2 className="text-4xl font-bold text-gray-800 mb-2">Verify Email</h2><p className="text-gray-600 text-lg">Enter the verification code sent to {email}</p></>
          )}
          {currentStep === 'newPassword' && (
            <><h2 className="text-4xl font-bold text-gray-800 mb-2">Create New Password</h2><p className="text-gray-600 text-lg">Please enter your new password</p></>
          )}
          {currentStep === 'success' && (
            <><h2 className="text-4xl font-bold text-gray-800 mb-2">Password Reset</h2><p className="text-gray-600 text-lg">Your password has been successfully reset</p></>
          )}
        </div>

        <div className="p-10 pt-6">
          {currentStep === 'request' && (
            <div className="space-y-6">
              {/* Error Alert */}
              <ErrorAlert message={error} onDismiss={() => setError('')} />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="email" className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm transition" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>
              <button onClick={handleRequestSubmit} disabled={loading} className={`w-full flex justify-center py-4 px-5 border border-transparent rounded-xl shadow text-sm font-medium text-white ${loading ? 'bg-blue-500 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800 cursor-pointer'} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition duration-200`}>{loading ? 'Sending...' : 'Confirm Email'}</button>
            </div>
          )}

          {currentStep === 'verify' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4"><Mail className="h-8 w-8 text-blue-700" /></div>
                <p className="text-lg text-gray-600">We've sent a verification code to your email address. Please enter the code below.</p>
              </div>
              
              {/* Error Alert */}
              <ErrorAlert message={error} onDismiss={() => setError('')} />
              
              <div className="flex justify-center gap-4 mb-6">
                {otpCode.map((digit, idx) => (
                  <input key={idx} id={`otp-${idx}`} type="text" inputMode="numeric" maxLength="1" value={digit} onChange={e => handleOtpChange(idx, e.target.value)} onKeyDown={e => handleOtpKeyDown(idx, e)} onPaste={idx === 0 ? handleOtpPaste : undefined} className="w-16 h-16 text-center border border-gray-200 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg bg-gray-50" />
                ))}
              </div>
              <button onClick={handleVerifyOtp} disabled={loading} className={`w-full flex justify-center py-4 px-5 border border-transparent rounded-xl shadow text-sm font-medium text-white ${loading ? 'bg-blue-500 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800 cursor-pointer'} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition duration-200`}>{loading ? 'Verifying...' : 'Verify Code'}</button>
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">Didn't receive the code?{' '}
                  <button
                    onClick={handleResendOtp}
                    disabled={resendLoading}
                    className={`font-medium ${resendLoading
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-700 hover:text-blue-800 cursor-pointer'
                      }`}
                  >
                    {resendLoading ? 'Sending…' : 'Resend'}
                  </button>
                </p>
              </div>
            </div>
          )}

          {currentStep === 'newPassword' && (
            <div className="space-y-6">
              {/* Error Alert */}
              <ErrorAlert message={error} onDismiss={() => setError('')} />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Key className="h-5 w-5 text-gray-400" /></div>
                  <input type={showPassword ? 'text' : 'password'} className="block w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm transition" placeholder="Enter new password" value={password} onChange={e => setPassword(e.target.value)} />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center"><button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div>
                </div>
                <p className="mt-2 text-xs text-gray-500">Password must be at least 8 characters long</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                  <input type={showConfirmPassword ? 'text' : 'password'} className="block w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm transition" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center"><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-400 hover:text-gray-600">{showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div>
                </div>
              </div>
              <button onClick={handlePasswordSubmit} disabled={loading} className={`w-full flex justify-center py-4 px-5 border border-transparent rounded-xl shadow text-sm font-medium text-white ${loading ? 'bg-blue-500 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800 cursor-pointer'} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition duration-200`}>{loading ? 'Updating...' : 'Change Password'}</button>
            </div>
          )}

          {currentStep === 'success' && (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4"><CheckCircle className="h-10 w-10 text-green-600" /></div>
              <h3 className="text-2xl font-medium text-gray-900 mb-4">Password Changed</h3>
              <p className="text-lg text-gray-600 mb-8">Your password has been successfully updated.</p>
              <Link to="/login" className="w-full flex justify-center py-4 px-5 border border-transparent rounded-xl shadow text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 cursor-pointer transition duration-200">Return to Login</Link>
            </div>
          )}

          {currentStep !== 'success' && (
            <div className="mt-8 text-center">
              <Link to="/login" className="text-sm font-medium text-blue-700 hover:text-blue-800 cursor-pointer flex items-center justify-center mx-auto">
                <ArrowLeft className="mr-2 h-5 w-5" />Back to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}