'use client';

export default function Step1({ data, onChange, config }) {
  const areas = config?.area_options || [];
  const niveis = config?.nivel_options || [];
  const tamanhos = config?.tamanho_options || [];

  const title = config?.step1_title || 'Quem Ã© vocÃª';
  const subtitle = config?.step1_subtitle || 'Conte um pouco sobre seu perfil profissional';

  return (
    <div className="animate-slide-up">
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-gray-400 mb-8">{subtitle}</p>

      <div className="space-y-5">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Seu nome
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="Como gostaria de ser chamado(a)"
            value={data.nome}
            onChange={(e) => onChange({ nome: e.target.value })}
            maxLength={100}
          />
        </div>

        {/* Cargo */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Cargo / FunÃ§Ã£o
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="Ex: Analista de Marketing, Gerente de RH..."
            value={data.cargo}
            onChange={(e) => onChange({ cargo: e.target.value })}
            maxLength={100}
          />
        </div>

        {/* Ãrea de atuaÃ§Ã£o */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ãrea de atuaÃ§Ã£o
          </label>
          <div className="relative">
            <select
              className="select-field pr-10"
              value={data.area}
              onChange={(e) => onChange({ area: e.target.value })}
            >
              <option value="">Selecione sua Ã¡rea</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* NÃ­vel hierÃ¡rquico */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            NÃ­vel hierÃ¡rquico
          </label>
          <div className="relative">
            <select
              className="select-field pr-10"
              value={data.nivel_hierarquico}
              onChange={(e) => onChange({ nivel_hierarquico: e.target.value })}
            >
              <option value="">Selecione seu nÃ­vel</option>
              {niveis.map((nivel) => (
                <option key={nivel} value={nivel}>
                  {nivel}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tamanho da empresa */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tamanho da empresa
          </label>
          <div className="relative">
            <select
              className="select-field pr-10"
              value={data.tamanho_empresa}
              onChange={(e) => onChange({ tamanho_empresa: e.target.value })}
            >
              <option value="">Selecione o tamanho</option>
              {tamanhos.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
