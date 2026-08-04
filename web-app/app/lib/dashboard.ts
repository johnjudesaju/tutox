import { prisma } from "./prisma";
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";

export async function getDashboardData(schoolId: number, classId?: number, sectionId?: number) {
  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

  const [
    totalStudents,
    genderCounts,
    totalTeachers,
    feeAgg,
    studentAttendanceToday,
    teachersPresentToday,
    weekAttendance,
  ] = await Promise.all([
    prisma.student.count({
      where: { class: { schoolId } },
    }),

    prisma.student.groupBy({
      by: ["gender"],
      where: { class: { schoolId } },
      _count: { gender: true },
    }),

    prisma.teacher.count({
      where: { schoolId },
    }),

    prisma.feeRecord.aggregate({
      where: { academicYear: "2025-26", student: { class: { schoolId } } },
      _sum: { totalFee: true, collected: true, overdue: true },
    }),

    prisma.studentAttendance.groupBy({
      by: ["status"],
      where: {
        date: { gte: todayStart, lte: todayEnd },
        student: { class: { schoolId } },
        ...(classId && { classId }),
        ...(sectionId && { sectionId }),
      },
      _count: { status: true },
    }),

    prisma.teacherAttendance.count({
      where: {
        date: { gte: todayStart, lte: todayEnd },
        status: "PRESENT",
        teacher: { schoolId },
      },
    }),

    prisma.studentAttendance.findMany({
      where: {
        date: { gte: weekStart, lte: weekEnd },
        student: { class: { schoolId } },
        ...(classId && { classId }),
        ...(sectionId && { sectionId }),
      },
      select: { date: true, status: true },
    }),
  ]);

  const statusCounts = studentAttendanceToday.reduce(
    (acc, row) => ({ ...acc, [row.status]: row._count.status }),
    { PRESENT: 0, ABSENT: 0, LEAVE: 0, LATE: 0 } as Record<string, number>
  );

  const genderMap = genderCounts.reduce(
    (acc, row) => ({ ...acc, [row.gender]: row._count.gender }),
    { MALE: 0, FEMALE: 0, OTHER: 0 } as Record<string, number>
  );

  const dayMap: Record<string, { present: number; absent: number; leave: number }> = {};
  for (const row of weekAttendance) {
    const day = row.date.toLocaleDateString("en-US", { weekday: "short" });
    if (!dayMap[day]) dayMap[day] = { present: 0, absent: 0, leave: 0 };
    if (row.status === "PRESENT") dayMap[day].present++;
    if (row.status === "ABSENT") dayMap[day].absent++;
    if (row.status === "LEAVE") dayMap[day].leave++;
  }

  const totalFee = feeAgg._sum.totalFee ?? 0;
  const collected = feeAgg._sum.collected ?? 0;
  const overdue = feeAgg._sum.overdue ?? 0;

  return {
    fee: {
      collectionPercent: totalFee ? Math.round((collected / totalFee) * 100) : 0,
      totalAmount: totalFee,
      collected,
      overdue,
    },
    students: {
      total: totalStudents,
      boys: genderMap.MALE,
      girls: genderMap.FEMALE,
      present: statusCounts.PRESENT,
      absent: statusCounts.ABSENT,
      leave: statusCounts.LEAVE,
      presentPercent: totalStudents ? Math.round((statusCounts.PRESENT / totalStudents) * 100) : 0,
      absentPercent: totalStudents ? Math.round((statusCounts.ABSENT / totalStudents) * 100) : 0,
      leavePercent: totalStudents ? Math.round((statusCounts.LEAVE / totalStudents) * 100) : 0,
    },
    teachers: {
      total: totalTeachers,
      present: teachersPresentToday,
    },
    weeklyChart: dayMap,
  };
}