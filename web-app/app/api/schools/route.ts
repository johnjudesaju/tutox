import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    const userSchools = await prisma.userSchool.findMany({
      where: { userId: Number(userId) },
      include: { school: true },
    });

    const schools = userSchools.map((us) => ({
      id: us.school.id,
      name: us.school.name,
      address: us.school.address,
    }));

    return NextResponse.json(schools);
  } catch (err) {
    console.error('GET /api/schools error:', err);
    return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 });
  }
}