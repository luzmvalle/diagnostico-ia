import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `Você é um consultor especialista em aplicação prática de inteligência artificial para profissionais não-técnicos brasileiros.

Analise o perfil abaixo e gere um diagnóstico personalizado, concreto e acionável.

Responda EXCLUSIVAMENTE em JSON válido (sem markdown, sem \`\`\`):

{
  "resumo_perfil": "Uma frase resumindo quem é esta pessoa e seu moment",
  "nivel_maturidade_ia": "Iniciante | Explorador | Praticante",
  "score_potencial_ia": 85,
  "casos_de_uso": [
    {
      "titulo": "Nome do caso de uso",
      "descricao": "O que é e por que se aplica a este perfil (2-3 frases)",
      "impacto": "Alto | Médio",
      "facilidade": "Fácil | Moderado | Avançado",
      "tempo_economizado_semana": "X horas",
      "exemplo_pratico": "Passo a passo concreto de como essa pessoa usaria isso amanhã mesmo",
      "ferramentas": [
        {
          "nome": "Nome da ferramenta",
          "porque": "Por que esta especificamente pra este caso",
          "custo": "Gratuito | Freemium | Pago (R$X/mês)",
          "link": "URL real e funcional"
        }
      ]
    }
  ],
  "plano_acao_30_dias": {
    "semana_1": "Ação específica e simples para começar",
    "semana_2": "Próximo passo construindo sobre a semana 1",
    "semana_3": "Expandir para mais um caso de uso",
    "semana_4": "Consolidar e medir resultados"
  },
  "mensagem_final": "Frase personalizada e encorajadora"
}

Regras obrigatórias:
- Gere entre 4 e 6 casos de uso, ordenados por impacto
- Seja ULTRA específico para a combinação exata de área + cargo + atividades
- Nada genérico — se a pessoa é "Gerente de RH", os casos devem ser de RH
- Ferramentas devem ser reais, atuais, acessíveis no Brasil
- Priorize ferramentas com planos gratuitos ou freemium
- Links devem ser URLs reais (verificáveis)
- O score_potencial_ia vai de 0-100 baseado em quantas das atividades da pessoa podem ser potencializadas com IA
- Plano de 30 dias deve ser progressivo e realista pra quem tem pouco tempo
- Linguagem acessível, zero jargão técnico, tom empático`;

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

  const userPrompt = `Perfil do profissional:

- Nome: ${profileData.nome}
- Cargo/Função: ${profileData.cargo}
- Área de Atuação: ${profileData.area}
- Nível Hierárquico: ${profileData.nivel_hierarquico}
- Tamanho da Empresa: ${profileData.tamanho_empresa}

Rotina — Atividades que mais tomam tempo:
${profileData.atividades_tempo.map((a) => `• ${a}`).join('\n')}

Relação com IA:
- Uso atual: ${profileData.uso_ia_atual}
- Barreiras: ${profileData.barreiras_ia.join(', ')}

O que busca com IA:
${profileData.expectativas_ia.map((e) => `• ${e}`).join('\n')}

Gere o diagnóstico personalizado completo em JSON.`;

  const startTime = Date.now();

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
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
