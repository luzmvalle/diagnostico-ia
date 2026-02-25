'use client';

import { useEffect, useState } from 'react';
import ScoreCircular from '@/components/Resultado/ScoreCircular';
import CasoDeUsoCard from '@/components/Resultado/CasoDeUsoCard';
import PlanoAcao from '@/components/Resultado/PlanoAcao';

const maturityConfig = {
  Iniciante: { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
  Explorador: { color: 'text-accent-purple-light', bg: 'bg-accent-purple/20', border: 'border-accent-purple/30' },
  Praticante: { color: 'text-accent-green', bg: 'bg-accent-green/20', border: 'border-accent-green/30' },
};

export default function ResultadoPage() {
  const [diagnostico, setDiagnostico] = useState(null);
  const [nome, setNome] = useState('');

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('diag_resultado');
      const storedNome = sessionStorage.getItem('diag_nome');
      if (stored) {
        setDiagnostico(JSON.parse(stored));
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
          <h1 className="text-2xl font-bold text-white mb-4">Nenhum diagnÃ³stico encontrado</h1>
          <p className="text-gray-400 mb-6">FaÃ§a o questionÃ¡rio primeiro para receber seu diagnÃ³stico.</p>
          <a href="/" className="btn-primary inline-block">
            Fazer diagnÃ³stico
          </a>
        </div>
      </div>
    );
  }

  const maturity = maturityConfig[diagnostico.nivel_maturidade_ia] || maturityConfig.Iniciante;

  const shareText = encodeURIComponent(
    `Acabei de descobrir meu potencial com IA: score ${diagnostico.score_potencial_ia}/100! ð\n\nFiz um diagnÃ³stico gratuito e recebi um plano personalizado com ${diagnostico.casos_de_uso?.length || 0} casos de uso prÃ¡ticos para minha Ã¡rea.\n\nFaÃ§a o seu tambÃ©m:`
  );

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
              DiagnÃ³stico IA <span className="text-gray-500 font-normal text-sm">por Destrava Lab</span>
            </span>
          </div>
          <a href="/" className="btn-secondary text-sm py-1.5 px-4">
            Refazer
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-8">
        {/* Hero Card */}
        <div className="card p-8 mb-8 animate-fade-in bg-gradient-to-br from-dark-800 to-dark-800/50 border-gray-700/30">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Score */}
            <div className="flex-shrink-0">
              <ScoreCircular score={diagnostico.score_potencial_ia || 0} size={160} />
              <p className="text-center text-gray-400 text-xs mt-2">Potencial com IA</p>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {nome ? `OlÃ¡, ${nome}!` : 'Seu DiagnÃ³stico'}
              </h1>
              <p className="text-gray-300 text-lg mb-4 leading-relaxed">
                {diagnostico.resumo_perfil}
              </p>
              <div className="inline-flex items-center gap-2">
                <span
                  className={`badge ${maturity.bg} ${maturity.color} text-sm px-4 py-1.5 ${maturity.border} border`}
                >
                  {diagnostico.nivel_maturidade_ia}
                </span>
                <span className="text-gray-500 text-sm">
                  {diagnostico.casos_de_uso?.length || 0} oportunidades identificadas
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Casos de Uso */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            Seus casos de uso de IA
          </h2>
          <div className="grid gap-4">
            {(diagnostico.casos_de_uso || []).map((caso, i) => (
              <CasoDeUsoCard key={i} caso={caso} index={i} />
            ))}
          </div>
        </section>

        {/* Plano de AÃ§Ã£o */}
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

        {/* Action Buttons */}
        <section className="text-center mb-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}&summary=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Compartilhar no LinkedIn
            </a>
            <a href="/" className="btn-secondary inline-flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refazer diagnÃ³stico
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700/50 py-6 text-center">
        <p className="text-gray-500 text-sm">
          Feito por{' '}
          <a
            href="https://youtube.com/@destravalabai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-purple-light hover:underline"
          >
            Destrava Lab
          </a>
          {' '}â IA prÃ¡tica para profissionais
        </p>
      </footer>
    </div>
  );
}
