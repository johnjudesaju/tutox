import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// PATCH: Update an existing user in PostgreSQL
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('User')
      .update({
        name: body.name,
        password: body.password || 'changeme123',
        designation: body.designation,
        roles: body.roles,
        mobile: body.mobile,
        status: body.status,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0]);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
