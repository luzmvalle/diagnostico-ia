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

    const { data, error } = await supabase
      .from('responses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Build CSV
    const headers = [
      'Data',
      'Nome',
      'Cargo',
      'Ãrea',
      'NÃ­vel',
      'Tamanho Empresa',
      'Uso IA',
      'Atividades',
      'Barreiras',
      'Expectativas',
      'Maturidade',
      'Score',
      'Tokens',
      'Tempo (ms)',
    ];

    const rows = (data || []).map((r) => {
      const diag = r.diagnostico_json || {};
      return [
        r.created_at?.slice(0, 10),
        r.nome,
        r.cargo,
        r.area,
        r.nivel_hierarquico,
        r.tamanho_empresa,
        r.uso_ia_atual,
        (r.atividades_tempo || []).join('; '),
        (r.barreiras_ia || []).join('; '),
        (r.expectativas_ia || []).join('; '),
        diag.nivel_maturidade_ia || '',
        diag.score_potencial_ia || '',
        r.tokens_usados,
        r.tempo_geracao_ms,
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');

    const bom = '\uFEFF';

    return new NextResponse(bom + csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="diagnostico-ia-export-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err) {
    console.error('Export error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
