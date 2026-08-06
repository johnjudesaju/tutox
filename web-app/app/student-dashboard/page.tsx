'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoSchoolOutline, IoWalletOutline, IoCartOutline, IoMenuOutline, IoNotificationsOutline } from 'react-icons/io5';
import { LuLaptop } from 'react-icons/lu';
import LogoutButton from '@/components/LogoutButton';
import StudentProfileMenu from '@/components/StudentProfileMenu';

interface StudentDashboardData {
  attendancePercent: number;
  weeklyBars: { week: string; value: number; color: string }[];
  fee: { overdue: number | null };
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          router.push('/');
          return;
        }

        const res = await fetch('/api/student-dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          router.push('/');
          return;
        }

        const body = await res.json();

        if (!res.ok) throw new Error(body.error || 'Failed to fetch dashboard data');

        setData(body);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (isLoading) {
    return <div className="p-6 text-sm text-gray-500">Loading dashboard...</div>;
  }

  if (error || !data) {
    return <div className="p-6 text-sm text-red-600">{error || 'Failed to load dashboard.'}</div>;
  }

  return (
    <div className="min-h-screen bg-[#F9FBFD] p-6 text-gray-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div className="flex items-center space-x-3">
  <button className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
    <IoNotificationsOutline size={22} className="text-gray-600" />
  </button>
  <StudentProfileMenu />
  <LogoutButton />
</div>
          
        </div>

        {/* Icon Tabs — static, no schema backing */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="flex items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mr-4">
              <IoSchoolOutline size={24} color="#EA4335" />
            </div>
            <span className="font-semibold text-gray-700">School</span>
          </div>
          <div className="flex items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mr-4">
              <IoWalletOutline size={24} color="#4285F4" />
            </div>
            <span className="font-semibold text-gray-700">fee pay</span>
          </div>
          <div className="flex items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mr-4">
              <LuLaptop size={24} color="#34A853" />
            </div>
            <span className="font-semibold text-gray-700">Tutox Learn</span>
          </div>
          <div className="flex items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center mr-4">
              <IoCartOutline size={24} color="#FBBC05" />
            </div>
            <span className="font-semibold text-gray-700">Store</span>
          </div>
        </div>
        

        {/* Main Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-[#5E3FE6] text-white p-6 rounded-2xl flex flex-col justify-between min-h-[200px] shadow-sm relative overflow-hidden">
            <div>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium">Class</span>
              <h3 className="font-bold text-xl mt-4 leading-snug max-w-xl">
                English Class Test on 18 January
              </h3>
            </div>
            <div className="flex justify-between items-center mt-6">
              <span className="text-xs font-semibold uppercase tracking-wider bg-black/20 px-4 py-2 rounded-xl">
                Scheduled
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
            <div className="bg-[#FFB017] text-white p-5 rounded-2xl flex flex-col justify-between min-h-[94px] shadow-sm">
              <span className="text-xs font-medium opacity-90">Attendance</span>
              <div className="flex justify-between items-end">
                <h4 className="text-2xl font-bold">{data.attendancePercent}%</h4>
                <p className="text-xs opacity-80">
                  {data.attendancePercent >= 75 ? 'Good job this week!' : 'Keep it up!'}
                </p>
              </div>
            </div>

            <div className="bg-[#FF5B5B] text-white p-5 rounded-2xl flex flex-col justify-between min-h-[94px] shadow-sm">
              <div>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">Fee</span>
                <h4 className="text-sm font-semibold mt-2">
                  {data.fee.overdue ? 'Overdue Fee' : 'No Pending Fee'}
                </h4>
              </div>
              <p className="text-base font-bold mt-1">
                {data.fee.overdue ? `₹${data.fee.overdue.toLocaleString()}` : '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Performance */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-base text-gray-800">Weekly Attendance</h3>
            <span className="text-xs font-bold text-green-500 bg-green-50 px-3 py-1 rounded-lg">
              {data.attendancePercent}% Avg
            </span>
          </div>

          {data.weeklyBars.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No attendance recorded this week yet.</p>
          ) : (
            <div className="flex justify-between items-end h-48 pt-6 px-4 max-w-4xl mx-auto">
              {data.weeklyBars.map((bar, index) => (
                <div key={index} className="flex flex-col items-center flex-1 space-y-3">
                  <span className="text-xs font-bold text-gray-600">{bar.value}%</span>
                  <div className="w-5 relative flex justify-center h-32 bg-gray-50 rounded-t-full">
                    <div
                      className="w-full rounded-t-full absolute bottom-0 transition-all duration-500"
                      style={{ height: `${bar.value}%`, backgroundColor: bar.color }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-400">{bar.week}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Free Courses */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base text-gray-800">Free Courses</h3>
            <button className="text-sm font-semibold text-[#5E3FE6] hover:underline">See All</button>
          </div>
          <div className="bg-[#FFF4E5] rounded-2xl p-5 flex items-center justify-between shadow-sm border border-orange-100">
            <div className="space-y-2">
              <span className="text-xs bg-orange-200 text-orange-800 px-3 py-1 rounded-full font-bold">
                Mathematics
              </span>
              <h4 className="font-bold text-lg text-gray-800">Let's Math Together</h4>
              <p className="text-sm text-gray-500">Chapter 1 • 45 mins</p>
            </div>
            <div className="w-20 h-20 bg-orange-300 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-inner">
              MATH
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}