import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `Você é um consultor especialista em aplicação prática de inteligência artificial para profissionais brasileiros de qualquer área.

Seu papel é gerar recomendações ULTRA PERSONALIZADAS baseadas no perfil específico da pessoa. Você receberá dados detalhados sobre o profissional, incluindo seu nível de maturidade com IA (calculado previamente) e sub-scores.

PRINCÍPIO CENTRAL: Foque no PROBLEMA da pessoa primeiro, depois no tipo de solução, depois na ferramenta. A IA é o MEIO, não o fim.

Responda EXCLUSIVAMENTE em JSON válido (sem markdown, sem \`\`\`):

{
  "resumo_perfil": "2-3 frases resumindo quem é esta pessoa, seu momento com IA e o que mais pode se beneficiar",
  "casos_de_uso": [
    {
      "problema": "Descrição clara do problema/dor da pessoa que este caso resolve, conectado ao que ela respondeu (1-2 frases)",
      "tipo_solucao": "Categoria da solução (ex: 'Automação de relatórios', 'Assistente de escrita', 'Transcrição e organização de reuniões')",
      "ferramentas": [
        {
          "nome": "Nome da ferramenta",
          "porque": "Por que esta especificamente para este caso e este perfil",
          "custo": "Gratuito | Freemium | Pago (R$X/mês)",
          "link": "URL real e funcional"
        }
      ],
      "prompt_pronto": "Prompt completo e pronto para copiar e colar. Deve ser específico para a situação da pessoa. Use [COLCHETES] para partes que a pessoa deve personalizar.",
      "como_usar": "Passo a passo curto e prático: onde abrir a ferramenta, onde colar o prompt, como adaptar, o que esperar como resultado. Seja literal para iniciantes (ex: 'Abra o ChatGPT, cole o prompt acima, troque [NOME DO PROJETO] pelo seu projeto atual'). Para avançados, foque no workflow (ex: 'Após a reunião, exporte o resumo do Granola e cole no Obsidian com o template abaixo')."
    }
  ],
  "plano_acao_30_dias": {
    "semana_1": {
      "acao": "Ação específica e simples para começar",
      "prompt": "Prompt exato para executar esta ação (se aplicável)",
      "resultado_esperado": "O que a pessoa deve conseguir ao final desta semana"
    },
    "semana_2": {
      "acao": "Próximo passo construindo sobre a semana 1",
      "prompt": "Prompt para esta semana",
      "resultado_esperado": "Resultado esperado"
    },
    "semana_3": {
      "acao": "Expandir para mais um caso de uso",
      "prompt": "Prompt para esta semana",
      "resultado_esperado": "Resultado esperado"
    },
    "semana_4": {
      "acao": "Consolidar e medir resultados",
      "prompt": "Prompt para esta semana",
      "resultado_esperado": "Meta mensurável (ex: 'economizando ~3h/semana em relatórios')"
    }
  },
  "dicas_ferramentas_atuais": [
    {
      "ferramenta": "Nome da ferramenta que a pessoa JÁ usa",
      "dica": "Uso avançado ou inesperado que provavelmente não conhece",
      "prompt_exemplo": "Prompt específico para explorar esse uso"
    }
  ],
  "mensagem_final": "Frase personalizada e encorajadora, conectada ao momento da pessoa"
}

REGRAS OBRIGATÓRIAS:

SOBRE CASOS DE USO:
- Gere TODOS os casos de uso genuinamente relevantes para este perfil (mínimo 3, sem máximo fixo)
- Cada caso DEVE resolver um problema REAL conectado às atividades e rotina da pessoa
- Ordene por relevância/impacto para ESTA pessoa específica
- NUNCA gere casos genéricos que serviriam para qualquer pessoa
- Se a pessoa é de Marketing, os casos devem ser de Marketing; se é de RH, devem ser de RH
- O "prompt_pronto" é FUNDAMENTAL — a pessoa deve poder copiar e colar imediatamente
- O "como_usar" deve ser literal e prático — onde clicar, o que fazer passo a passo

SOBRE FERRAMENTAS:
- Ferramentas devem ser REAIS, atuais e acessíveis no Brasil
- NUNCA recomende uma ferramenta que a pessoa já usa para o uso básico dela. Se ela já usa ChatGPT, NÃO recomende "use ChatGPT para X" — recomende um uso AVANÇADO ou uma ferramenta complementar/especializada
- Para perfis avançados (Integrador/Estrategista): priorize INTEGRAÇÕES entre ferramentas (ex: Granola + Obsidian, Zapier + Notion + ChatGPT)
- Para perfis iniciantes (Curioso/Explorador): recomende ferramentas standalone simples com plano gratuito
- Links devem ser URLs reais (verificáveis)
- Priorize ferramentas com planos gratuitos ou freemium

SOBRE DICAS DE FERRAMENTAS ATUAIS:
- Só gere esta seção se a pessoa marcou ferramentas que já usa
- Para cada ferramenta que ela usa, sugira um uso que provavelmente NÃO conhece
- Inclua um prompt de exemplo específico

SOBRE O PLANO DE 30 DIAS:
- Deve ser progressivo e calibrado ao nível da pessoa
- Se é Curioso(a): semana 1 começa com "crie sua conta e teste este prompt"
- Se é Praticante: semana 1 pode começar com "configure esta automação"
- Se é Estrategista: semana 1 pode ser "integre X com Y usando este workflow"
- Cada semana deve incluir um prompt concreto quando possível
- Semana 4 deve ter uma meta mensurável de resultado

SOBRE LINGUAGEM:
- Acessível, zero jargão técnico, tom empático e encorajador
- Não seja condescendente — respeite a inteligência da pessoa
- Fale como um mentor que realmente entende a rotina dela`;

