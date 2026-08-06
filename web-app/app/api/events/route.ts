import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request) {
  try {
    const payload = verifyToken(request);

    if (!payload.schoolId) {
      return NextResponse.json({ error: 'No school selected' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const todayOnly = searchParams.get('today') === 'true';

    const where: any = { schoolId: Number(payload.schoolId) };
    if (todayOnly) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      where.date = { gte: start, lte: end };
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { date: 'asc' },
      select: { id: true, title: true, description: true, date: true, classRange: true },
    });

    return NextResponse.json(events);
  } catch (err) {
    console.error('GET /api/events error:', err);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = verifyToken(request);
    if (!payload.schoolId) {
      return NextResponse.json({ error: 'No school selected' }, { status: 400 });
    }

    const body = await request.json();
    if (!body.title || !body.date) {
      return NextResponse.json({ error: 'title and date are required' }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        schoolId: Number(payload.schoolId),
        title: body.title,
        description: body.description ?? null,
        date: new Date(body.date),
        classRange: body.classRange ?? null,
      },
    });

    return NextResponse.json(event);
  } catch (err) {
    console.error('POST /api/events error:', err);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}