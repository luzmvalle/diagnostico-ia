'use client';

export default function Step3({ data, onChange, config }) {
  const usoOptions = config?.uso_ia_options || [];
  const ferramentasOptions = config?.ferramentas_ia_options || [];
  const barreirasOptions = config?.barreiras_options || [];
  const title = config?.step3_title || 'Sua relação com IA';
  const subtitle =
    config?.step3_subtitle || 'Queremos entender seu momento atual com inteligência artificial';

  const selectedBarreiras = data.barreiras_ia || [];
  const selectedFerramentas = data.ferramentas_ia || [];

  function toggleBarreira(item) {
    if (selectedBarreiras.includes(item)) {
      onChange({ barreiras_ia: selectedBarreiras.filter((i) => i !== item) });
    } else if (selectedBarreiras.length < 3) {
      onChange({ barreiras_ia: [...selectedBarreiras, item] });
    }
  }

  function toggleFerramenta(item) {
    const next = selectedFerramentas.includes(item)
      ? selectedFerramentas.filter((i) => i !== item)
      : [...selectedFerramentas, item];
    onChange({ ferramentas_ia: next });
  }

  // Show ferramentas section only if user has some experience with AI
  const showFerramentas = data.uso_ia_atual && data.uso_ia_atual !== 'Nunca usei nenhuma ferramenta de IA';

  return (
    <div className="animate-slide-up">
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-gray-400 mb-8">{subtitle}</p>

      {/* Uso atual — 5 levels */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Como você usa IA hoje?
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

      {/* Ferramentas que já usa — conditional */}
      {showFerramentas && (
        <div className="mb-8 animate-fade-in">
          <label className="block text-sm font-medium text-gray-300 mb-4">
            Quais ferramentas de IA você já usa?
            <span className="text-gray-500 ml-1 font-normal">(opcional)</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ferramentasOptions.map((option) => {
              const isActive = selectedFerramentas.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleFerramenta(option)}
                  className={`checkbox-card text-left flex items-center gap-2 p-3 ${
                    isActive ? 'checkbox-card-active' : ''
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border-2 transition-all duration-200 ${
                      isActive
                        ? 'bg-accent-purple border-accent-purple'
                        : 'border-gray-500'
                    }`}
                  >
                    {isActive && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-xs ${isActive ? 'text-white' : 'text-gray-300'}`}>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
          {/* Campo para outra ferramenta */}
          <input
            type="text"
            className="input-field mt-3 text-sm"
            placeholder="Usa outra ferramenta? Qual?"
            value={data.outra_ferramenta || ''}
            onChange={(e) => onChange({ outra_ferramenta: e.target.value })}
            maxLength={100}
          />
        </div>
      )}

      {/* Barreiras — max 3 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          O que te impede de usar mais IA? (selecione 1 a 3)
        </label>
        <div className="grid gap-3">
          {barreirasOptions.map((option) => {
            const isActive = selectedBarreiras.includes(option);
            const isDisabled = !isActive && selectedBarreiras.length >= 3;

            return (
              <button
                key={option}
                type="button"
                onClick={() => !isDisabled && toggleBarreira(option)}
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
        {selectedBarreiras.length > 0 && (
          <p className="text-gray-500 text-sm mt-3">
            {selectedBarreiras.length}/3 selecionadas
          </p>
        )}
      </div>
    </div>
  );
}
