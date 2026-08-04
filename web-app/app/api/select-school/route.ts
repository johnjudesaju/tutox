import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { schoolId } = await request.json();

    if (!schoolId) {
      return NextResponse.json({ error: 'schoolId is required' }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('schoolId', String(schoolId), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}