'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, X, ClipboardList, Users, BarChart3, Copy, Check } from 'lucide-react';
import { getPesquisas, addPesquisa, deletePesquisa, type Pesquisa } from '@/lib/pesquisas-store';

const CORES = [
  'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500',
  'bg-cyan-500', 'bg-amber-500', 'bg-indigo-500', 'bg-teal-500', 'bg-rose-500', 'bg-lime-500'
];
const CORES_LIGHT = [
  'bg-blue-50 border-blue-200 text-blue-700', 'bg-red-50 border-red-200 text-red-700',
  'bg-green-50 border-green-200 text-green-700', 'bg-purple-50 border-purple-200 text-purple-700',
  'bg-orange-50 border-orange-200 text-orange-700', 'bg-pink-50 border-pink-200 text-pink-700',
  'bg-cyan-50 border-cyan-200 text-cyan-700', 'bg-amber-50 border-amber-200 text-amber-700',
  'bg-indigo-50 border-indigo-200 text-indigo-700', 'bg-teal-50 border-teal-200 text-teal-700',
  'bg-rose-50 border-rose-200 text-rose-700', 'bg-lime-50 border-lime-200 text-lime-700'
];

type Entrevistador = { id: number; nome: string; cpf: string; telefone: string; email: string; senha: string };

