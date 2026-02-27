'use client';

import { useState } from 'react';

export default function CasoDeUsoCard({ caso, index }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(caso.prompt_pronto || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = caso.prompt_pronto || '';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div
      className="card-hover animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent-purple/20 flex items-center justify-center text-accent-purple-light font-semibold text-sm">
          {index + 1}
        </span>
        <div className="flex-1">
          <p className="text-sm text-accent-green font-medium mb-1">{caso.tipo_solucao}</p>
          <p className="text-gray-400 text-sm leading-relaxed">{caso.problema}</p>
        </div>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-accent-purple-light text-sm font-medium hover:text-accent-purple transition-colors flex items-center gap-1 mt-2"
      >
        {expanded ? 'Ver menos' : 'Ver solução completa, prompt e ferramentas'}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-700/50 animate-fade-in space-y-5">
          {/* Prompt pronto */}
          {caso.prompt_pronto && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-accent-purple-light flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Prompt pronto para usar
                </h4>
                <button
                  onClick={copyPrompt}
                  className={`text-xs font-medium px-3 py-1 rounded-lg transition-all duration-200 ${
                    copied
                      ? 'bg-accent-green/20 text-accent-green'
                      : 'bg-dark-600 text-gray-300 hover:bg-dark-500'
                  }`}
                >
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
              <div className="bg-dark-700/80 rounded-xl p-4 border border-gray-600/30">
                <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                  {caso.prompt_pronto}
                </p>
              </div>
            </div>
          )}

          {/* Como usar */}
          {caso.como_usar && (
            <div>
              <h4 className="text-sm font-semibold text-accent-green mb-2 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Como usar passo a passo
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed bg-dark-700/50 rounded-xl p-4">
                {caso.como_usar}
              </p>
            </div>
          )}

          {/* Ferramentas */}
          {caso.ferramentas && caso.ferramentas.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3">
                Ferramentas recomendadas
              </h4>
              <div className="space-y-3">
                {caso.ferramentas.map((tool, i) => (
                  <div key={i} className="flex items-start gap-3 bg-dark-700/50 rounded-xl p-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-purple/30 to-accent-green/30 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-accent-purple-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white text-sm">{tool.nome}</span>
                        <span className="badge bg-dark-600 text-gray-300 text-[10px]">
                          {tool.custo}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs mb-2">{tool.porque}</p>
                      {tool.link && (
                        <a
                          href={tool.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-purple-light text-xs hover:underline inline-flex items-center gap-1"
                        >
                          Acessar ferramenta
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
