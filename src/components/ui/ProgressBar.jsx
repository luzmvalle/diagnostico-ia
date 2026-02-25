'use client';

const stepLabels = ['Perfil', 'Rotina', 'IA', 'Objetivos'];

export default function ProgressBar({ currentStep, totalSteps = 4 }) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex justify-between mb-3">
        {stepLabels.map((label, i) => (
          <div
            key={i}
            className={`flex flex-col items-center transition-all duration-300 ${
              i + 1 <= currentStep ? 'text-accent-purple-light' : 'text-gray-500'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mb-1 transition-all duration-300 ${
                i + 1 < currentStep
                  ? 'bg-accent-purple text-white'
                  : i + 1 === currentStep
                  ? 'bg-accent-purple/20 border-2 border-accent-purple text-accent-purple-light'
                  : 'bg-dark-700 text-gray-500'
              }`}
            >
              {i + 1 < currentStep ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span className="text-xs hidden sm:block">{label}</span>
          </div>
        ))}
      </div>
      <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent-purple to-accent-green rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
