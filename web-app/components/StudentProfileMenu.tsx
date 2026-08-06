'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  IoPersonCircleOutline,
  IoCallOutline,
  IoSchoolOutline,
  IoCalendarOutline,
  IoPersonOutline,
  IoPeopleOutline,
} from 'react-icons/io5';

interface StudentProfile {
  name: string;
  mobile: string;
  designation: string;
  status: string;
  dob: string;
  gender: string;
  guardian: string;
  className: string;
  sectionName: string;
}

export default function StudentProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = async () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);

    if (nextOpen && !profile) {
      setIsLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem('token');
        const res = await fetch('/api/student-profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || 'Failed to load profile');
        setProfile(body);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const initials = profile?.name
    ?.split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={handleToggle}
        className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
      >
        <IoPersonCircleOutline size={22} className="text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {isLoading ? (
            <div className="p-6 flex justify-center">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-[#5E3FE6] rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="p-5">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : profile ? (
            <>
              {/* Header — gradient banner + avatar */}
              <div className="bg-gradient-to-br from-[#5E3FE6] to-[#7B5CF0] px-5 pt-6 pb-8 relative">
                <span
                  className={`absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    profile.status === 'Active'
                      ? 'bg-green-400/20 text-green-100'
                      : 'bg-gray-400/20 text-gray-100'
                  }`}
                >
                  {profile.status}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg border-2 border-white/30">
                    {initials}
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg leading-tight">{profile.name}</p>
                    <p className="text-xs text-white/70 mt-0.5">{profile.designation}</p>
                  </div>
                </div>
              </div>

              {/* Class/Section pill — overlapping the header edge */}
              <div className="px-5 -mt-4 relative">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-2.5 flex items-center gap-2">
                  <IoSchoolOutline size={16} className="text-[#5E3FE6]" />
                  <span className="text-sm font-semibold text-gray-800">
                    Class {profile.className} - {profile.sectionName}
                  </span>
                </div>
              </div>

              {/* Detail rows */}
              <div className="px-5 py-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <IoCallOutline size={16} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Mobile</p>
                    <p className="text-sm text-gray-800 font-medium">{profile.mobile}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                    <IoCalendarOutline size={16} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Date of Birth</p>
                    <p className="text-sm text-gray-800 font-medium">
                      {new Date(profile.dob).toLocaleDateString('en-US', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center shrink-0">
                    <IoPersonOutline size={16} className="text-pink-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Gender</p>
                    <p className="text-sm text-gray-800 font-medium capitalize">{profile.gender.toLowerCase()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                    <IoPeopleOutline size={16} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Guardian</p>
                    <p className="text-sm text-gray-800 font-medium">{profile.guardian}</p>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}