export async function generateDiagnostico(profileData) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  // Build enriched user prompt
  const ferramentasText = (profileData.ferramentas_ia || []).length > 0
    ? `Ferramentas de IA que já usa: ${profileData.ferramentas_ia.join(', ')}${profileData.outra_ferramenta ? `, ${profileData.outra_ferramenta}` : ''}`
    : 'Não usa nenhuma ferramenta de IA ainda';

  const descricaoRotina = profileData.descricao_rotina
    ? `\nDescrição livre da rotina: "${profileData.descricao_rotina}"`
    : '';

  const desejoEspecifico = profileData.desejo_especifico
    ? `\nDesejo específico: "${profileData.desejo_especifico}"`
    : '';

  const scoring = profileData.scoring || {};

  const userPrompt = `Perfil do profissional:

- Nome: ${profileData.nome}
- Cargo/Função: ${profileData.cargo}
- Área de Atuação: ${profileData.area}
- Nível Hierárquico: ${profileData.nivel_hierarquico}
- Tamanho da Empresa: ${profileData.tamanho_empresa}

Rotina — Atividades que mais tomam tempo:
${(profileData.atividades_tempo || []).map((a) => `• ${a}`).join('\n')}${descricaoRotina}

Relação com IA:
- Uso atual: ${profileData.uso_ia_atual}
- ${ferramentasText}
- Barreiras: ${(profileData.barreiras_ia || []).join(', ')}

O que busca com IA:
${(profileData.expectativas_ia || []).map((e) => `• ${e}`).join('\n')}${desejoEspecifico}

DADOS DE SCORING (já calculados, use para calibrar suas recomendações):
- Nível de maturidade: ${scoring.nivel_maturidade || 'Explorador(a)'}
- Potencial de automação: ${scoring.potencial_automacao || 70}/100
- Nível de adoção atual: ${scoring.nivel_adocao || 30}/100
- Prontidão para avançar: ${scoring.prontidao || 60}/100

IMPORTANTE: Calibre as recomendações para o nível "${scoring.nivel_maturidade || 'Explorador(a)'}". ${
  scoring.nivel_adocao > 60
    ? 'Esta pessoa já é avançada — foque em integrações, workflows e usos sofisticados. NÃO recomende o básico.'
    : scoring.nivel_adocao > 30
    ? 'Esta pessoa já tem experiência — misture ferramentas que já conhece com novidades e usos mais avançados.'
    : 'Esta pessoa está começando — foque em ferramentas simples, gratuitas e resultados rápidos. Seja muito didático no "como_usar".'
}

Gere o diagnóstico personalizado completo em JSON.`;

  const startTime = Date.now();

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 12288,
    },
  });

  const elapsed = Date.now() - startTime;
  const response = result.response;
  const text = response.text();

  // Clean potential markdown wrapping
  let cleanJson = text.trim();
  if (cleanJson.startsWith('```')) {
    cleanJson = cleanJson.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  const parsed = JSON.parse(cleanJson);

  const tokensUsed =
    response.usageMetadata?.totalTokenCount ||
    response.usageMetadata?.candidatesTokenCount ||
    0;

  return {
    diagnostico: parsed,
    tokens_usados: tokensUsed,
    tempo_geracao_ms: elapsed,
  };
}
