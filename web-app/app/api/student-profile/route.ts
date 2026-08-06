import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request) {
  try {
    const payload = verifyToken(request);

    const student = await prisma.student.findUnique({
      where: { userId: Number(payload.userId) },
      select: {
        dob: true,
        gender: true,
        guardian: true,
        class: { select: { name: true } },
        section: { select: { name: true } },
        user: {
          select: {
            name: true,
            mobile: true,
            designation: true,
            status: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'No student record found for this account' }, { status: 404 });
    }

    return NextResponse.json({
      name: student.user.name,
      mobile: student.user.mobile,
      designation: student.user.designation,
      status: student.user.status,
      dob: student.dob,
      gender: student.gender,
      guardian: student.guardian,
      className: student.class.name,
      sectionName: student.section.name,
    });
  } catch (err) {
    console.error('GET /api/student-profile error:', err);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}