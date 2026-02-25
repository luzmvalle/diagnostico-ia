import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('question_config')
      .select('*')
      .order('id');

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error('Config GET error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, value } = await request.json();

    if (!id || value === undefined) {
      return NextResponse.json({ error: 'Missing id or value' }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase
      .from('question_config')
      .update({ value })
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Config PUT error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
