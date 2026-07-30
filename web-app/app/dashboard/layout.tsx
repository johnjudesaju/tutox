import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, BookOpen, Calendar, Settings } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#0A192F]">School Name Here</h2>
          <p className="text-sm text-gray-500 mt-1">School ID: 123456</p>
          <div className="mt-4 p-2 bg-blue-50 text-blue-900 rounded-md text-xs font-bold text-center">
            Academic Year 2023-24
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-4">
            <li>
              <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-900 rounded-lg font-semibold text-sm">
                <LayoutDashboard size={18} /> Dashboard
              </Link>
            </li>
            <li>
              <Link href="/dashboard/people" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors">
                <Users size={18} /> User Management
              </Link>
            </li>
            {/* Disabled Links for visual completeness */}
            <li className="flex items-center gap-3 px-3 py-2 text-gray-400 font-medium text-sm cursor-not-allowed">
                <BookOpen size={18} /> Class Management
            </li>
            <li className="flex items-center gap-3 px-3 py-2 text-gray-400 font-medium text-sm cursor-not-allowed">
                <Calendar size={18} /> Exam Master
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
            <div className="flex gap-6 text-sm font-semibold text-gray-500">
                <span className="text-[#0A192F] border-b-2 border-[#0A192F] pb-1">School Admin</span>
                <span className="hover:text-gray-800 cursor-pointer transition-colors">Customers</span>
                <span className="hover:text-gray-800 cursor-pointer transition-colors">Support</span>
                <span className="hover:text-gray-800 cursor-pointer transition-colors">Settings</span>
            </div>
            <div className="w-72">
                <input 
                    type="text" 
                    placeholder="Find Student by Name, ID..." 
                    className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
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