'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface School {
  id: number;
  name: string;
  address: string | null;
}

export default function SelectSchoolPage() {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const userId = sessionStorage.getItem('userId');
        if (!token || !userId) {
          router.push('/');
          return;
        }

        const res = await fetch(`/api/schools?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch schools');
        const data = await res.json();
        setSchools(data);
        if (data.length === 1) setSelectedId(data[0].id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchools();
  }, [router]);

  const handleContinue = async () => {
    if (!selectedId) return;

    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch('/api/select-school', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ schoolId: selectedId }),
      });
      if (!res.ok) throw new Error('Failed to select school');

      const result = await res.json();
      sessionStorage.setItem('token', result.token); // re-issued token now carries schoolId

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans bg-white">

      {/* Left Panel: Branding — matches LoginPage exactly */}
      <div className="hidden lg:flex w-1/2 bg-[#0A192F] text-white flex-col justify-between p-16">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-white flex items-start">
            TUTOX<span className="text-xs font-normal ml-1 mt-1">TM</span>
          </h1>
          <p className="text-lg text-gray-300 mt-2 font-medium">Excel and Exceed</p>
        </div>
        <div className="mb-12">
          <p className="text-sm text-gray-400 italic leading-relaxed max-w-sm">
            "Education is not just about going to school and getting a degree. It's about widening
            your knowledge and absorbing the truth about life."
          </p>
          <p className="text-sm text-gray-500 mt-2">- Shakuntala Devi</p>
        </div>
      </div>

      {/* Right Panel: Select School Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="max-w-md w-full space-y-6">

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Select School</h2>
            <p className="text-sm text-gray-500 mt-2">Choose a school to proceed</p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200 flex items-start space-x-2">
              <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {isLoading ? (
            <p className="text-center text-gray-400 text-sm">Loading schools...</p>
          ) : schools.length === 0 ? (
            <p className="text-center text-gray-400 text-sm">No schools linked to this account.</p>
          ) : (
            <div className="space-y-4">
              {schools.map((school) => (
                <label
                  key={school.id}
                  className="flex flex-col border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedId === school.id}
                      onChange={() => setSelectedId(school.id)}
                      className="w-4 h-4"
                    />
                    <span className="font-semibold text-gray-900">{school.name}</span>
                  </div>
                  <div className="ml-7 mt-1">
                    <p className="text-xs text-gray-400">School ID</p>
                    <p className="text-sm text-gray-600 mt-0.5">{school.address}</p>
                  </div>
                </label>
              ))}
            </div>
          )}

          <button
            onClick={handleContinue}
            disabled={!selectedId}
            className="w-full bg-[#0A192F] hover:bg-[#122b4f] disabled:bg-gray-400 text-white font-medium py-2.5 px-4 rounded-lg shadow transition-colors duration-200"
          >
            CONTINUE
          </button>

          <p className="text-center text-sm text-gray-500">
            Having issues?{' '}
            <span className="underline cursor-pointer text-gray-700 font-medium">Contact Support</span>
          </p>
        </div>
      </div>

    </div>
  );
}