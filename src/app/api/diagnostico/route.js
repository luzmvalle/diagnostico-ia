import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';
import { generateDiagnostico } from '@/lib/gemini';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

function hashIP(ip) {
  return createHash('sha256').update(ip || 'unknown').digest('hex').slice(0, 16);
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    const required = [
      'nome',
      'cargo',
      'area',
      'nivel_hierarquico',
      'tamanho_empresa',
      'atividades_tempo',
      'uso_ia_atual',
      'barreiras_ia',
      'expectativas_ia',
    ];

    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Campo obrigatório: ${field}` },
          { status: 400 }
        );
      }
    }

    if (!Array.isArray(body.atividades_tempo) || body.atividades_tempo.length < 2) {
      return NextResponse.json(
        { error: 'Selecione pelo menos 2 atividades' },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.barreiras_ia) || body.barreiras_ia.length < 1) {
      return NextResponse.json(
        { error: 'Selecione pelo menos 1 barreira' },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.expectativas_ia) || body.expectativas_ia.length < 1 || body.expectativas_ia.length > 3) {
      return NextResponse.json(
        { error: 'Selecione entre 1 e 3 expectativas' },
        { status: 400 }
      );
    }

    // Rate limiting: max 3 per IP per 24h
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const ipHash = hashIP(ip);

    const supabase = createServiceClient();

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { count } = await supabase
      .from('responses')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', twentyFourHoursAgo)
      .eq('visit_id', body.visit_id || '');

    // Also check by IP hash in visits
    const { count: ipCount } = await supabase
      .from('visits')
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .eq('completed', true)
      .gte('created_at', twentyFourHoursAgo);

    if (ipCount && ipCount >= 3) {
      return NextResponse.json(
        { error: 'Limite atingido. Você pode gerar até 3 diagnósticos a cada 24 horas.' },
        { status: 429 }
      );
    }

    // Update visit with IP hash
    if (body.visit_id) {
      await supabase
        .from('visits')
        .update({ ip_hash: ipHash, completed: true, current_step: 5 })
        .eq('id', body.visit_id);
    }

    // Generate diagnostic with retry
    let result;
    try {
      result = await generateDiagnostico(body);
    } catch (firstErr) {
      console.error('Gemini first attempt failed:', firstErr.message);
      // Retry once
      try {
        result = await generateDiagnostico(body);
      } catch (secondErr) {
        console.error('Gemini retry failed:', secondErr.message);
        return NextResponse.json(
          { error: 'Erro ao gerar diagnóstico. Por favor, tente novamente.' },
          { status: 502 }
        );
      }
    }

    // Save response
    const { data: savedResponse, error: saveError } = await supabase
      .from('responses')
      .insert({
        visit_id: body.visit_id || null,
        nome: body.nome,
        cargo: body.cargo,
        area: body.area,
        nivel_hierarquico: body.nivel_hierarquico,
        tamanho_empresa: body.tamanho_empresa,
        atividades_tempo: body.atividades_tempo,
        uso_ia_atual: body.uso_ia_atual,
        barreiras_ia: body.barreiras_ia,
        expectativas_ia: body.expectativas_ia,
        diagnostico_json: result.diagnostico,
        tokens_usados: result.tokens_usados,
        tempo_geracao_ms: result.tempo_geracao_ms,
      })
      .select('id')
      .single();

    if (saveError) {
      console.error('Error saving response:', saveError);
    }

    console.log(
      `[Diagnóstico] tokens=${result.tokens_usados} tempo=${result.tempo_geracao_ms}ms area=${body.area}`
    );

    return NextResponse.json({
      diagnostico: result.diagnostico,
      response_id: savedResponse?.id,
    });
  } catch (err) {
    console.error('Diagnostic route error:', err);
    return NextResponse.json(
      { error: 'Erro interno. Tente novamente.' },
      { status: 500 }
    );
  }
}

export const maxDuration = 90;
