-- ============================================
-- DIAGNÃSTICO IA â Seed SQL para Supabase
-- ============================================
-- Execute este script no SQL Editor do Supabase

-- 1. EXTENSÃES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELAS

-- Tracking de visitas/funil
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  current_step INT DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  user_agent TEXT,
  referrer TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_visits_session_id ON visits(session_id);
CREATE INDEX idx_visits_created_at ON visits(created_at);
CREATE INDEX idx_visits_ip_hash ON visits(ip_hash);

-- Respostas completas do questionÃ¡rio + diagnÃ³stico
CREATE TABLE IF NOT EXISTS responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID REFERENCES visits(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL,
  area TEXT NOT NULL,
  nivel_hierarquico TEXT NOT NULL,
  tamanho_empresa TEXT NOT NULL,
  atividades_tempo TEXT[] DEFAULT '{}',
  uso_ia_atual TEXT NOT NULL,
  barreiras_ia TEXT[] DEFAULT '{}',
  expectativas_ia TEXT[] DEFAULT '{}',
  diagnostico_json JSONB,
  tokens_usados INT DEFAULT 0,
  tempo_geracao_ms INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_responses_created_at ON responses(created_at);
CREATE INDEX idx_responses_area ON responses(area);
CREATE INDEX idx_responses_visit_id ON responses(visit_id);

-- ConfiguraÃ§Ãµes editÃ¡veis das perguntas
CREATE TABLE IF NOT EXISTS question_config (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ROW LEVEL SECURITY

ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_config ENABLE ROW LEVEL SECURITY;

-- Visits: insert pÃºblico (anon), select apenas autenticado
CREATE POLICY "visits_insert_anon" ON visits
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "visits_update_anon" ON visits
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "visits_select_auth" ON visits
  FOR SELECT TO authenticated USING (true);

-- Responses: insert pÃºblico (anon), select apenas autenticado
CREATE POLICY "responses_insert_anon" ON responses
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "responses_select_auth" ON responses
  FOR SELECT TO authenticated USING (true);

-- Question Config: leitura pÃºblica, escrita autenticado
CREATE POLICY "config_select_public" ON question_config
  FOR SELECT TO anon USING (true);

CREATE POLICY "config_select_auth" ON question_config
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "config_update_auth" ON question_config
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "config_insert_auth" ON question_config
  FOR INSERT TO authenticated WITH CHECK (true);

-- 4. FUNÃÃO para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_question_config_updated
  BEFORE UPDATE ON question_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 5. SEED: Dados iniciais da question_config

-- Etapa 1 â Quem Ã© vocÃª
INSERT INTO question_config (id, label, value) VALUES
('step1_title', 'TÃ­tulo da Etapa 1', '"Quem Ã© vocÃª"'),
('step1_subtitle', 'SubtÃ­tulo da Etapa 1', '"Conte um pouco sobre seu perfil profissional"'),
('area_options', 'OpÃ§Ãµes de Ãrea de AtuaÃ§Ã£o', '["Marketing", "Vendas", "Financeiro", "RH", "OperaÃ§Ãµes", "JurÃ­dico", "Produto", "Consultoria", "SaÃºde", "EducaÃ§Ã£o", "Outro"]'),
('nivel_options', 'OpÃ§Ãµes de NÃvel HierÃ¡rquico', '["Analista/Especialista", "Coordenador", "Gerente", "Diretor", "C-Level"]'),
('tamanho_options', 'OpÃ§Ãµes de Tamanhn de Empresa', '["1-50 funcionÃ¡rios", "51-200 funcionÃ¡rios", "201-1000 funcionÃ¡rios", "1000+ funcionÃ¡rios"]')
ON CONFLICT (id) DO NOTHING;

-- Etapa 2 â Sua rotina
INSERT INTO question_config (id, label, value) VALUES
('step2_title', 'TÃ­tulo da Etapa 2', '"Sua rotina"'),
('step2_subtitle', 'SubtÃ­tulo da Etapa 2', '"Quais dessas atividades tomam mais seu tempo? (selecione pelo menos 2)"'),
('atividades_options', 'OpÃ§Ãµes de Atividades', '["Escrever documentos, emails, relatÃ³rios", "Analisar dados e planilhas", "Criar apresentaÃ§Ãµes", "Pesquisar informaÃ§Ãµes", "Atender clientes/stakeholders", "Organizar e planejar projetos", "Revisar e aprovar materiais", "ReuniÃ¹es e alinhamentos", "GestÃ£o de pessoas", "Processos repetitivos/manuais"]')
ON CONFLICT (id) DO NOTHING;

-- Etapa 3 â Sua relaÃ§Ã£o com IA
INSERT INTO question_config (id, label, value) VALUES
('step3_title', 'TÃ­tulo da Etapa 3', '"Sua relaÃ§Ã£o com IA"'),
('step3_subtitle', 'SubtÃ­tulo da Etapa 3', '"Queremos entender seu momento atual com inteligÃªncia artificial"'),
('uso_ia_options', 'OpÃ§Ãµes de Uso Atual de IA', '["NÃ£o uso nenhum ", "Uso de vez em quando", "Uso regularmente"]'),
('barreiras_options', 'OpÃ§Ãµes de Barreiras', '["NÃ£o sei por onde comeÃ§ar", "NÃ£o sei quais ferramentas usar", "Tenho medo de errar ou gerar resultados ruins", "Minha empresa nÃ£o permite ou nÃ£o incentiva", "NÃ£o vejo aplicaÃ§Ã£o pro que eu faÃ§o", "Falta de tempo pra aprender"]')
ON CONFLICT (id) DO NOTHING;

-- Etapa 4 â O que vocÃª busca
INSERT INTO question_config (id, label, value) VALUES
('step4_title', 'TÃ­tulo da Etapa 4', '"O que vocÃª busca"'),
('step4_subtitle', 'SubtÃ­tulo da Etapa 4', '"O que vocÃª mais gostaria de conseguir com IA? (mÃ¡ximo 3)"'),
('expectativas_options', 'OpÃ§Ãµes de Expectativas', '["Economizar tempo em tarefas repetitivas", "Melhorar a qualidade do que produzo", "Tomar decisÃµes mais embasadas", "Automatizar processos", "Ser mais criativo", "Me destacar profissionalmente"]')
ON CONFLICT (id) DO NOTHING;

-- Textos gerais
INSERT INTO question_config (id, label, value) VALUES
('landing_title', 'TÃ­tulo da Landing Page', '"Descubra como a IA pode transformar seu dia a dia profissional"'),
('landing_subtitle', 'SubtÃ­tulo da Landing Page', '"Responda 4 perguntas rÃ¡pidas e receba um diagnÃ³stico personalizado com ferramentas e casos de uso prontos para aplicar"'),
('landing_cta', 'Texto do BotÃ£o CTA', '"Fazer meu diagnÃ³stico gratuito"'),
('loading_messages', 'Mensagens durante geraÃ§Ã£o', '["Analisando seu perfil profissional...", "Identificando oportunidades de IA para sua Ã¡rea...", "Mapeando ferramentas ideais para vocÃª...", "Montando seu plano personalizado de 30 dias...", "Quase lÃ¡! Finalizando seu diagnÃ³stico..."]'),
('footer_text', 'Texto do Footer', '"Feito por Destrava Lab â IA prÃ¡tica para profissionais"'),
('footer_youtube', 'Link do YouTube', '"https://youtube.com/@destravalabai"')
ON CONFLICT (id) DO NOTHING;
