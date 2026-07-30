'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  // Pre-filled mobile number as seen in the Figma export
  const [mobileNo, setMobileNo] = useState('9847953684'); 
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard'); 
  };

  return (
    <div className="min-h-screen flex w-full font-sans bg-white">
      
      {/* Left Panel: Branding & Quote */}
      <div className="hidden lg:flex w-1/2 bg-[#0A192F] text-white flex-col justify-between p-16">
        
        {/* Brand Header */}
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-white flex items-start">
            TUTOX
            <span className="text-xs font-normal ml-1 mt-1">TM</span>
          </h1>
          <p className="text-lg text-gray-300 mt-2 font-medium">Excel and Exceed</p>
        </div>

        {/* Motivational Quote */}
        <div className="mb-12">
          <p className="text-2xl leading-relaxed font-light text-gray-200">
            "Education is not just about going to school and getting a degree. It's about widening your knowledge and absorbing the truth about life."
          </p>
          <p className="mt-6 text-lg font-semibold text-white">
            Shakuntala Devi
          </p>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
          
          {/* Form Header */}
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Sign-in to School Magic
            </h2>
            <p className="text-sm text-gray-500 mt-3">
              Enter your mobile no and password to login
            </p>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label 
                htmlFor="mobileNo" 
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Mobile No
              </label>
              <input
                id="mobileNo"
                type="tel"
                required
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0A192F] focus:border-[#0A192F] outline-none transition-all text-gray-900 font-medium"
                placeholder="Enter mobile number"
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0A192F] focus:border-[#0A192F] outline-none transition-all text-gray-900"
                placeholder="Enter password"
              />
            </div>

            {/* Keep me logged in */}
            <div className="flex items-center mt-2">
              <input
                id="keep-logged-in"
                type="checkbox"
                className="h-4 w-4 text-[#0A192F] focus:ring-[#0A192F] border-gray-300 rounded cursor-pointer"
              />
              <label 
                htmlFor="keep-logged-in" 
                className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
              >
                Keep me logged in
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#0A192F] text-white font-bold text-sm tracking-wide py-4 px-4 rounded-lg hover:bg-[#112240] transition-colors shadow-md mt-4"
            >
              SIGN IN
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center mt-8">
            <button type="button" className="text-sm font-semibold text-[#0A192F] hover:underline">
              Trouble in login? Request Access
            </button>
          </div>
          
        </div>
      </div>
      
    </div>
  );
}