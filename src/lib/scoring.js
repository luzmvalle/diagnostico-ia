// ============================
// SCORING LOCAL — Diagnóstico IA v2
// Calcula sub-scores e nível de maturidade sem depender do Gemini
// ============================

// Peso de potencial de automação por atividade (0-1)
const ATIVIDADE_PESOS = {
  'Escrever documentos, emails, relatórios': 0.95,
  'Analisar dados e planilhas': 0.90,
  'Criar apresentações': 0.85,
  'Pesquisar informações': 0.90,
  'Atender clientes/stakeholders': 0.70,
  'Organizar e planejar projetos': 0.75,
  'Revisar e aprovar materiais': 0.80,
  'Reuniões e alinhamentos': 0.65,
  'Gestão de pessoas': 0.50,
  'Processos repetitivos/manuais': 0.95,
};

// Peso do nível de uso atual (1-5 mapeado para score)
const USO_IA_SCORES = {
  'Nunca usei nenhuma ferramenta de IA': 0,
  'Já experimentei mas não uso no trabalho': 20,
  'Uso ocasionalmente (ChatGPT, Gemini ou similar)': 45,
  'Uso quase todo dia em tarefas específicas': 70,
  'Uso IA integrada em vários processos do meu trabalho': 95,
};

// Peso invertido das barreiras (maior peso = mais bloqueio = menor prontidão)
const BARREIRA_PESOS = {
  'Não sei por onde começar nem o que existe': 0.85,
  'Não confio nos resultados / tenho medo de errar': 0.70,
  'Simplesmente não tive tempo/prioridade de explorar': 0.40,
  'Não vejo aplicação específica pro que eu faço': 0.75,
  'Uso de maneira descentralizada, sem integração real no trabalho': 0.30,
  'Não sei como evoluir a forma que uso': 0.35,
  'Preocupação com privacidade/segurança dos dados': 0.50,
  'Minha empresa não permite ou não tem política clara sobre IA': 0.60,
};

// Peso de expectativas (indica abertura/intenção)
const EXPECTATIVA_PESOS = {
  'Economizar tempo em tarefas repetitivas': 0.70,
  'Melhorar a qualidade do que produzo': 0.75,
  'Tomar decisões mais embasadas': 0.80,
  'Automatizar processos': 0.85,
  'Ser mais criativo(a)': 0.70,
  'Me destacar profissionalmente': 0.65,
  'Aprender a criar prompts melhores': 0.80,
  'Integrar IA com ferramentas que já uso': 0.90,
  'Entender o que existe além do ChatGPT': 0.75,
};

/**
 * Calcula os 3 sub-scores e o nível de maturidade
 * @param {Object} formData - Dados do formulário
 * @returns {Object} { potencial_automacao, nivel_adocao, prontidao, nivel_maturidade, nivel_maturidade_descricao }
 */
export function calculateScores(formData) {
  // 1. Potencial de Automação (0-100)
  // Baseado nas atividades selecionadas e seus pesos
  const atividades = formData.atividades_tempo || [];
  let somaAtividades = 0;
  atividades.forEach((a) => {
    somaAtividades += (ATIVIDADE_PESOS[a] || 0.60);
  });
  const potencial_automacao = atividades.length > 0
    ? Math.round((somaAtividades / atividades.length) * 100)
    : 50;

  // 2. Nível de Adoção Atual (0-100)
  // Baseado no uso declarado + quantidade de ferramentas que já usa
  const usoBase = USO_IA_SCORES[formData.uso_ia_atual] ?? 25;
  const ferramentas = formData.ferramentas_ia || [];
  const ferramentasBonus = Math.min(ferramentas.length * 8, 30); // até +30 pontos por ferramentas
  const nivel_adocao = Math.min(100, Math.round(usoBase + ferramentasBonus));

  // 3. Prontidão para Avançar (0-100)
  // Baseado nas barreiras (invertido) + expectativas
  const barreiras = formData.barreiras_ia || [];
  let somaBarreiras = 0;
  barreiras.forEach((b) => {
    somaBarreiras += (BARREIRA_PESOS[b] || 0.50);
  });
  const barreiraPenalty = barreiras.length > 0
    ? (somaBarreiras / barreiras.length) * 40 // penalidade média até -40
    : 0;

  const expectativas = formData.expectativas_ia || [];
  let somaExpectativas = 0;
  expectativas.forEach((e) => {
    somaExpectativas += (EXPECTATIVA_PESOS[e] || 0.70);
  });
  const expectativaBonus = expectativas.length > 0
    ? (somaExpectativas / expectativas.length) * 50 // bônus médio até +50
    : 25;

  const prontidao = Math.min(100, Math.max(0,
    Math.round(50 - barreiraPenalty + expectativaBonus)
  ));

  // 4. Nível de Maturidade
  // Determinado primariamente pelo uso declarado, ajustado pelos sub-scores
  const scoreGeral = (nivel_adocao * 0.5) + (potencial_automacao * 0.2) + (prontidao * 0.3);

  let nivel_maturidade;
  let nivel_maturidade_descricao;

  if (usoBase <= 0) {
    nivel_maturidade = 'Curioso(a)';
    nivel_maturidade_descricao = 'Você ainda não começou a usar IA no trabalho, mas tem interesse em explorar. Este é o momento perfeito para dar o primeiro passo.';
  } else if (usoBase <= 20) {
    nivel_maturidade = 'Explorador(a)';
    nivel_maturidade_descricao = 'Você já experimentou ferramentas de IA e entende o potencial. Agora é hora de encontrar aplicações práticas para o seu dia a dia.';
  } else if (usoBase <= 45) {
    if (scoreGeral >= 55) {
      nivel_maturidade = 'Praticante';
      nivel_maturidade_descricao = 'Você já usa IA com frequência e tem boa noção do que funciona. O próximo passo é sistematizar e expandir seus usos.';
    } else {
      nivel_maturidade = 'Explorador(a)';
      nivel_maturidade_descricao = 'Você usa IA ocasionalmente mas pode ir muito além. Vamos identificar as melhores oportunidades para sua rotina.';
    }
  } else if (usoBase <= 70) {
    nivel_maturidade = 'Praticante';
    nivel_maturidade_descricao = 'Você usa IA diariamente em tarefas específicas. O próximo passo é criar workflows integrados e explorar ferramentas especializadas.';
  } else {
    if (scoreGeral >= 75) {
      nivel_maturidade = 'Estrategista';
      nivel_maturidade_descricao = 'Você já tem IA integrada nos seus processos. Seu próximo nível é otimizar workflows, criar automações avançadas e talvez até ajudar colegas.';
    } else {
      nivel_maturidade = 'Integrador(a)';
      nivel_maturidade_descricao = 'Você já usa IA de forma integrada no trabalho. Há oportunidades de ir ainda mais fundo com automações e integrações entre ferramentas.';
    }
  }

  return {
    potencial_automacao,
    nivel_adocao,
    prontidao,
    nivel_maturidade,
    nivel_maturidade_descricao,
    score_geral: Math.round(scoreGeral),
  };
}
