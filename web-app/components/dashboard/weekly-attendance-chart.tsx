"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

type DayAttendance = {
  present: number;
  absent: number;
  leave: number;
};

type WeeklyAttendanceChartProps = {
  data: Record<string, DayAttendance>;
};

const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function WeeklyAttendanceChart({ data }: WeeklyAttendanceChartProps) {
  const chartData = DAY_ORDER.filter((day) => data[day]).map((day) => ({
    day,
    Present: data[day].present,
    Absent: data[day].absent,
    Leave: data[day].leave,
  }));

  if (chartData.length === 0) {
    return <p className="text-sm text-gray-400">No attendance data for this week yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Present" fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Leave" fill="#eab308" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}