'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/ui/ProgressBar';
import LoadingDiagnostico from '@/components/ui/LoadingDiagnostico';
import Step1 from '@/components/Steps/Step1';
import Step2 from '@/components/Steps/Step2';
import Step3 from '@/components/Steps/Step3';
import Step4 from '@/components/Steps/Step4';

// ============================
// LANDING SECTION
// ============================
function Landing({ config, onStart }) {
  const title = config?.landing_title || 'Descubra como a IA pode transformar seu dia a dia profissional';
  const subtitle = config?.landing_subtitle || 'Responda 4 perguntas rápidas e receba um diagnóstico personalizado com ferramentas e casos de uso prontos para aplicar';
  const cta = config?.landing_cta || 'Fazer meu diagnóstico gratuito';

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl text-center animate-fade-in">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-green flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent-purple/20">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <p className="text-accent-purple-light text-sm font-medium tracking-widest uppercase mb-4">
            Diagnóstico IA — por Destrava Lab
          </p>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
          {title}
        </h1>

        <p className="text-lg text-gray-400 leading-relaxed mb-10 max-w-xl mx-auto">
          {subtitle}
        </p>

        <button onClick={onStart} className="btn-primary text-lg py-4 px-10 shadow-lg shadow-accent-purple/20">
          {cta}
        </button>

        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            2 minutos
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            100% gratuito
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Sem cadastro
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================
// DEFAULT CONFIG (fallback if API fails)
// ============================
const DEFAULT_CONFIG = {
  step1_title: 'Quem é você',
  step1_subtitle: 'Conte um pouco sobre seu perfil profissional',
  area_options: ['Marketing', 'Vendas', 'Financeiro', 'RH', 'Operações', 'Jurídico', 'Produto', 'Consultoria', 'Saúde', 'Educação', 'Outro'],
  nivel_options: ['Analista/Especialista', 'Coordenador', 'Gerente', 'Diretor', 'C-Level'],
  tamanho_options: ['1-50 funcionários', '51-200 funcionários', '201-1000 funcionários', '1000+ funcionários'],
  step2_title: 'Sua rotina',
  step2_subtitle: 'Quais dessas atividades tomam mais seu tempo? (selecione pelo menos 2)',
  atividades_options: ['Escrever documentos, emails, relatórios', 'Analisar dados e planilhas', 'Criar apresentações', 'Pesquisar informações', 'Atender clientes/stakeholders', 'Organizar e planejar projetos', 'Revisar e aprovar materiais', 'Reuniões e alinhamentos', 'Gestão de pessoas', 'Processos repetitivos/manuais'],
  step3_title: 'Sua relação com IA',
  step3_subtitle: 'Queremos entender seu momento atual com inteligência artificial',
  uso_ia_options: ['Não uso nenhuma', 'Uso de vez em quando', 'Uso regularmente'],
  barreiras_options: ['Não sei por onde começar', 'Não sei quais ferramentas usar', 'Tenho medo de errar ou gerar resultados ruins', 'Minha empresa não permite ou não incentiva', 'Não vejo aplicação pro que eu faço', 'Falta de tempo pra aprender'],
  step4_title: 'O que você busca',
  step4_subtitle: 'O que você mais gostaria de conseguir com IA? (máximo 3)',
  expectativas_options: ['Economizar tempo em tarefas repetitivas', 'Melhorar a qualidade do que produzo', 'Tomar decisões mais embasadas', 'Automatizar processos', 'Ser mais criativo', 'Me destacar profissionalmente'],
  landing_title: 'Descubra como a IA pode transformar seu dia a dia profissional',
  landing_subtitle: 'Responda 4 perguntas rápidas e receba um diagnóstico personalizado com ferramentas e casos de uso prontos para aplicar',
  landing_cta: 'Fazer meu diagnóstico gratuito',
  loading_messages: ['Analisando seu perfil profissional...', 'Identificando oportunidades de IA para sua área...', 'Mapeando ferramentas ideais para você...', 'Montando seu plano personalizado de 30 dias...', 'Quase lá! Finalizando seu diagnóstico...'],
  footer_text: 'Feito por Destrava Lab — IA prática para profissionais',
  footer_youtube: 'https://youtube.com/@destravalabai',
};

// ============================
// MAIN PAGE
// ============================
export default function HomePage() {
  const router = useRouter();
  const [phase, setPhase] = useState('landing'); // landing | form | loading | error
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [visitId, setVisitId] = useState(null);
  const [error, setError] = useState('');
  const sessionIdRef = useRef(null);

  const [formData, setFormData] = useState({
    nome: '',
    cargo: '',
    area: '',
    nivel_hierarquico: '',
    tamanho_empresa: '',
    atividades_tempo: [],
    uso_ia_atual: '',
    barreiras_ia: [],
    expectativas_ia: [],
  });

  // Load config on mount
  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/admin/config');
        if (!res.ok) return; // Keep defaults
        const data = await res.json();
        if (!Array.isArray(data)) return; // Keep defaults
        const map = {};
        data.forEach((c) => {
          map[c.id] = c.value;
        });
        setConfig((prev) => ({ ...prev, ...map }));
      } catch {
        // Keep defaults
      }
    }
    loadConfig();
  }, []);

  // Session ID for tracking
  function getSessionId() {
    if (sessionIdRef.current) return sessionIdRef.current;

    if (typeof window !== 'undefined') {
      let sid = sessionStorage.getItem('diag_session_id');
      if (!sid) {
        sid = 'sid_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
        sessionStorage.setItem('diag_session_id', sid);
      }
      sessionIdRef.current = sid;
      return sid;
    }
    return null;
  }

  // Track step
  async function trackStep(stepNum) {
    try {
      const res = await fetch('/api/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: getSessionId(),
          step: stepNum,
        }),
      });
      const data = await res.json();
      if (data.visit_id) setVisitId(data.visit_id);
    } catch {
      // silent
    }
  }

  function handleStart() {
    setPhase('form');
    trackStep(0);
  }

  function updateFormData(updates) {
    setFormData((prev) => ({ ...prev, ...updates }));
  }

  // Validation per step
  function validateStep() {
    switch (step) {
      case 1:
        return (
          formData.nome.trim() &&
          formData.cargo.trim() &&
          formData.area &&
          formData.nivel_hierarquico &&
          formData.tamanho_empresa
        );
      case 2:
        return formData.atividades_tempo.length >= 2;
      case 3:
        return formData.uso_ia_atual && formData.barreiras_ia.length >= 1;
      case 4:
        return formData.expectativas_ia.length >= 1 && formData.expectativas_ia.length <= 3;
      default:
        return false;
    }
  }

  function nextStep() {
    if (!validateStep()) return;
    if (step < 4) {
      const next = step + 1;
      setStep(next);
      trackStep(next);
    } else {
      handleSubmit();
    }
  }

  function prevStep() {
    if (step > 1) setStep(step - 1);
  }

  async function handleSubmit() {
    setPhase('loading');
    setError('');

    try {
      const res = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          visit_id: visitId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro desconhecido');
      }

      // Store result in sessionStorage
      sessionStorage.setItem('diag_resultado', JSON.stringify(data.diagnostico));
      sessionStorage.setItem('diag_nome', formData.nome);

      // Navigate to result
      router.push('/resultado');
    } catch (err) {
      setError(err.message);
      setPhase('error');
    }
  }

  // ---- RENDER ----

  if (phase === 'landing') {
    return <Landing config={config} onStart={handleStart} />;
  }

  if (phase === 'loading') {
    const loadingMessages = config?.loading_messages;
    return <LoadingDiagnostico messages={loadingMessages} />;
  }

  if (phase === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-3">Ops! Algo deu errado</h2>
          <p className="text-gray-400 mb-2">{error}</p>
          <p className="text-gray-500 text-sm mb-6">Suas respostas foram mantidas. Tente novamente.</p>
          <button onClick={() => handleSubmit()} className="btn-primary">
            Tentar novamente
          </button>
          <button
            onClick={() => { setPhase('form'); setStep(4); }}
            className="btn-secondary ml-3"
          >
            Voltar ao formulário
          </button>
        </div>
      </div>
    );
  }

  // Form phase
  const isValid = validateStep();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-700/50 bg-dark-900/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-purple to-accent-green flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-semibold text-white text-sm">Diagnóstico IA</span>
          </div>
          <span className="text-gray-500 text-sm">Etapa {step} de 4</span>
        </div>
      </header>

      {/* Progress */}
      <div className="pt-6 px-4">
        <ProgressBar currentStep={step} />
      </div>

      {/* Step content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 pb-32">
        {step === 1 && <Step1 data={formData} onChange={updateFormData} config={config} />}
        {step === 2 && <Step2 data={formData} onChange={updateFormData} config={config} />}
        {step === 3 && <Step3 data={formData} onChange={updateFormData} config={config} />}
        {step === 4 && <Step4 data={formData} onChange={updateFormData} config={config} />}
      </div>

      {/* Navigation buttons - fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark-900/90 backdrop-blur-sm border-t border-gray-700/50 py-4 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={prevStep}
            className={`btn-secondary ${step === 1 ? 'invisible' : ''}`}
          >
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </span>
          </button>

          <button
            onClick={nextStep}
            disabled={!isValid}
            className="btn-primary"
          >
            <span className="flex items-center gap-1">
              {step === 4 ? 'Gerar meu diagnóstico' : 'Continuar'}
              {step < 4 && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              {step === 4 && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
