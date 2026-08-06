import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { getStudentDashboardData } from '@/app/lib/student-dashboard';

export async function GET(request: Request) {
  try {
    const payload = verifyToken(request);

    const student = await prisma.student.findUnique({
      where: { userId: Number(payload.userId) },
      select: { id: true },
    });

    if (!student) {
      return NextResponse.json({ error: 'No student record found for this account' }, { status: 404 });
    }

    const data = await getStudentDashboardData(student.id);

    return NextResponse.json(data);
  } catch (err) {
    console.error('GET /api/student-dashboard error:', err);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}