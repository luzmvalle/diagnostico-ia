import { NextResponse } from 'next/server';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

function getSupabase() {
  try {
    const { createServiceClient } = require('@/lib/supabase-server');
    return createServiceClient();
  } catch {
    return null;
  }
}

export async function POST(request) {
  try {
    const { session_id, step } = await request.json();

    if (!session_id || step === undefined) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ visit_id: null });
    }

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const ipHash = createHash('sha256').update(ip).digest('hex').slice(0, 16);

    const { data: existing } = await supabase
      .from('visits')
      .select('id, current_step')
      .eq('session_id', session_id)
      .single();

    if (existing) {
      await supabase
        .from('visits')
        .update({
          current_step: Math.max(existing.current_step, step),
          ip_hash: ipHash,
        })
        .eq('id', existing.id);

      return NextResponse.json({ visit_id: existing.id });
    } else {
      const userAgent = request.headers.get('user-agent') || '';
      const referrer = request.headers.get('referer') || '';

      const { data: newVisit } = await supabase
        .from('visits')
        .insert({
          session_id,
          current_step: step,
          user_agent: userAgent,
          referrer,
          ip_hash: ipHash,
        })
        .select('id')
        .single();

      return NextResponse.json({ visit_id: newVisit?.id });
    }
  } catch (err) {
    console.error('Tracking error:', err.message);
    return NextResponse.json({ visit_id: null });
  }
}
