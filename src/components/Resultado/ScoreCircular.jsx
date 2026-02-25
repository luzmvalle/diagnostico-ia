'use client';

import { useEffect, useState } from 'react';

export default function ScoreCircular({ score = 0, size = 140 }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  const color =
    score >= 80
      ? '#10b981'
      : score >= 60
      ? '#8b5cf6'
      : score >= 40
      ? '#f59e0b'
      : '#ef4444';

  useEffect(() => {
    const duration = 1500;
    const start = performance.now();

    function animate(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setAnimatedScore(Math.round(eased * score));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="score-circle" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#334155"
          strokeWidth="6"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-white">{animatedScore}</span>
        <span className="text-xs text-gray-400">de 100</span>
      </div>
    </div>
  );
}
