'use client';

export default function Step3({ data, onChange, config }) {
  const usoOptions = config?.uso_ia_options || [];
  const barreirasOptions = config?.barreiras_options || [];
  const title = config?.step3_title || 'Sua relação com IA';
  const subtitle =
    config?.step3_subtitle || 'Queremos entender seu momento atual com inteligência artificial';

  const selectedBarreiras = data.barreiras_ia || [];

  function toggleBarreira(item) {
    const next = selectedBarreiras.includes(item)
      ? selectedBarreiras.filter((i) => i !== item)
      : [...selectedBarreiras, item];
    onChange({ barreiras_ia: next });
  }

  return (
    <div className="animate-slide-up">
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-gray-400 mb-8">{subtitle}</p>

      {/* Uso atual */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Você já usa alguma ferramenta de IA?
        </label>
        <div className="grid gap-3">
          {usoOptions.map((option) => {
            const isActive = data.uso_ia_atual === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onChange({ uso_ia_atual: option })}
                className={`radio-card text-left flex items-center gap-3 p-4 ${
                  isActive ? 'radio-card-active' : ''
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all duration-200 ${
                    isActive ? 'border-accent-purple' : 'border-gray-500'
                  }`}
                >
                  {isActive && <div className="w-2.5 h-2.5 rounded-full bg-accent-purple" />}
                </div>
                <span className={`text-sm ${isActive ? 'text-white' : 'text-gray-300'}`}>
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Barreiras */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          O que te impede de usar mais IA? (selecione pelo menos 1)
        </label>
        <div className="grid gap-3">
          {barreirasOptions.map((option) => {
            const isActive = selectedBarreiras.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleBarreira(option)}
                className={`checkbox-card text-left flex items-center gap-3 p-4 ${
                  isActive ? 'checkbox-card-active' : ''
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
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
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
      </div>
    </div>
  );
}
