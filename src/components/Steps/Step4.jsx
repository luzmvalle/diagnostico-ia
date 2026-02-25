'use client';

export default function Step4({ data, onChange, config }) {
  const options = config?.expectativas_options || [];
  const title = config?.step4_title || 'O que vocÃª busca';
  const subtitle =
    config?.step4_subtitle ||
    'O que vocÃª mais gostaria de conseguir com IA? (mÃ¡ximo 3)';

  const selected = data.expectativas_ia || [];

  function toggleItem(item) {
    if (selected.includes(item)) {
      onChange({ expectativas_ia: selected.filter((i) => i !== item) });
    } else if (selected.length < 3) {
      onChange({ expectativas_ia: [...selected, item] });
    }
  }

  return (
    <div className="animate-slide-up">
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-gray-400 mb-6">{subtitle}</p>

      <div className="grid gap-3">
        {options.map((option) => {
          const isActive = selected.includes(option);
          const isDisabled = !isActive && selected.length >= 3;

          return (
            <button
              key={option}
              type="button"
              onClick={() => !isDisabled && toggleItem(option)}
              disabled={isDisabled}
              className={`checkbox-card text-left flex items-center gap-3 p-4 ${
                isActive
                  ? 'checkbox-card-active'
                  : isDisabled
                  ? 'opacity-40 cursor-not-allowed'
                  : ''
              }`}
            >
              <div
                className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-all duration-200 ${
                  isActive
                    ? 'bg-accent-purple border-accent-purple'
                    : 'border-gray-500'
                }`}
              >
                {isActive && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-sm ${isActive ? 'text-white' : 'text-gray-300'}`}>
                {option}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-gray-500 text-sm mt-3">
        {selected.length}/3 selecionados
      </p>
    </div>
  );
}
