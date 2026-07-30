import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// GET: Fetch all users from PostgreSQL
export async function GET() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map database column names to match frontend expectations
  const formattedUsers = data.map((user) => ({
    id: user.id,
    userId: user.user_id,
    name: user.name,
    designation: user.designation,
    roles: user.roles,
    mobile: user.mobile,
    status: user.status,
  }));

  return NextResponse.json(formattedUsers);
}

// POST: Create a new user in PostgreSQL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const randomNum = Math.floor(100 + Math.random() * 900);
    const generatedUserId = `SC-${randomNum}`;

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          user_id: generatedUserId,
          name: body.name,
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