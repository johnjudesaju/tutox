'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WeeklyAttendanceChart } from "@/components/dashboard/weekly-attendance-chart";

interface DashboardData {
  fee: { collectionPercent: number; totalAmount: number; collected: number; overdue: number; academicYear?: string };
  students: {
    total: number; boys: number; girls: number;
    present: number; absent: number; leave: number;
    presentPercent: number; absentPercent: number; leavePercent: number;
  };
  teachers: { total: number; present: number };
  weeklyChart: Record<string, { present: number; absent: number; leave: number }>;
}

interface EventItem {
  id: number;
  title: string;
  description: string | null;
  date: string;
  classRange: string | null;
}

export default function PrincipalDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [todaysEvents, setTodaysEvents] = useState<EventItem[]>([]);
  const [adminName, setAdminName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) { router.push('/'); return; }

        const res = await fetch('/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) { router.push('/'); return; }

        const body = await res.json();

        if (res.status === 400 && body.code === 'NO_SCHOOL_SELECTED') {
          router.push('/select-school');
          return;
        }

        if (!res.ok) throw new Error(body.error || 'Failed to fetch dashboard data');
        setData(body);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  useEffect(() => {
    const fetchSchoolInfo = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('/api/schools/current', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const info = await res.json();
        setAdminName(info.admin?.name ?? '');
      } catch (err) {
        console.error('Failed to load admin name:', err);
      }
    };

    fetchSchoolInfo();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) return;

      try {
        const [allRes, todayRes] = await Promise.all([
          fetch('/api/events', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/events?today=true', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (allRes.ok) setEvents(await allRes.json());
        if (todayRes.ok) setTodaysEvents(await todayRes.json());
      } catch (err) {
        console.error('Failed to load events:', err);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return <div className="p-6 text-sm text-gray-500">Loading dashboard...</div>;
  }

  if (error || !data) {
    return <div className="p-6 text-sm text-red-600">{error || 'Failed to load dashboard.'}</div>;
  }

  const absentAndLeavePercent = data.students.absentPercent + data.students.leavePercent;
  const firstName = adminName ? adminName.split(' ')[0] : '';

  return (
    <div className="p-6 space-y-5 bg-gray-50 min-h-screen">

      {/* Greeting + mini present/absent split */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {firstName ? `Hi, ${firstName}! ` : 'Hi there! '}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Here's a quick overview of your day</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">{data.students.presentPercent}%</p>
            <p className="text-[10px] text-gray-400">Present</p>
          </div>
          <div className="flex items-end gap-0.5 h-10">
            <div
              className="w-2.5 bg-gray-900 rounded-t-sm"
              style={{ height: `${Math.max(data.students.presentPercent, 4)}%` }}
            />
            <div
              className="w-2.5 bg-red-400 rounded-t-sm"
              style={{ height: `${Math.max(absentAndLeavePercent, 4)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Fee Collection Status — full width feature card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700">School Fee Collection Status</h3>
          <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {data.fee.academicYear ?? "All Years"}
          </span>
        </div>
        <div className="flex items-end justify-between mb-2">
          <p className="text-4xl font-bold text-gray-900">{data.fee.collectionPercent}%</p>
          <span className="text-sm text-gray-400">{data.students.total} students</span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all"
            style={{ width: `${data.fee.collectionPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="flex items-center gap-2 text-gray-600">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            Fee Collected: <span className="font-semibold text-gray-900">₹{(data.fee.collected / 100000).toFixed(2)}L</span>
          </span>
          <span className="flex items-center gap-2 text-gray-600">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            Overdue: <span className="font-semibold text-gray-900">₹{(data.fee.overdue / 100000).toFixed(2)}L</span>
          </span>
        </div>
      </div>

      {/* Stat cards row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Overall Student Strength</h3>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 100-8 4 4 0 000 8zm6 3c0 2.21-3.13 4-7 4s-7-1.79-7-4" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{data.students.total}</p>
          <p className="text-xs text-gray-400 mt-2">{data.students.boys} boys, {data.students.girls} girls</p>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-blue-400 rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Teachers Present</h3>
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.42A12.083 12.083 0 0112 20.055 12.083 12.083 0 015.84 10.58L12 14z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {data.teachers.present}
            <span className="text-base text-gray-400 font-medium"> / {data.teachers.total}</span>
          </p>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-purple-400 rounded-full"
              style={{ width: data.teachers.total ? `${(data.teachers.present / data.teachers.total) * 100}%` : '0%' }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">No. of Events</h3>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{events.length}</p>
          <p className="text-xs text-gray-400 mt-2">In whole academic year</p>
        </div>
      </div>

      {/* Present / Absent / Leave */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <h3 className="text-sm font-semibold text-gray-700">Present</h3>
          </div>
          <p className="text-3xl font-bold text-green-600 mt-1">{data.students.presentPercent}%</p>
          <p className="text-xs text-gray-400 mt-1">{data.students.present} Students</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <h3 className="text-sm font-semibold text-gray-700">Absent</h3>
          </div>
          <p className="text-3xl font-bold text-red-500 mt-1">{data.students.absentPercent}%</p>
          <p className="text-xs text-gray-400 mt-1">{data.students.absent} Students</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <h3 className="text-sm font-semibold text-gray-700">Leave</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-500 mt-1">{data.students.leavePercent}%</p>
          <p className="text-xs text-gray-400 mt-1">{data.students.leave} Students</p>
        </div>
      </div>

      {/* Weekly Attendance Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700">Students Attendance Status</h3>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500" /> Present
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Absent
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-500" /> Leave
            </span>
          </div>
        </div>
        <WeeklyAttendanceChart data={data.weeklyChart} />
      </div>

      {/* Today's Events + App Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Today's Events</h3>
          </div>
          {todaysEvents.length === 0 ? (
            <p className="text-xs text-gray-400">No events scheduled today.</p>
          ) : (
            <div className="space-y-2">
              {todaysEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm font-medium text-gray-800">{event.title}</span>
                  <span className="text-xs text-gray-400">
                    Today{event.classRange ? ` | ${event.classRange}` : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm p-6 opacity-60">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">App Usage</h3>
          <p className="text-xs text-gray-400">No usage analytics source yet</p>
        </div>
      </div>

    </div>
  );
}