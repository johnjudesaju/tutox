"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Users, BookOpen, Calendar, Settings, LogOut } from 'lucide-react';

interface SchoolInfo {
  school: { id: number; name: string };
  admin: { name: string; designation: string };
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, disabled: false },
  { href: '/dashboard/people', label: 'User Management', icon: Users, disabled: false },
  { href: '/dashboard/classes', label: 'Class Management', icon: BookOpen, disabled: true },
  { href: '/dashboard/exams', label: 'Exam Master', icon: Calendar, disabled: true },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [info, setInfo] = useState<SchoolInfo | null>(null);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    router.push('/');
  };

  useEffect(() => {
    const fetchSchoolInfo = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        const res = await fetch('/api/schools/current', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;

        const data = await res.json();
        setInfo(data);
      } catch (err) {
        console.error('Failed to load school info:', err);
      }
    };

    fetchSchoolInfo();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#0A192F]">
            {info?.school.name ?? 'Loading...'}
          </h2>
          <div className="mt-4 p-2 bg-blue-50 text-blue-900 rounded-md text-xs font-bold text-center">
            Academic Year 2023-24
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 flex flex-col">
          <ul className="space-y-2 px-4 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              if (item.disabled) {
                return (
                  <li
                    key={item.label}
                    className="flex items-center gap-3 px-3 py-2 text-gray-400 font-medium text-sm cursor-not-allowed"
                  >
                    <Icon size={18} /> {item.label}
                  </li>
                );
              }

              // Exact match for /dashboard so it doesn't stay active on nested routes
              // like /dashboard/people; other routes match on prefix.
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname === item.href || pathname?.startsWith(item.href + '/');

              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-900 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 font-medium'
                    }`}
                  >
                    <Icon size={18} /> {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex gap-6 text-sm font-semibold text-gray-500">
            <span className="text-[#0A192F] border-b-2 border-[#0A192F] pb-1">
              {info?.admin.name ?? 'School Admin'}
            </span>
            <span className="hover:text-gray-800 cursor-pointer transition-colors">Customers</span>
            <span className="hover:text-gray-800 cursor-pointer transition-colors">Support</span>
            <span className="hover:text-gray-800 cursor-pointer transition-colors">Settings</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}