'use client';

import { useState, useEffect } from 'react';

const defaultMessages = [
  'Analisando seu perfil profissional...',
  'Identificando oportunidades de IA para sua área...',
  'Mapeando ferramentas ideais para você...',
  'Montando seu plano personalizado de 30 dias...',
  'Quase lá! Finalizando seu diagnóstico...',
];

export default function LoadingDiagnostico({ messages }) {
  const msgs = messages && messages.length > 0 ? messages : defaultMessages;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % msgs.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [msgs.length]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Animated spinner */}
        <div className="mb-8 relative">
          <div className="w-20 h-20 mx-auto">
            <svg className="animate-spin" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="#334155"
                strokeWidth="4"
              />
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="80 140"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Pulsing dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-accent-purple animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
        </div>

        {/* Rotating message */}
        <p
          key={currentIndex}
          className="text-lg text-gray-300 animate-fade-in"
        >
          {msgs[currentIndex]}
        </p>

        <p className="text-sm text-gray-500 mt-4">
          Isso pode levar até 30 segundos
        </p>
      </div>
    </div>
  );
}
