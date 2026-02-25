'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// ============================
// TAB: MÉTRICAS
// ============================
function MetricasTab({ token }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/metrics', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMetrics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  if (loading) return <div className="text-gray-400 py-8 text-center">Carregando métricas...</div>;
  if (!metrics) return <div className="text-red-400 py-8 text-center">Erro ao carregar métricas</div>;

  const funnelLabels = [
    { key: 'step_0', label: 'Landing' },
    { key: 'step_1', label: 'Etapa 1' },
    { key: 'step_2', label: 'Etapa 2' },
    { key: 'step_3', label: 'Etapa 3' },
    { key: 'step_4', label: 'Etapa 4' },
    { key: 'completed', label: 'Diagnóstico' },
  ];

  const maxFunnel = Math.max(...funnelLabels.map((f) => metrics.funnel?.[f.key] || 0), 1);

  const areaEntries = Object.entries(metrics.byArea || {}).sort((a, b) => b[1] - a[1]);
  const maxArea = Math.max(...areaEntries.map(([, v]) => v), 1);

  const nivelEntries = Object.entries(metrics.byNivel || {}).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-white">{metrics.totalVisits}</p>
          <p className="text-gray-400 text-sm mt-1">Visitas</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-accent-green">{metrics.totalDiagnosticos}</p>
          <p className="text-gray-400 text-sm mt-1">Diagnósticos</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-accent-purple-light">{metrics.taxaConversao}%</p>
          <p className="text-gray-400 text-sm mt-1">Taxa de Conversão</p>
        </div>
      </div>

      {/* Funnel */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Funil de Conversão</h3>
        <div className="space-y-3">
          {funnelLabels.map((f) => {
            const val = metrics.funnel?.[f.key] || 0;
            const pct = (val / maxFunnel) * 100;
            return (
              <div key={f.key} className="flex items-center gap-3">
                <span className="text-sm text-gray-400 w-24 text-right">{f.label}</span>
                <div className="flex-1 h-6 bg-dark-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent-purple to-accent-green rounded-full flex items-center justify-end pr-2 text-xs font-medium text-white transition-all duration-500"
                    style={{ width: `${Math.max(pct, 5)}%` }}
                  >
                    {val}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per Day */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Diagnósticos por Dia (últimos 30 dias)</h3>
        {Object.keys(metrics.perDay || {}).length === 0 ? (
          <p className="text-gray-500 text-sm">Renhum dado ainda</p>
        ) : (
          <div className="flex items-end gap-1 h-32 overflow-x-auto">
            {Object.entries(metrics.perDay).map(([day, count]) => {
              const maxDay = Math.max(...Object.values(metrics.perDay), 1);
              const h = (count / maxDay) * 100;
              return (
                <div key={day} className="flex flex-col items-center gap-1 min-w-[2rem]">
                  <span className="text-[10px] text-gray-400">{count}</span>
                  <div
                    className="w-5 bg-accent-purple rounded-t transition-all"
                    style={{ height: `${Math.max(h, 4)}%` }}
                  />
                  <span className="text-[9px] text-gray-500 -rotate-45 origin-top-left whitespace-nowrap">
                    {day.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* By Area + By Nivel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Por Área</h3>
          <div className="space-y-2">
            {areaEntries.map(([area, count]) => (
              <div key={area} className="flex items-center gap-2">
                <span className="text-sm text-gray-300 w-28 truncate">{area}</span>
                <div className="flex-1 h-4 bg-dark-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-purple rounded-full"
                    style={{ width: `${(count / maxArea) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-400 w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Por Nível</h3>
          <div className="space-y-2">
            {nivelEntries.map(([nivel, count]) => (
              <div key={nivel} className="flex items-center gap-2">
                <span className="text-sm text-gray-300 w-32 truncate">{nivel}</span>
                <span className="text-lg font-semibold text-accent-green">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================
// TAB: RESPOSTAS
// ============================
function RespostasTab({ token }) {
  const [responses, setResponses] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ area: '', nivel: '', from: '', to: '' });
  const [selectedResponse, setSelectedResponse] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (filters.area) params.set('area', filters.area);
      if (filters.nivel) params.set('nivel', filters.nivel);
      if (filters.from) params.set('from', filters.from);
      if (filters.to) params.set('to', filters.to);

      const res = await fetch(`/api/admin/responses?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setResponses(data.responses || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, page, filters]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleExport() {
    const res = await fetch('/api/admin/export', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnostico-ia-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      {/* Filters */}
      <div className="card p-4 mb-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Área</label>
          <select
            className="select-field text-sm py-1.5"
            value={filters.area}
            onChange={(e) => { setFilters({ ...filters, area: e.target.value }); setPage(1); }}
          >
            <option value="">Todas</option>
            {['Marketing','Vendas','Financeiro','RH','Operações','Jurídico','Produto','Consultoria','Saúde','Educação','Outro'].map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Nível</label>
          <select
            className="select-field text-sm py-1.5"
            value={filters.nivel}
            onChange={(e) => { setFilters({ ...filters, nivel: e.target.value }); setPage(1); }}
          >
            <option value="">Todos</option>
            {['Analista/Especialista','Coordenador','Gerente','Diretor','C-Level'].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">De</label>
          <input type="date" className="input-field text-sm py-1.5" value={filters.from} onChange={(e) => { setFilters({ ...filters, from: e.target.value }); setPage(1); }} />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Até</label>
          <input type="date" className="input-field text-sm py-1.5" value={filters.to} onChange={(e) => { setFilters({ ...filters, to: e.target.value }); setPage(1); }} />
        </div>
        <button onClick={handleExport} className="btn-secondary text-sm py-1.5 ml-auto">
          Exportar CSV
        </button>
      </div>

      <p className="text-gray-400 text-sm mb-3">{total} respostas encontradas</p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              {['Data', 'Nome', 'Cargo', 'Área', 'Nível', 'Maturidade', 'Score'].map((h) => (
                <th key={h} className="text-left py-3 px-3 text-gray-400 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-500">Carregando...</td></tr>
            ) : responses.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-500">Nenhuma resposta</td></tr>
            ) : (
              responses.map((r) => {
                const diag = r.diagnostico_json || {};
                return (
                  <tr
                    key={r.id}
                    className="border-b border-gray-800 hover:bg-dark-700/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedResponse(r)}
                  >
                    <td className="py-2.5 px-3 text-gray-400">{r.created_at?.slice(0, 10)}</td>
                    <td className="py-2.5 px-3 text-white">{r.nome}</td>
                    <td className="py-2.5 px-3 text-gray-300">{r.cargo}</td>
                    <td className="py-2.5 px-3"><span className="badge-purple">{r.area}</span></td>
                    <td className="py-2.5 px-3 text-gray-300">{r.nivel_hierarquico}</td>
                    <td className="py-2.5 px-3 text-gray-300">{diag.nivel_maturidade_ia || '—'}</td>
                    <td className="py-2.5 px-3 font-semibold text-accent-green">{diag.score_potencial_ia || '—'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button className="btn-secondary text-sm py-1 px-3" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Anterior
          </button>
          <span className="text-gray-400 text-sm">{page} / {totalPages}</span>
          <button className="btn-secondary text-sm py-1 px-3" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Próxima
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedResponse(null)}>
          <div className="bg-dark-800 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">{selectedResponse.nome}</h3>
              <button onClick={() => setSelectedResponse(null)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="text-gray-400">Cargo:</span> <span className="text-white ml-2">{selectedResponse.cargo}</span></div>
              <div><span className="text-gray-400">Área:</span> <span className="text-white ml-2">{selectedResponse.area}</span></div>
              <div><span className="text-gray-400">Nível:</span> <span className="text-white ml-2">{selectedResponse.nivel_hierarquico}</span></div>
              <div><span className="text-gray-400">Empresa:</span> <span className="text-white ml-2">{selectedResponse.tamanho_empresa}</span></div>
              <div><span className="text-gray-400">Uso IA:</span> <span className="text-white ml-2">{selectedResponse.uso_ia_atual}</span></div>
              <div><span className="text-gray-400">Atividades:</span> <span className="text-white ml-2">{(selectedResponse.atividades_tempo || []).join(', ')}</span></div>
              <div><span className="text-gray-400">Barreiras:</span> <span className="text-white ml-2">{(selectedResponse.barreiras_ia || []).join(', ')}</span></div>
              <div><span className="text-gray-400">Expectativas:</span> <span className="text-white ml-2">{(selectedResponse.expectativas_ia || []).join(', ')}</span></div>
              <hr className="border-gray-700" />
              <div><span className="text-gray-400">Tokens:</span> <span className="text-white ml-2">{selectedResponse.tokens_usados}</span></div>
              <div><span className="text-gray-400">Tempo de geração:</span> <span className="text-white ml-2">{selectedResponse.tempo_geracao_ms}ms</span></div>
              <hr className="border-gray-700" />
              <div>
                <span className="text-gray-400 block mb-2">Diagnóstico completo:</span>
                <pre className="bg-dark-900 rounded-xl p-4 text-xs text-gray-300 overflow-x-auto max-h-96">
                  {JSON.stringify(selectedResponse.diagnostico_json, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================
// TAB: CONFIGURAÇÕES
// ============================
function ConfigTab({ token }) {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [editValues, setEditValues] = useState({});

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/config');
        const data = await res.json();
        setConfigs(data);
        const edits = {};
        data.forEach((c) => {
          edits[c.id] = typeof c.value === 'string' ? c.value : JSON.stringify(c.value, null, 2);
        });
        setEditValues(edits);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave(id) {
    setSaving({ ...saving, [id]: true });
    try {
      let parsedValue;
      try {
        parsedValue = JSON.parse(editValues[id]);
      } catch {
        parsedValue = editValues[id];
      }

      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, value: parsedValue }),
      });

      if (!res.ok) throw new Error('Falha ao salvar');
    } catch (err) {
      alert('Erro ao salvar: ' + err.message);
    } finally {
      setSaving({ ...saving, [id]: false });
    }
  }

  if (loading) return <div className="text-gray-400 py-8 text-center">Carregando configurações...</div>;

  return (
    <div className="space-y-4">
      <p className="text-gray-400 text-sm mb-4">
        Edite os textos e opções do questionário. Para arrays, use formato JSON: [&quot;item1&quot;, &quot;item2&quot;]
      </p>

      {configs.map((c) => {
        const isArray = Array.isArray(c.value);

        return (
          <div key={c.id} className="card p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h4 className="font-medium text-white text-sm">{c.label}</h4>
                <code className="text-xs text-gray-500">{c.id}</code>
              </div>
              <button
                onClick={() => handleSave(c.id)}
                disabled={saving[c.id]}
                className="btn-primary text-sm py-1.5 px-4 flex-shrink-0"
              >
                {saving[c.id] ? 'Salvando...' : 'Salvar'}
              </button>
            </div>

            {isArray ? (
              <textarea
                className="input-field font-mono text-sm min-h-[100px]"
                value={editValues[c.id] || ''}
                onChange={(e) => setEditValues({ ...editValues, [c.id]: e.target.value })}
                rows={Math.min(10, (c.value?.length || 3) + 2)}
              />
            ) : (
              <input
                type="text"
                className="input-field text-sm"
                value={editValues[c.id] || ''}
                onChange={(e) => setEditValues({ ...editValues, [c.id]: e.target.value })}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================
// MAIN ADMIN PAGE
// ============================
export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('metricas');
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!s) {
        router.push('/admin/login');
      } else {
        setSession(s);
      }
      setLoading(false);
    });
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Carregando...</div>;
  if (!session) return null;

  const tabs = [
    { id: 'metricas', label: 'Métricas', icon: '📊' },
    { id: 'respostas', label: 'Respostas', icon: '📋' },
    { id: 'config', label: 'Configurações', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-700/50 bg-dark-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-green flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-white text-sm">Admin — Diagnóstico IA</span>
          </div>
          <button onClick={handleLogout} className="text-gray-400 text-sm hover:text-white transition-colors">
            Sair
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-dark-800 rounded-xl p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-accent-purple text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'metricas' && <MetricasTab token={session.access_token} />}
        {activeTab === 'respostas' && <RespostasTab token={session.access_token} />}
        {activeTab === 'config' && <ConfigTab token={session.access_token} />}
      </div>
    </div>
  );
}
