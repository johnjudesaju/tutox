'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  // State management: Initialized to empty strings to capture real-time user input
  const [mobileNo, setMobileNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password modal state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetMobile, setResetMobile] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [isResetLoading, setIsResetLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: mobileNo, password }),
      });

      const text = await response.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        // Response wasn't valid JSON — treat as a real server error, not a login failure
        setError('Something went wrong. Please try again.');
        return;
      }

      if (response.ok) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('userId', String(data.user.id));

        const roles: string[] = data.user?.role ?? [];

        if (roles.includes('Student')) {
          router.push('/student-dashboard');
        } else if (roles.includes('/teacher-dashboard')) {
          router.push('/dashboard/teacher');
        } else {
          router.push('select-school');
        }
      } else {
        setError(data.message || 'Incorrect username or password');
      }
    } catch (err) {
      console.error('Login request failed:', err); // <-- surface it instead of hiding it
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openForgotPassword = () => {
    setResetMobile(mobileNo); // carry over what they already typed, if anything
    setResetError(null);
    setResetSuccess(null);
    setShowForgotPassword(true);
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setResetError(null);
    setResetSuccess(null);
    setIsResetLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetSuccess(null);
    setIsResetLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: resetMobile }),
      });

      const text = await response.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        setResetError('Something went wrong. Please try again.');
        return;
      }

      if (response.ok) {
        setResetSuccess(
          data.message || 'If that mobile number is registered, password reset instructions have been sent.'
        );
      } else {
        setResetError(data.message || 'Unable to process your request. Please try again.');
      }
    } catch (err) {
      console.error('Forgot password request failed:', err);
      setResetError('Something went wrong. Please try again.');
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans bg-white">

      {/* Left Panel: Branding & Graphic Layout */}
      <div className="hidden lg:flex w-1/2 bg-[#0A192F] text-white flex-col justify-between p-16">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-white flex items-start">
            TUTOX<span className="text-xs font-normal ml-1 mt-1">TM</span>
          </h1>
          <p className="text-lg text-gray-300 mt-2 font-medium">Excel and Exceed</p>
        </div>
        <div className="mb-12" />
      </div>

      {/* Right Panel: Interactive Form Interface */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="max-w-md w-full space-y-6">

          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Sign In</h2>
            <p className="text-sm text-gray-500 mt-2">Access your portal using your registered credentials.</p>
          </div>

          {/* Dynamic Error Messaging Container */}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200 flex items-start space-x-2 transition-all duration-200">
              <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">

            {/* Mobile Input Field */}
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                id="mobile"
                type="text"
                required
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0A192F] focus:border-transparent transition-colors"
                placeholder="Enter your mobile number"
              />
            </div>

            {/* Password Input Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0A192F] focus:border-transparent transition-colors"
                placeholder="Enter your password"
              />
            </div>

            {/* Submission Trigger */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0A192F] hover:bg-[#122b4f] disabled:bg-gray-400 text-white font-medium py-2.5 px-4 rounded-lg shadow transition-colors duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A192F]"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verifying details...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={openForgotPassword}
                className="text-sm font-medium text-[#0A192F] hover:underline focus:outline-none"
              >
                Forgot password?
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={closeForgotPassword}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Reset your password</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Enter your registered mobile number and we&apos;ll send reset instructions.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForgotPassword}
                aria-label="Close"
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {resetError && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                {resetError}
              </div>
            )}

            {resetSuccess ? (
              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200">
                {resetSuccess}
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label htmlFor="reset-mobile" className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    id="reset-mobile"
                    type="text"
                    required
                    value={resetMobile}
                    onChange={(e) => setResetMobile(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0A192F] focus:border-transparent transition-colors"
                    placeholder="Enter your mobile number"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isResetLoading}
                  className="w-full bg-[#0A192F] hover:bg-[#122b4f] disabled:bg-gray-400 text-white font-medium py-2.5 px-4 rounded-lg shadow transition-colors duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A192F]"
                >
                  {isResetLoading ? 'Sending...' : 'Send reset instructions'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}