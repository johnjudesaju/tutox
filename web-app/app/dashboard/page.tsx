'use client';

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { dashboardMetrics } from '../lib/mockData';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardPage() {
  const feeData = {
    labels: ['Fee Collected', 'Overdue'],
    datasets: [{
      data: [dashboardMetrics.feeCollection.collected, dashboardMetrics.feeCollection.overdue],
      backgroundColor: ['#10B981', '#EF4444'], 
      borderWidth: 0,
    }]
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hi, John!</h1>
        <p className="text-gray-500 mt-1 text-sm">Here's a quick overview of your day</p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-500 mb-2">July Collection</h4>
            <p className="text-2xl font-bold text-gray-900">₹ {dashboardMetrics.feeCollection.collected}L</p>
            <p className="text-xs font-medium text-gray-400 mt-2">Total Amount: ₹ {dashboardMetrics.feeCollection.total}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-500 mb-2">Overall Student Strength</h4>
            <p className="text-2xl font-bold text-gray-900">{dashboardMetrics.studentStrength.total}</p>
            <p className="text-xs font-medium text-gray-400 mt-2">{dashboardMetrics.studentStrength.boys} boys, {dashboardMetrics.studentStrength.girls} girls</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-500 mb-2">Teachers Present</h4>
            <p className="text-2xl font-bold text-gray-900">{dashboardMetrics.teachers.present}</p>
            <p className="text-xs font-medium text-gray-400 mt-2">out of {dashboardMetrics.teachers.total}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-500 mb-2">No. of Events</h4>
            <p className="text-2xl font-bold text-gray-900">20</p>
            <p className="text-xs font-medium text-gray-400 mt-2">In whole academic year</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Fee Collection Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-gray-800">School Fee Collection Status</h3>
             <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">July</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="w-40 h-40">
                <Doughnut data={feeData} options={{ cutout: '75%', plugins: { legend: { display: false } } }} />
            </div>
            <div className="space-y-5 flex-1 ml-10">
              <div>
                <p className="text-sm font-semibold text-gray-500 flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span> Fee Collected</p>
                <p className="text-xl font-bold text-gray-900 mt-1">₹{dashboardMetrics.feeCollection.collected}L</p>
              </div>
              <div>
                 <p className="text-sm font-semibold text-gray-500 flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> Overdue</p>
                <p className="text-xl font-bold text-gray-900 mt-1">₹{dashboardMetrics.feeCollection.overdue}L</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}