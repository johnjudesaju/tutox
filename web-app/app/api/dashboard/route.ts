import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET() {
  try {
    // Fee collection — sum across all FeeRecord rows
    const { data: feeRecords, error: feeError } = await supabase
      .from('FeeRecord')
      .select('totalFee, collected, overdue');

    if (feeError) throw feeError;

    const feeCollection = feeRecords.reduce(
      (acc, r) => ({
        total: acc.total + (r.totalFee || 0),
        collected: acc.collected + (r.collected || 0),
        overdue: acc.overdue + (r.overdue || 0),
      }),
      { total: 0, collected: 0, overdue: 0 }
    );

    // Student strength — total + gender breakdown
    const { data: students, error: studentError } = await supabase
      .from('Student')
      .select('gender');

    if (studentError) throw studentError;

    const studentStrength = {
      total: students.length,
      boys: students.filter((s) => s.gender === 'MALE').length,
      girls: students.filter((s) => s.gender === 'FEMALE').length,
    };

    // Teacher count — total only; "present" has no schema backing yet
    const { count: teacherTotal, error: teacherError } = await supabase
      .from('Teacher')
      .select('*', { count: 'exact', head: true });

    if (teacherError) throw teacherError;

    return NextResponse.json({
      feeCollection,
      studentStrength,
      teachers: {
        total: teacherTotal ?? 0,
        present: null, // no attendance data source yet
      },
      events: {
        count: null, // no Event model yet
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}