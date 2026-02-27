'use client';

export default function Step2({ data, onChange, config }) {
  const options = config?.atividades_options || [];
  const title = config?.step2_title || 'Sua rotina';
  const subtitle =
    config?.step2_subtitle ||
    'Quais dessas atividades tomam mais seu tempo? (selecione pelo menos 2)';

  const selected = data.atividades_tempo || [];

  function toggleItem(item) {
    const next = selected.includes(item)
      ? selected.filter((i) => i !== item)
      : [...selected, item];
    onChange({ atividades_tempo: next });
  }

  return (
    <div className="animate-slide-up">
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-gray-400 mb-6">{subtitle}</p>

      <div className="grid gap-3">
        {options.map((option) => {
          const isActive = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleItem(option)}
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

      {selected.length > 0 && selected.length < 2 && (
        <p className="text-yellow-400/80 text-sm mt-3">
          Selecione pelo menos 2 atividades
        </p>
      )}

      {/* Campo aberto opcional */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Descreva brevemente o que mais toma seu tempo no dia a dia
          <span className="text-gray-600 ml-1">(opcional)</span>
        </label>
        <textarea
          className="input-field resize-none"
          rows={3}
          maxLength={300}
          placeholder="Ex: Passo muito tempo formatando relatórios semanais e compilando dados de diferentes fontes..."
          value={data.descricao_rotina || ''}
          onChange={(e) => onChange({ descricao_rotina: e.target.value })}
        />
        <p className="text-gray-600 text-xs mt-1 text-right">
          {(data.descricao_rotina || '').length}/300
        </p>
      </div>
    </div>
  );
}
