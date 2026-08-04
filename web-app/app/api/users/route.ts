import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// GET: Fetch all users from PostgreSQL
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Supabase error in GET /api/users:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formattedUsers = data.map((user) => ({
      id: user.id,
      name: user.name,
      designation: user.designation,
      roles: user.roles,
      mobile: user.mobile,
      status: user.status,
    }));

    return NextResponse.json(formattedUsers);
  } catch (err) {
    console.error('Unexpected error in GET /api/users:', err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST: Create a new user in PostgreSQL
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('User')
      .insert([
        {
          name: body.name,
          password: body.password || 'changeme123', // schema requires this — see note below
          designation: body.designation,
          roles: body.roles,
          mobile: body.mobile,
          status: body.status || 'Active',
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0]);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}