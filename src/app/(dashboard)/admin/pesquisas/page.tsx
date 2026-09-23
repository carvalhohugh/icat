'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, X, ClipboardList, Users, BarChart3, Copy, Check, Download, Wand2, Eye, Link2 } from 'lucide-react';
import { getPesquisas, addPesquisa, deletePesquisa, type Pesquisa } from '@/lib/pesquisas-store';
import { PrintHeader } from '@/components/PrintHeader';

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
  const [visiblePasswords, setVisiblePasswords] = useState<Record<number, boolean>>({});
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
    { id: 1, nome: 'Carlos Silva', cpf: '111.111.111-11', telefone: '(64) 99900-1111', email: 'carlos@institutocatalano.com.br', senha: '123' },
    { id: 2, nome: 'Amanda Oliveira', cpf: '222.222.222-22', telefone: '(64) 99900-2222', email: 'amanda@institutocatalano.com.br', senha: '123' },
    { id: 3, nome: 'Roberto Santos', cpf: '333.333.333-33', telefone: '(64) 99900-3333', email: 'roberto@institutocatalano.com.br', senha: '123' },
    { id: 4, nome: 'Fernanda Lima', cpf: '444.444.444-44', telefone: '(64) 99900-4444', email: 'fernanda@institutocatalano.com.br', senha: '123' },
  ]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('icat_entrevistadores');
      if (saved) {
        setEntrevistadores(JSON.parse(saved));
      } else {
        localStorage.setItem('icat_entrevistadores', JSON.stringify(entrevistadores));
      }
    } catch(e) {}
  }, []);

  const updateEntrevistadores = (newLista: Entrevistador[]) => {
    setEntrevistadores(newLista);
    localStorage.setItem('icat_entrevistadores', JSON.stringify(newLista));
  };

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
    updateEntrevistadores([{ id: Date.now(), ...novoEntrevistador }, ...entrevistadores]);
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
  const totalVotos = pesquisaResultado?.opcoes.reduce((s, o) => s + o.votos, 0) || 0;
  const topOpcao = pesquisaResultado && totalVotos > 0 ? pesquisaResultado.opcoes.reduce((prev, current) => (prev.votos > current.votos) ? prev : current) : null;
  const entrevistador = entrevistadores.find(e => e.id === relatorioEntrevistadorId);
  const pesquisasDoEntrevistador = pesquisas.filter(p => p.entrevistadores.includes(relatorioEntrevistadorId!));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pesquisas & Entrevistadores</h1>
          <p className="text-gray-500 text-sm mt-1">Configure as pesquisas de intenção de voto ou mercado que vão rodar nos tablets.</p>
        </div>
      </div>

      {/* ═══ ABAS ═══ */}
      <div className="border-b border-gray-200 print:hidden">
        <nav className="-mb-px flex space-x-8">
          <button onClick={() => setActiveTab('pesquisas')} className={`${activeTab === 'pesquisas' ? 'border-icat-blue text-icat-blue font-bold' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap pb-4 px-1 border-b-2 text-sm`}>
            Minhas Pesquisas
          </button>
          <button onClick={() => setActiveTab('entrevistadores')} className={`${activeTab === 'entrevistadores' ? 'border-icat-blue text-icat-blue font-bold' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap pb-4 px-1 border-b-2 text-sm`}>
            Equipe de Rua (Entrevistadores)
          </button>
          <button onClick={() => setActiveTab('resultados')} className={`${activeTab === 'resultados' ? 'border-icat-blue text-icat-blue font-bold' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap pb-4 px-1 border-b-2 text-sm`}>
            Relatórios e Resultados
          </button>
        </nav>
      </div>

      {/* ═══ ABA PESQUISAS ═══ */}
      {activeTab === 'pesquisas' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center"><Plus className="w-5 h-5 mr-2" /> Nova Pesquisa</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pesquisas.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col hover:shadow-md transition-shadow relative">
                <div className="absolute top-4 right-4 flex items-center gap-1">
                  <button className="p-1.5 text-gray-400 hover:text-icat-green rounded-md hover:bg-green-50 transition-colors" title="Copiar Link Público (Aberto)" onClick={() => {
                    const url = typeof window !== 'undefined' ? `${window.location.origin}/pesquisa/${p.id}` : `https://institutocatalano.com.br/pesquisa/${p.id}`;
                    navigator.clipboard.writeText(url);
                    alert("Link público da pesquisa copiado! Envie pelo WhatsApp para coletas anônimas.");
                  }}>
                    <Link2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-icat-blue rounded-md hover:bg-blue-50 transition-colors" title="Copiar Link do Entrevistador" onClick={() => {
                    const url = typeof window !== 'undefined' ? `${window.location.origin}/entrevistador?pesquisa=${p.id}` : `https://institutocatalano.com.br/entrevistador?pesquisa=${p.id}`;
                    navigator.clipboard.writeText(url);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}>
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleDeletePesquisa(p.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors" title="Excluir"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.status === 'Ativa' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{p.status}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-semibold">{p.tipo}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 pr-12">{p.nome}</h3>
                <div className="space-y-1 mb-4 flex-1">
                  {p.opcoes.slice(0, 3).map((o, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 truncate pr-2"><div className={`w-2 h-2 rounded-full ${CORES[i % CORES.length]}`}></div><span className="text-gray-600 truncate">{o.nome}</span></div>
                      <span className="font-semibold text-gray-900 bg-gray-50 px-2 py-0.5 rounded text-xs">{o.votos}</span>
                    </div>
                  ))}
                  {p.opcoes.length > 3 && <div className="text-xs text-gray-400 pl-3.5 pt-1">+{p.opcoes.length - 3} opções...</div>}
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
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md ml-auto">
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
                  <th className="p-4 font-semibold text-center">Senha</th>
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
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded w-20 text-center">
                          {visiblePasswords[e.id] ? e.senha : '******'}
                        </code>
                        <button onClick={() => setVisiblePasswords(prev => ({ ...prev, [e.id]: !prev[e.id] }))} className="text-gray-400 hover:text-icat-blue" title="Visualizar Senha">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-center"><span className="text-xs font-bold text-icat-blue">{pesquisas.filter(p => p.entrevistadores.includes(e.id)).length}</span></td>
                    <td className="p-4 text-center space-x-2">
                      <button onClick={() => { updateEntrevistadores(entrevistadores.map(x => x.id === e.id ? { ...x, senha: '123' } : x)); alert('Senha resetada para 123'); }} className="p-2 text-gray-400 hover:text-icat-blue rounded-lg hover:bg-blue-50 transition-colors" title="Resetar Senha"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button>
                      <button onClick={() => updateEntrevistadores(entrevistadores.filter(x => x.id !== e.id))} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 max-w-2xl mx-auto print:hidden">
            <select value={resultadoPesquisaId || ''} onChange={e => setResultadoPesquisaId(Number(e.target.value))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none text-sm font-medium">
              <option value="">Selecione uma pesquisa para ver os resultados...</option>
              {pesquisas.map(p => <option key={p.id} value={p.id}>{p.nome} ({p.opcoes.reduce((s, o) => s + o.votos, 0)} respostas)</option>)}
            </select>
          </div>
          {pesquisaResultado && (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 print:p-0 print:border-none print:shadow-none print:block">
                <PrintHeader title={`Relatório: ${pesquisaResultado.nome}`} />
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{pesquisaResultado.nome}</h3>
                    <p className="text-sm text-gray-500">{totalVotos} respostas coletadas</p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2 print:hidden">
                    {pesquisaResultado.tipo === 'Intenção de Voto' && pesquisaResultado.opcoes.length > 2 && (
                      <button onClick={() => {
                        const candidatos = [...pesquisaResultado.opcoes]
                          .filter(o => o.nome.toLowerCase() !== 'branco/nulo' && o.nome.toLowerCase() !== 'não sabe' && o.nome.toLowerCase() !== 'indeciso')
                          .sort((a, b) => b.votos - a.votos);
                        if (candidatos.length >= 2) {
                          const c1 = candidatos[0];
                          const c2 = candidatos[1];
                          addPesquisa({
                            nome: `${pesquisaResultado.nome} — Simulação 2º Turno`,
                            tipo: 'Intenção de Voto',
                            status: 'Ativa',
                            induzida: true,
                            multiSelect: false,
                            metaDiaria: 50,
                            opcoes: [
                              { nome: c1.nome, partido: c1.partido, votos: 0 },
                              { nome: c2.nome, partido: c2.partido, votos: 0 },
                              { nome: 'Branco/Nulo', partido: '', votos: 0 },
                              { nome: 'Não Sabe', partido: '', votos: 0 }
                            ],
                            entrevistadores: pesquisaResultado.entrevistadores
                          });
                          alert(`Simulação de 2º Turno criada com sucesso entre ${c1.nome} e ${c2.nome}!`);
                          setActiveTab('pesquisas');
                        } else {
                          alert('Não há candidatos suficientes para simular 2º Turno.');
                        }
                      }} className="btn-secondary flex items-center text-sm py-1.5 border-icat-blue text-icat-blue bg-blue-50 hover:bg-blue-100">
                        <Wand2 className="w-4 h-4 mr-1.5" /> Simular 2º Turno
                      </button>
                    )}
                    <button onClick={() => {
                        const csvContent = "data:text/csv;charset=utf-8,Entrevistado,Telefone,Idade,Origem,Data,Opções Selecionadas\n" 
                          + "João da Silva,(64)9999-9999,34,WhatsApp,2026-04-12,Candidato A\n" 
                          + "Maria Costa,(64)8888-8888,50,Rua,2026-04-12,Candidato B";
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", `resultados_${pesquisaResultado.id}.csv`);
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                      }} className="btn-secondary flex items-center text-sm py-1.5"><Download className="w-4 h-4 mr-1.5" /> CSV</button>
                    <button onClick={() => window.print()} className="btn-secondary flex items-center text-sm py-1.5"><ClipboardList className="w-4 h-4 mr-1.5" /> Relatório PDF</button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-4 border-b pb-2">Desempenho (Opções)</h4>
                    {pesquisaResultado.opcoes.sort((a, b) => b.votos - a.votos).map((o, i) => {
                      const perc = totalVotos > 0 ? ((o.votos / totalVotos) * 100).toFixed(1) : '0.0';
                      return (
                        <div key={i} className="relative">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-800">{o.nome} {o.partido && <span className="text-gray-400 text-xs font-normal">({o.partido})</span>}</span>
                            <span className="font-bold text-gray-900">{perc}% <span className="text-gray-400 font-normal ml-1">({o.votos})</span></span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div className={`h-2.5 rounded-full ${CORES[i % CORES.length]}`} style={{ width: `${perc}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col justify-center items-center text-center">
                    <BarChart3 className="w-12 h-12 text-icat-green mb-3 opacity-20" />
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Líder Atual</h4>
                    {(() => {
                      const validVotes = pesquisaResultado.opcoes.filter(o => o.nome.toLowerCase() !== 'branco/nulo' && o.nome.toLowerCase() !== 'não sabe' && o.nome.toLowerCase() !== 'indeciso').reduce((sum, o) => sum + o.votos, 0);
                      const isTopOpcaoValid = topOpcao && topOpcao.nome.toLowerCase() !== 'branco/nulo' && topOpcao.nome.toLowerCase() !== 'não sabe' && topOpcao.nome.toLowerCase() !== 'indeciso';
                      
                      return topOpcao && topOpcao.votos > 0 && isTopOpcaoValid ? (
                        <>
                          <p className="text-2xl font-black text-gray-900 mb-1">{topOpcao.nome}</p>
                          <div className="flex flex-col gap-1 items-center">
                            <span className="text-icat-green font-bold bg-green-50 px-3 py-1 rounded-full text-sm inline-block">
                              {((topOpcao.votos / totalVotos) * 100).toFixed(1)}% (Total)
                            </span>
                            {validVotes > 0 && (
                              <span className="text-blue-700 font-bold bg-blue-50 px-3 py-1 rounded-full text-sm inline-block">
                                {((topOpcao.votos / validVotes) * 100).toFixed(1)}% dos Votos Válidos
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-400 text-sm">Nenhum voto computado para candidatos ainda.</p>
                      );
                    })()}
                  </div>
                </div>

                {pesquisaResultado.respostas.length > 0 && (
                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-4">Análise Demográfica (Idade x Intenção de Voto)</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Faixa Etária Geral */}
                      <div className="space-y-3">
                        <h5 className="font-semibold text-gray-700 text-sm mb-3">Distribuição por Faixa Etária</h5>
                        {(() => {
                          const faixas = [
                            { label: '16 a 24 anos', min: 16, max: 24 },
                            { label: '25 a 34 anos', min: 25, max: 34 },
                            { label: '35 a 44 anos', min: 35, max: 44 },
                            { label: '45 a 59 anos', min: 45, max: 59 },
                            { label: '60+ anos', min: 60, max: 200 }
                          ];
                          
                          const totalComIdade = pesquisaResultado.respostas.filter(r => r.idade !== undefined).length;
                          
                          return faixas.map(faixa => {
                            const count = pesquisaResultado.respostas.filter(r => r.idade !== undefined && r.idade >= faixa.min && r.idade <= faixa.max).length;
                            const perc = totalComIdade > 0 ? ((count / totalComIdade) * 100).toFixed(1) : '0.0';
                            
                            return (
                              <div key={faixa.label} className="relative">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="font-medium text-gray-600">{faixa.label}</span>
                                  <span className="font-bold text-gray-800">{perc}% <span className="text-gray-400 font-normal">({count})</span></span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                  <div className="h-2 rounded-full bg-icat-blue" style={{ width: `${perc}%` }}></div>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                      
                      {/* Líder por Faixa Etária */}
                      <div className="space-y-3">
                        <h5 className="font-semibold text-gray-700 text-sm mb-3">Líder por Faixa Etária</h5>
                        {(() => {
                          const faixas = [
                            { label: 'Jovens (16 a 24)', min: 16, max: 24 },
                            { label: 'Adultos (25 a 44)', min: 25, max: 44 },
                            { label: 'Sênior (45+)', min: 45, max: 200 }
                          ];
                          
                          return faixas.map(faixa => {
                            const votosNaFaixa = pesquisaResultado.respostas.filter(r => r.idade !== undefined && r.idade >= faixa.min && r.idade <= faixa.max);
                            if (votosNaFaixa.length === 0) return <div key={faixa.label} className="text-xs text-gray-400 mb-2">{faixa.label}: Sem dados</div>;
                            
                            // Agrupa votos por opção na faixa
                            const contagem = {} as Record<number, number>;
                            votosNaFaixa.forEach(r => {
                              r.opcaoIdxs.forEach(idx => contagem[idx] = (contagem[idx] || 0) + 1);
                            });
                            
                            // Acha vencedor
                            const vencedorIdx = Object.keys(contagem).reduce((a, b) => contagem[Number(a)] > contagem[Number(b)] ? a : b, Object.keys(contagem)[0]);
                            const vencedorNome = pesquisaResultado.opcoes[Number(vencedorIdx)]?.nome || 'N/A';
                            const perc = ((contagem[Number(vencedorIdx)] / votosNaFaixa.length) * 100).toFixed(1);
                            
                            return (
                              <div key={faixa.label} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100 mb-2">
                                <span className="text-xs font-semibold text-gray-600">{faixa.label}</span>
                                <div className="text-right">
                                  <span className="text-xs font-bold text-gray-900">{vencedorNome}</span>
                                  <span className="text-xs text-icat-green font-bold ml-2">{perc}%</span>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-4">Mural de Comentários / Opinião Espontânea</h4>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-600 italic">"Gostaria que o candidato focasse mais em saúde e infraestrutura." — 12/04/2026, Setor Central</div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-600 italic">"Meu bairro precisa de asfalto urgentemente." — 11/04/2026, Castelo Branco</div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-600 italic">"O transporte público está muito caro." — 10/04/2026, Santa Cruz</div>
                  </div>
                </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Pesquisa / Título Principal</label>
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
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-sm font-medium text-gray-700">Opções de Resposta</label>
                  <button 
                    type="button"
                    onClick={async () => {
                      if(!novaPesquisa.nome) return alert('Digite o Nome da Pesquisa primeiro para a IA buscar as opções!');
                      const btn = document.getElementById('btn-ai-pesquisa');
                      if(btn) btn.innerHTML = 'Buscando...';
                      const { mockAiGenerator } = await import('@/lib/ai-generator');
                      const aiOptions = await mockAiGenerator.generateSurveyOptions(novaPesquisa.nome);
                      setNovasOpcoes(aiOptions);
                      if(btn) btn.innerHTML = '<svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg> Sugerir Opções com IA';
                    }}
                    id="btn-ai-pesquisa"
                    className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-800 transition-colors bg-indigo-50 px-2 py-1 rounded-md"
                  >
                    <Wand2 className="w-3 h-3" /> Sugerir Opções com IA
                  </button>
                </div>
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
              <button onClick={handleSaveEntrevistador} className="btn-primary">Salvar Entrevistador</button>
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
