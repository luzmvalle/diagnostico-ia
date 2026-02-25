import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const area = searchParams.get('area');
    const nivel = searchParams.get('nivel');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = 20;

    const supabase = createServiceClient();

    let query = supabase
      .from('responses')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1);

    if (area) query = query.eq('area', area);
    if (nivel) query = query.eq('nivel_hierarquico', nivel);
    if (from) query = query.gte('created_at', from);
    if (to) query = query.lte('created_at', to + 'T23:59:59Z');

    const { data, count, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      responses: data,
      total: count,
      page,
      totalPages: Math.ceil((count || 0) / perPage),
    });
  } catch (err) {
    console.error('Responses error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
