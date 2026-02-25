'use client';

import { useState } from 'react';

export default function CasoDeUsoCard({ caso, index }) {
  const [expanded, setExpanded] = useState(false);

  const impactoBadge =
    caso.impacto === 'Alto' ? 'badge-green' : 'badge-yellow';
  const facilidadeBadge =
    caso.facilidade === 'FÃ¡cil'
      ? 'badge-green'
      : caso.facilidade === 'Moderado'
      ? 'badge-purple'
      : 'badge-yellow';

  return (
    <div
      className="card-hover animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent-purple/20 flex items-center justify-center text-accent-purple-light font-semibold text-sm">
            {index + 1}
          </span>
          <h3 className="font-semibold text-white text-lg">{caso.titulo}</h3>
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-4 leading-relaxed">{caso.descricao}</p>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={impactoBadge}>Impacto {caso.impacto}</span>
        <span className={facilidadeBadge}>{caso.facilidade}</span>
        <span className="badge bg-blue-500/20 text-blue-400">
          ~{caso.tempo_economizado_semana}/semana
        </span>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-accent-purple-light text-sm font-medium hover:text-accent-purple transition-colors flex items-center gap-1"
      >
        {expanded ? 'Ver menos' : 'Ver exemplo prÃ¡tico e ferramentas'}
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
        <div className="mt-4 pt-4 border-t border-gray-700/50 animate-fade-in">
          {/* Exemplo prÃ¡tico */}
          <div className="mb-5">
            <h4 className="text-sm font-semibold text-accent-green mb-2">
              Como aplicar na prÃ¡tica:
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed bg-dark-700/50 rounded-xl p-4">
              {caso.exemplo_pratico}
            </p>
          </div>

          {/* Ferramentas */}
          <div>
            <h4 className="text-sm font-semibold text-accent-purple-light mb-3">
              Ferramentas recomendadas:
            </h4>
            <div className="space-y-3">
              {(caso.ferramentas || []).map((tool, i) => (
                <div key={i} className="flex items-start gap-3 bg-dark-700/50 rounded-xl p-4">
                  {/* Icon placeholder */}
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
        </div>
      )}
    </div>
  );
}
