'use client';

import React from 'react';
import LogoutButton from '@/components/LogoutButton';

export default function TeacherDashboardPage() {
  return (
    <div className="min-h-screen bg-[#F9FBFD] p-6 text-gray-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold">Teacher Dashboard</h2>
          <LogoutButton />
        </div>

        {/* Placeholder content */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex flex-col items-center justify-center text-center space-y-2">
          <p className="text-lg font-semibold text-gray-700">Coming Soon</p>
          <p className="text-sm text-gray-400 max-w-sm">
            The teacher dashboard is under construction. Check back soon for attendance tools, class schedules, and student insights.
          </p>
        </div>

      </div>
    </div>
  );
}