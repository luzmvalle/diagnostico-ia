'use client';

import { useEffect, useState } from 'react';
import CasoDeUsoCard from '@/components/Resultado/CasoDeUsoCard';
import PlanoAcao from '@/components/Resultado/PlanoAcao';

const maturityConfig = {
  'Curioso(a)': { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30', emoji: '' },
  'Explorador(a)': { color: 'text-accent-purple-light', bg: 'bg-accent-purple/20', border: 'border-accent-purple/30', emoji: '' },
  'Praticante': { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', emoji: '' },
  'Integrador(a)': { color: 'text-accent-green', bg: 'bg-accent-green/20', border: 'border-accent-green/30', emoji: '' },
  'Estrategista': { color: 'text-pink-400', bg: 'bg-pink-500/20', border: 'border-pink-500/30', emoji: '' },
  // Backwards compatibility
  'Iniciante': { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30', emoji: '' },
  'Explorador': { color: 'text-accent-purple-light', bg: 'bg-accent-purple/20', border: 'border-accent-purple/30', emoji: '' },
};

function ScoreBar({ label, value, color }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-400">{label}</span>
        <span className={`text-sm font-bold ${color}`}>{value}/100</span>
      </div>
      <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${
            value >= 70 ? 'bg-accent-green' : value >= 40 ? 'bg-accent-purple' : 'bg-yellow-500'
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function DicaFerramentaCard({ dica }) {
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(dica.prompt_exemplo || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="badge bg-accent-purple/20 text-accent-purple-light text-xs">{dica.ferramenta}</span>
        <span className="text-xs text-gray-500">Você já usa</span>
      </div>
      <p className="text-gray-300 text-sm mb-3">{dica.dica}</p>
      {dica.prompt_exemplo && (
        <div className="bg-dark-700/80 rounded-lg p-3 border border-gray-600/30 relative">
          <p className="text-gray-200 text-xs leading-relaxed whitespace-pre-wrap font-mono pr-16">
            {dica.prompt_exemplo}
          </p>
          <button
            onClick={copyPrompt}
            className={`absolute top-2 right-2 text-xs px-2 py-1 rounded transition-all ${
              copied ? 'bg-accent-green/20 text-accent-green' : 'bg-dark-500 text-gray-400 hover:text-white'
            }`}
          >
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function ResultadoPage() {
  const [diagnostico, setDiagnostico] = useState(null);
  const [scoring, setScoring] = useState(null);
  const [nome, setNome] = useState('');

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('diag_resultado');
      const storedScoring = sessionStorage.getItem('diag_scoring');
      const storedNome = sessionStorage.getItem('diag_nome');
      if (stored) {
        setDiagnostico(JSON.parse(stored));
      }
      if (storedScoring) {
        setScoring(JSON.parse(storedScoring));
      }
      if (storedNome) {
        setNome(storedNome);
      }
    } catch {
      // ignore
    }
  }, []);

  if (!diagnostico) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Nenhum diagnóstico encontrado</h1>
          <p className="text-gray-400 mb-6">Faça o questionário primeiro para receber seu diagnóstico.</p>
          <a href="/" className="btn-primary inline-block">
            Fazer diagnóstico
          </a>
        </div>
      </div>
    );
  }

  const nivel = scoring?.nivel_maturidade || diagnostico.nivel_maturidade_ia || 'Explorador(a)';
  const maturity = maturityConfig[nivel] || maturityConfig['Explorador(a)'];
  const nivelDescricao = scoring?.nivel_maturidade_descricao || '';

  const casosDeUso = diagnostico.casos_de_uso || [];
  const dicasFerramentas = diagnostico.dicas_ferramentas_atuais || [];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="border-b border-gray-700/50 bg-dark-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-green flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-white">
              Diagnóstico IA <span className="text-gray-500 font-normal text-sm">por Destrava Lab</span>
            </span>
          </div>
          <a href="/" className="btn-secondary text-sm py-1.5 px-4">
            Refazer
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-8">
        {/* Hero Card — Perfil + Maturidade + Sub-scores */}
        <div className="card p-8 mb-8 animate-fade-in bg-gradient-to-br from-dark-800 to-dark-800/50 border-gray-700/30">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Info */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {nome ? `Olá, ${nome}!` : 'Seu Diagnóstico'}
              </h1>
              <p className="text-gray-300 text-base mb-4 leading-relaxed">
                {diagnostico.resumo_perfil}
              </p>
              <div className="inline-flex items-center gap-2 mb-4">
                <span
                  className={`badge ${maturity.bg} ${maturity.color} text-sm px-4 py-1.5 ${maturity.border} border`}
                >
                  {nivel}
                </span>
                <span className="text-gray-500 text-sm">
                  {casosDeUso.length} oportunidades identificadas
                </span>
              </div>
              {nivelDescricao && (
                <p className="text-gray-400 text-sm leading-relaxed">{nivelDescricao}</p>
              )}
            </div>

            {/* Right: Sub-scores */}
            {scoring && (
              <div className="md:w-72 flex-shrink-0 space-y-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Seus indicadores</h3>
                <ScoreBar
                  label="Potencial de automação"
                  value={scoring.potencial_automacao || 0}
                  color="text-accent-green"
                />
                <ScoreBar
                  label="Nível de adoção atual"
                  value={scoring.nivel_adocao || 0}
                  color="text-accent-purple-light"
                />
                <ScoreBar
                  label="Prontidão para avançar"
                  value={scoring.prontidao || 0}
                  color="text-blue-400"
                />
              </div>
            )}
          </div>
        </div>

        {/* Casos de Uso */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            Oportunidades de IA para você
          </h2>
          <div className="grid gap-4">
            {casosDeUso.map((caso, i) => (
              <CasoDeUsoCard key={i} caso={caso} index={i} />
            ))}
          </div>
        </section>

        {/* Dicas para ferramentas que já usa */}
        {dicasFerramentas.length > 0 && (
          <section className="mb-12 animate-slide-up">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
              Potencial não explorado nas suas ferramentas
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {dicasFerramentas.map((dica, i) => (
                <DicaFerramentaCard key={i} dica={dica} />
              ))}
            </div>
          </section>
        )}

        {/* Plano de Ação */}
        <section className="mb-12">
          <PlanoAcao plano={diagnostico.plano_acao_30_dias} />
        </section>

        {/* Mensagem Final */}
        {diagnostico.mensagem_final && (
          <section className="mb-12 animate-slide-up">
            <div className="card p-8 text-center bg-gradient-to-r from-accent-purple/10 via-dark-800 to-accent-green/10 border-accent-purple/20">
              <svg className="w-10 h-10 text-accent-green mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
              <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto">
                {diagnostico.mensagem_final}
              </p>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="text-center mb-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/" className="btn-secondary inline-flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refazer diagnóstico
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700/50 py-6 text-center">
        <p className="text-gray-500 text-sm">
          Feito por{' '}
          <a
            href="https://youtube.com/@destravalab"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-purple-light hover:underline"
          >
            Destrava Lab
          </a>
          {' '} — IA prática para profissionais
        </p>
      </footer>
    </div>
  );
}
