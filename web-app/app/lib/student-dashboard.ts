import { prisma } from "./prisma";
import { startOfWeek, endOfWeek } from "date-fns";

export async function getStudentDashboardData(studentId: number) {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

  const [weekAttendance, feeRecord] = await Promise.all([
    prisma.studentAttendance.findMany({
      where: {
        studentId,
        date: { gte: weekStart, lte: weekEnd },
      },
      select: { date: true, status: true },
      orderBy: { date: "asc" },
    }),

    prisma.feeRecord.findFirst({
      where: { studentId, academicYear: "2025-26" },
      select: { totalFee: true, collected: true, overdue: true },
    }),
  ]);

  const totalDays = weekAttendance.length;
  const presentDays = weekAttendance.filter((a) => a.status === "PRESENT").length;
  const attendancePercent = totalDays ? Math.round((presentDays / totalDays) * 100) : 0;

  const weeklyBars = weekAttendance.map((a) => ({
    week: a.date.toLocaleDateString("en-US", { weekday: "short" }),
    value: a.status === "PRESENT" ? 100 : a.status === "LATE" ? 50 : 0,
    color: a.status === "PRESENT" ? "#68EBAA" : "#FFE6C7",
  }));

  return {
    attendancePercent,
    weeklyBars,
    fee: {
      overdue: feeRecord?.overdue ?? null,
    },
  };
}