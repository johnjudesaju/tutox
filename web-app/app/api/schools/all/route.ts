import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      select: { id: true, name: true, address: true },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(schools);
  } catch (err) {
    console.error('GET /api/schools/all error:', err);
    return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 });
  }
}