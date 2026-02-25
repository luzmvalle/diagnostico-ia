import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceClient();

    // Total visits
    const { count: totalVisits } = await supabase
      .from('visits')
      .select('id', { count: 'exact', head: true });

    // Total diagnostics
    const { count: totalDiagnosticos } = await supabase
      .from('responses')
      .select('id', { count: 'exact', head: true });

    // Funnel data
    const funnelSteps = [0, 1, 2, 3, 4];
    const funnel = {};
    for (const step of funnelSteps) {
      const { count } = await supabase
        .from('visits')
        .select('id', { count: 'exact', head: true })
        .gte('current_step', step);
      funnel[`step_${step}`] = count || 0;
    }

    const { count: completedCount } = await supabase
      .from('visits')
      .select('id', { count: 'exact', head: true })
      .eq('completed', true);
    funnel.completed = completedCount || 0;

    // Diagnostics per day (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: recentResponses } = await supabase
      .from('responses')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo)
      .order('created_at', { ascending: true });

    const perDay = {};
    (recentResponses || []).forEach((r) => {
      const day = r.created_at.slice(0, 10);
      perDay[day] = (perDay[day] || 0) + 1;
    });

    // Distribution by area
    const { data: allResponses } = await supabase
      .from('responses')
      .select('area, nivel_hierarquico');

    const byArea = {};
    const byNivel = {};
    (allResponses || []).forEach((r) => {
      byArea[r.area] = (byArea[r.area] || 0) + 1;
      byNivel[r.nivel_hierarquico] = (byNivel[r.nivel_hierarquico] || 0) + 1;
    });

    return NextResponse.json({
      totalVisits: totalVisits || 0,
      totalDiagnosticos: totalDiagnosticos || 0,
      taxaConversao:
        totalVisits > 0
          ? ((totalDiagnosticos / totalVisits) * 100).toFixed(1)
          : '0',
      funnel,
      perDay,
      byArea,
      byNivel,
    });
  } catch (err) {
    console.error('Metrics error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