export default function PesquisasAdmin() {
  const [activeTab, setActiveTab] = useState<'pesquisas' | 'entrevistadores' | 'resultados'>('pesquisas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEntrevistadorModal, setIsEntrevistadorModal] = useState(false);
  const [resultadoPesquisaId, setResultadoPesquisaId] = useState<number | null>(null);
  const [relatorioEntrevistadorId, setRelatorioEntrevistadorId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [pesquisas, setPesquisas] = useState<Pesquisa[]>([]);

  // Real-time: reload from store on updates (localStorage events)
  useEffect(() => {
    setPesquisas(getPesquisas());
    const handler = () => setPesquisas(getPesquisas());
    window.addEventListener('icat_pesquisas_update', handler);
    window.addEventListener('storage', handler);
    // Poll every 5s to catch cross-tab updates
    const interval = setInterval(() => setPesquisas(getPesquisas()), 5000);
    return () => {
      window.removeEventListener('icat_pesquisas_update', handler);
      window.removeEventListener('storage', handler);
      clearInterval(interval);
    };
  }, []);

  const [entrevistadores, setEntrevistadores] = useState<Entrevistador[]>([
    { id: 1, nome: 'Carlos Silva', cpf: '111.111.111-11', telefone: '(64) 99900-1111', email: 'carlos@icat.org.br', senha: '123' },
    { id: 2, nome: 'Amanda Oliveira', cpf: '222.222.222-22', telefone: '(64) 99900-2222', email: 'amanda@icat.org.br', senha: '123' },
    { id: 3, nome: 'Roberto Santos', cpf: '333.333.333-33', telefone: '(64) 99900-3333', email: 'roberto@icat.org.br', senha: '123' },
    { id: 4, nome: 'Fernanda Lima', cpf: '444.444.444-44', telefone: '(64) 99900-4444', email: 'fernanda@icat.org.br', senha: '123' },
  ]);

  const [novaPesquisa, setNovaPesquisa] = useState({ nome: '', tipo: 'Intenção de Voto', induzida: true, multiSelect: false, metaDiaria: 50 });
  const [novasOpcoes, setNovasOpcoes] = useState<{nome: string; partido: string}[]>([{nome: '', partido: ''}, {nome: '', partido: ''}]);
  const [entrevSelecionados, setEntrevSelecionados] = useState<number[]>([]);
  const [novoEntrevistador, setNovoEntrevistador] = useState({ nome: '', cpf: '', telefone: '', email: '', senha: '' });

  const handleSavePesquisa = () => {
    if (!novaPesquisa.nome || novasOpcoes.filter(o => o.nome.trim()).length < 2) return;
    addPesquisa({
      nome: novaPesquisa.nome, tipo: novaPesquisa.tipo,
      status: 'Ativa', induzida: novaPesquisa.induzida,
      multiSelect: novaPesquisa.multiSelect,
      metaDiaria: novaPesquisa.metaDiaria,
      opcoes: novasOpcoes.filter(o => o.nome.trim()).map(o => ({ nome: o.nome.trim(), partido: o.partido.trim() || undefined, votos: 0 })),
      entrevistadores: entrevSelecionados,
    });
    setNovaPesquisa({ nome: '', tipo: 'Intenção de Voto', induzida: true, multiSelect: false, metaDiaria: 50 });
    setNovasOpcoes([{nome: '', partido: ''}, {nome: '', partido: ''}]);
    setEntrevSelecionados([]);
    setIsModalOpen(false);
  };

  const handleDeletePesquisa = (id: number) => {
    deletePesquisa(id);
    setPesquisas(getPesquisas());
  };

  const handleSaveEntrevistador = () => {
    if (!novoEntrevistador.nome || !novoEntrevistador.email) return;
    setEntrevistadores([{ id: Date.now(), ...novoEntrevistador }, ...entrevistadores]);
    setNovoEntrevistador({ nome: '', cpf: '', telefone: '', email: '', senha: '' });
    setIsEntrevistadorModal(false);
  };

  const handleCopyLink = (pesquisaId: number) => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/pesquisa/${pesquisaId}` : '';
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pesquisaResultado = pesquisas.find(p => p.id === resultadoPesquisaId);
  const totalVotos = pesquisaResultado ? pesquisaResultado.opcoes.reduce((s, o) => s + o.votos, 0) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pesquisas Urbanas</h1>
        <p className="text-gray-500 text-sm mt-1">Crie, gerencie e acompanhe pesquisas de opinião e intenção de voto.</p>
      </div>

      {/* Abas */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {([
          { key: 'pesquisas' as const, label: 'Pesquisas', icon: <ClipboardList className="w-4 h-4" /> },
          { key: 'entrevistadores' as const, label: 'Entrevistadores', icon: <Users className="w-4 h-4" /> },
          { key: 'resultados' as const, label: 'Resultados', icon: <BarChart3 className="w-4 h-4" /> },
        ]).map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.key ? 'bg-white text-icat-green shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ ABA PESQUISAS ═══ */}
      {activeTab === 'pesquisas' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center"><Plus className="w-5 h-5 mr-2" /> Nova Pesquisa</button>
          </div>
          <div className="space-y-3">
            {pesquisas.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-gray-900 text-lg">{p.nome}</h3>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.status === 'Ativa' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{p.status}</span>
                    </div>
                    <p className="text-sm text-gray-500">{p.tipo} · {p.induzida ? 'Induzida' : 'Espontânea'} · {p.opcoes.length} opções</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleCopyLink(p.id)} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5">
                      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />} Link Externo
                    </button>
                    <button onClick={() => { setResultadoPesquisaId(p.id); setActiveTab('resultados'); }} className="text-xs bg-icat-blue/10 text-icat-blue hover:bg-icat-blue/20 px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5" /> Resultados
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {p.opcoes.map((op, j) => (
                    <span key={j} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${CORES_LIGHT[j % CORES_LIGHT.length]}`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${CORES[j % CORES.length]}`}></span> {op.nome} {op.partido && <span className="opacity-70 text-[10px]">({op.partido})</span>}
                    </span>
                  ))}
                  {!p.induzida && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border border-dashed border-gray-300 text-gray-400">+ Outro</span>}
                </div>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium">Entrevistadores:</span>
                    <div className="flex -space-x-2">
                      {p.entrevistadores.map(eId => {
                        const e = entrevistadores.find(x => x.id === eId);
                        return e ? (
                          <div key={eId} className="h-7 w-7 rounded-full bg-gradient-to-br from-icat-blue to-icat-green text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm" title={e.nome}>
                            {e.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                    <span>Meta: {p.metaDiaria || 0}/dia</span>
                    <button onClick={() => {
                      const m = prompt('Nova meta diária:', String(p.metaDiaria || 50));
                      if (m && !isNaN(Number(m))) {
                        import('@/lib/pesquisas-store').then(mod => {
                          mod.updatePesquisa(p.id, { metaDiaria: Number(m) });
                          setPesquisas(mod.getPesquisas());
                        });
                      }
                    }} className="text-icat-blue hover:underline font-semibold ml-1">Editar</button>
                  </div>
                  <span className="text-xs text-gray-400 ml-auto">{p.opcoes.reduce((s, o) => s + o.votos, 0)} respostas</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ ABA ENTREVISTADORES ═══ */}
      {activeTab === 'entrevistadores' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setIsEntrevistadorModal(true)} className="btn-primary flex items-center"><Plus className="w-5 h-5 mr-2" /> Novo Entrevistador</button>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase bg-gray-50">
                  <th className="p-4 font-semibold text-left">Nome</th>
                  <th className="p-4 font-semibold text-center">CPF</th>
                  <th className="p-4 font-semibold text-center">Telefone</th>
                  <th className="p-4 font-semibold text-center">E-mail (Login)</th>
                  <th className="p-4 font-semibold text-center">Pesquisas</th>
                  <th className="p-4 font-semibold text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {entrevistadores.map(e => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setRelatorioEntrevistadorId(e.id)}>
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-icat-blue to-icat-green text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">
                          {e.nome.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900 group-hover:text-icat-blue transition-colors border-b border-transparent group-hover:border-icat-blue">{e.nome}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 text-sm text-center">{e.cpf}</td>
                    <td className="p-4 text-gray-600 text-sm text-center">{e.telefone}</td>
                    <td className="p-4 text-center"><code className="text-xs bg-gray-100 px-2 py-1 rounded">{e.email}</code></td>
                    <td className="p-4 text-center"><span className="text-xs font-bold text-icat-blue">{pesquisas.filter(p => p.entrevistadores.includes(e.id)).length}</span></td>
                    <td className="p-4 text-center space-x-2">
                      <button onClick={() => { setEntrevistadores(entrevistadores.map(x => x.id === e.id ? { ...x, senha: '123' } : x)); alert('Senha resetada para 123'); }} className="p-2 text-gray-400 hover:text-icat-blue rounded-lg hover:bg-blue-50 transition-colors" title="Resetar Senha"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button>
                      <button onClick={() => setEntrevistadores(entrevistadores.filter(x => x.id !== e.id))} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ ABA RESULTADOS ═══ */}
      {activeTab === 'resultados' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <select value={resultadoPesquisaId || ''} onChange={e => setResultadoPesquisaId(Number(e.target.value))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none text-sm font-medium">
              <option value="">Selecione uma pesquisa para ver os resultados...</option>
              {pesquisas.map(p => <option key={p.id} value={p.id}>{p.nome} ({p.opcoes.reduce((s, o) => s + o.votos, 0)} respostas)</option>)}
            </select>
          </div>
          {pesquisaResultado && (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{pesquisaResultado.nome}</h3>
                    <p className="text-sm text-gray-500">{totalVotos} respostas coletadas</p>
                  </div>
                  <button onClick={() => window.print()} className="bg-icat-gray-light hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 print:hidden">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    Exportar PDF
                  </button>
                </div>
                <div className="space-y-4">
                  {pesquisaResultado.opcoes.slice().sort((a, b) => b.votos - a.votos).map((op, j) => {
                    const pct = totalVotos > 0 ? Math.round((op.votos / totalVotos) * 100) : 0;
                    const origIdx = pesquisaResultado.opcoes.findIndex(o => o.nome === op.nome);
                    return (
                      <div key={j}>
                        <div className="flex justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`w-3.5 h-3.5 rounded-full ${CORES[origIdx % CORES.length]}`}></span>
                            <span className="text-sm font-semibold text-gray-900">{op.nome} {op.partido && <span className="text-gray-400 text-xs ml-1">({op.partido})</span>}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">{pct}%</span>
                            <span className="text-xs text-gray-400">({op.votos})</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                          <div className={`h-4 rounded-full transition-all duration-700 ${CORES[origIdx % CORES.length]}`} style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50"><h4 className="font-bold text-gray-900 text-sm">Últimas Respostas</h4></div>
                {pesquisaResultado.respostas.length > 0 ? (
                  <table className="w-full text-left">
                    <thead><tr className="border-b border-gray-100 text-xs text-gray-500 uppercase"><th className="p-3 font-semibold">Entrevistado</th><th className="p-3 font-semibold">Telefone</th><th className="p-3 font-semibold">Resposta</th><th className="p-3 font-semibold">Entrevistador</th><th className="p-3 font-semibold">Data</th></tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {pesquisaResultado.respostas.map((r, ri) => (
                        <tr key={ri} className="hover:bg-gray-50 text-sm">
                          <td className="p-3 font-medium text-gray-900">{r.entrevistado}</td>
                          <td className="p-3 text-gray-500">{r.telefone}</td>
                          <td className="p-3"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${CORES_LIGHT[r.opcaoIdx % CORES_LIGHT.length]}`}><span className={`w-2 h-2 rounded-full ${CORES[r.opcaoIdx % CORES.length]}`}></span>{pesquisaResultado.opcoes[r.opcaoIdx]?.nome}</span></td>
                          <td className="p-3 text-gray-500">{entrevistadores.find(e => e.id === r.entrevistadorId)?.nome || '-'}</td>
                          <td className="p-3 text-gray-400 text-xs">{r.data}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (<div className="p-8 text-center text-gray-400 text-sm">Nenhuma resposta coletada ainda.</div>)}
              </div>
            </>
          )}
        </div>
      )}

      {/* ═══ MODAL NOVA PESQUISA ═══ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Criar Nova Pesquisa</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Pesquisa</label>
                <input type="text" value={novaPesquisa.nome} onChange={e => setNovaPesquisa({ ...novaPesquisa, nome: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="Ex: Intenção de Voto — Prefeito Catalão 2026" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select value={novaPesquisa.tipo} onChange={e => setNovaPesquisa({ ...novaPesquisa, tipo: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none">
                    <option>Intenção de Voto</option><option>Opinião</option><option>Enquete</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Formato</label>
                  <select value={novaPesquisa.induzida ? 'true' : 'false'} onChange={e => setNovaPesquisa({ ...novaPesquisa, induzida: e.target.value === 'true' })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none">
                    <option value="true">Induzida (fixas)</option>
                    <option value="false">Espontânea (+ Outro)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Diária</label>
                  <input type="number" min="1" value={novaPesquisa.metaDiaria} onChange={e => setNovaPesquisa({ ...novaPesquisa, metaDiaria: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => setNovaPesquisa({...novaPesquisa, multiSelect: !novaPesquisa.multiSelect})} className={`relative w-11 h-6 rounded-full transition-colors ${novaPesquisa.multiSelect ? 'bg-icat-green' : 'bg-gray-300'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${novaPesquisa.multiSelect ? 'translate-x-6' : 'translate-x-1'}`}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Permitir múltipla escolha <span className="text-gray-400 font-normal">(ex: pesquisas de opinião)</span></span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opções de Resposta</label>
                <div className="space-y-2">
                  {novasOpcoes.map((op, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded-full flex-shrink-0 ${CORES[i % CORES.length]}`}></span>
                      <input type="text" value={op.nome} onChange={e => { const arr = [...novasOpcoes]; arr[i].nome = e.target.value; setNovasOpcoes(arr); }} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none text-sm" placeholder={`Opção ${i + 1}`} />
                      <input type="text" value={op.partido} onChange={e => { const arr = [...novasOpcoes]; arr[i].partido = e.target.value; setNovasOpcoes(arr); }} className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none text-sm" placeholder="Partido" />
                      {novasOpcoes.length > 2 && <button onClick={() => setNovasOpcoes(novasOpcoes.filter((_, j) => j !== i))} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>}
                    </div>
                  ))}
                </div>
                <button onClick={() => setNovasOpcoes([...novasOpcoes, {nome: '', partido: ''}])} className="mt-2 text-sm text-icat-blue font-semibold hover:underline flex items-center gap-1"><Plus className="w-4 h-4" /> Adicionar Opção</button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Atribuir Entrevistadores</label>
                <div className="flex flex-wrap gap-2">
                  {entrevistadores.map(e => (
                    <label key={e.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors text-sm font-medium ${entrevSelecionados.includes(e.id) ? 'bg-green-50 border-green-300 text-green-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      <input type="checkbox" className="hidden" checked={entrevSelecionados.includes(e.id)} onChange={() => setEntrevSelecionados(prev => prev.includes(e.id) ? prev.filter(x => x !== e.id) : [...prev, e.id])} />
                      <Check className={`w-4 h-4 ${entrevSelecionados.includes(e.id) ? 'text-green-500' : 'text-gray-300'}`} /> {e.nome}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900">Cancelar</button>
              <button onClick={handleSavePesquisa} className="btn-primary">Criar Pesquisa</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODAL NOVO ENTREVISTADOR ═══ */}
      {isEntrevistadorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsEntrevistadorModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Novo Entrevistador</h2>
              <button onClick={() => setIsEntrevistadorModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label><input type="text" value={novoEntrevistador.nome} onChange={e => setNovoEntrevistador({ ...novoEntrevistador, nome: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">CPF</label><input type="text" value={novoEntrevistador.cpf} onChange={e => setNovoEntrevistador({ ...novoEntrevistador, cpf: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="000.000.000-00" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label><input type="text" value={novoEntrevistador.telefone} onChange={e => setNovoEntrevistador({ ...novoEntrevistador, telefone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="(64) 99000-0000" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">E-mail (Login)</label><input type="email" value={novoEntrevistador.email} onChange={e => setNovoEntrevistador({ ...novoEntrevistador, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="email@exemplo.com" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Senha (Padrão: 123456)</label><input type="password" value={novoEntrevistador.senha} onChange={e => setNovoEntrevistador({ ...novoEntrevistador, senha: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="123456" /></div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsEntrevistadorModal(false)} className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900">Cancelar</button>
              <button onClick={handleSaveEntrevistador} className="btn-primary">Cadastrar</button>
            </div>
          </div>
        </div>
      )}
      {relatorioEntrevistadorId !== null && (() => {
        const entrevistador = entrevistadores.find(e => e.id === relatorioEntrevistadorId);
        if (!entrevistador) return null;
        
        // Coleta de estatísticas (mock simples)
        // No mundo real, filtraríamos as pesquisas e agruparíamos por data.
        const respostasDele = pesquisas.flatMap(p => p.respostas.filter(r => r.entrevistadorId === entrevistador.id));
        const total = respostasDele.length;
        const porDia = respostasDele.reduce((acc, r) => {
          const d = r.data.split(' ')[0]; // dd/mm/yyyy
          acc[d] = (acc[d] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const media = Object.keys(porDia).length > 0 ? (total / Object.keys(porDia).length).toFixed(1) : '0';

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setRelatorioEntrevistadorId(null)}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-icat-blue to-icat-green text-white flex items-center justify-center font-bold text-2xl shadow-sm">
                    {entrevistador.nome.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{entrevistador.nome}</h2>
                    <p className="text-sm text-gray-500">Relatório de Desempenho</p>
                  </div>
                </div>
                <button onClick={() => setRelatorioEntrevistadorId(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 overflow-y-auto space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 text-center">
                    <p className="text-3xl font-black text-icat-blue mb-1">{total}</p>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total de Entrevistas</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 text-center">
                    <p className="text-3xl font-black text-icat-green mb-1">{media}</p>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Média por Dia</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Atendimentos por Dia</h3>
                  {Object.keys(porDia).length === 0 ? (
                    <p className="text-gray-500 text-sm">Nenhuma entrevista registrada ainda.</p>
                  ) : (
                    <div className="space-y-3">
                      {Object.entries(porDia).map(([data, qtde]) => (
                        <div key={data} className="flex items-center gap-4">
                          <span className="text-sm font-medium text-gray-600 w-24">{data}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                            <div className="bg-gradient-to-r from-icat-blue to-icat-green h-full rounded-full" style={{ width: `${Math.min((qtde / 50) * 100, 100)}%` }}></div>
                          </div>
                          <span className="text-sm font-bold text-gray-900 w-12 text-right">{qtde}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
