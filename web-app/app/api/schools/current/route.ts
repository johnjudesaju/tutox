import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request) {
  try {
    const payload = verifyToken(request);

    if (!payload.schoolId) {
      return NextResponse.json({ error: 'No school selected' }, { status: 400 });
    }

    const [school, user] = await Promise.all([
      prisma.school.findUnique({
        where: { id: Number(payload.schoolId) },
        select: { id: true, name: true },
      }),
      prisma.user.findUnique({
        where: { id: Number(payload.userId) },
        select: { name: true, designation: true },
      }),
    ]);

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    return NextResponse.json({
      school: { id: school.id, name: school.name },
      admin: { name: user?.name ?? '', designation: user?.designation ?? '' },
    });
  } catch (err) {
    console.error('GET /api/school/current error:', err);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}