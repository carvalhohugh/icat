'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Send, RotateCcw, Heart, Shield, GraduationCap, Wrench, Bus, Droplets, Wifi, TreePine, Building2, Utensils, ClipboardList } from 'lucide-react';
import { getPesquisa, addResposta, type Pesquisa } from '@/lib/pesquisas-store';

const CORES_BG = [
  'from-blue-500 to-blue-600', 'from-red-500 to-red-600', 'from-green-500 to-green-600',
  'from-purple-500 to-purple-600', 'from-orange-500 to-orange-600', 'from-pink-500 to-pink-600',
  'from-cyan-500 to-cyan-600', 'from-amber-500 to-amber-600', 'from-indigo-500 to-indigo-600',
  'from-teal-500 to-teal-600', 'from-rose-500 to-rose-600', 'from-lime-500 to-lime-600'
];

const ICONES: Record<string, React.ReactNode> = {
  'Saúde': <Heart className="w-7 h-7" />, 'Segurança': <Shield className="w-7 h-7" />,
  'Educação': <GraduationCap className="w-7 h-7" />, 'Infraestrutura': <Wrench className="w-7 h-7" />,
  'Transporte': <Bus className="w-7 h-7" />, 'Saneamento': <Droplets className="w-7 h-7" />,
  'Tecnologia': <Wifi className="w-7 h-7" />, 'Meio Ambiente': <TreePine className="w-7 h-7" />,
  'Habitação': <Building2 className="w-7 h-7" />, 'Alimentação': <Utensils className="w-7 h-7" />,
};

// Retrieve logged-in interviewer from session
function getEntrevistadorLogado(): { id: number; nome: string } | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('entrevistador_session');
  if (raw) return JSON.parse(raw);
  return null;
}

export default function EntrevistadorColeta({ params }: { params: { id: string } }) {
  const [pesquisa, setPesquisa] = useState<Pesquisa | null>(null);
  const [entrevistador, setEntrevistador] = useState<{ id: number; nome: string } | null>(null);

  const [step, setStep] = useState(0); // 0=dados, 1=pergunta, 2=confirma, 3=sucesso
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [selecionados, setSelecionados] = useState<number[]>([]);
  const [outroNome, setOutroNome] = useState('');

  useEffect(() => {
    const p = getPesquisa(Number(params.id));
    if (p) setPesquisa(p);
    const ev = getEntrevistadorLogado();
    setEntrevistador(ev);
  }, [params.id]);

  const reset = () => {
    setStep(0); setNome(''); setTelefone(''); setSelecionados([]); setOutroNome('');
  };

  if (!pesquisa) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center p-8 text-white">
        <ClipboardList className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Pesquisa não encontrada</h2>
        <p className="text-gray-400 mt-2 text-sm">Verifique o link e tente novamente.</p>
      </div>
    </div>
  );

  const multiSelect = pesquisa.multiSelect ?? false;
  const outroIdx = pesquisa.opcoes.length;
  const podeAvancar = selecionados.length > 0 && (!selecionados.includes(outroIdx) || outroNome.trim().length > 0);

  const toggleSelecao = (i: number) => {
    if (multiSelect) {
      setSelecionados(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
    } else {
      setSelecionados([i]);
    }
  };

  const nomesSelecionados = selecionados
    .filter(i => i < pesquisa.opcoes.length)
    .map(i => pesquisa.opcoes[i].nome)
    .join(', ');

  const handleSubmit = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => { submitResposta(pos.coords.latitude, pos.coords.longitude); },
        () => submitResposta()
      );
    } else {
      submitResposta();
    }
  };

  const submitResposta = (lat?: number, lng?: number) => {
    addResposta(pesquisa.id, {
      entrevistado: nome || 'Sem nome',
      telefone,
      opcaoIdxs: selecionados.filter(i => i < pesquisa.opcoes.length),
      entrevistadorId: entrevistador?.id,
      fonte: 'entrevistador',
      lat,
      lng,
    });
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-4 px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-br from-icat-blue to-icat-green p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-white/80" />
              <span className="text-white/80 text-xs font-semibold uppercase tracking-widest">Entrevistador</span>
            </div>
            {entrevistador && <span className="text-white/70 text-xs">{entrevistador.nome}</span>}
          </div>
          <h2 className="text-white font-bold text-base leading-snug">{pesquisa.nome}</h2>
          {step < 3 && (
            <div className="flex gap-1.5 mt-4">
              {[0,1,2].map(i => (
                <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${step >= i ? 'bg-white' : 'bg-white/30'}`}></div>
              ))}
            </div>
          )}
        </div>

        <div className="p-5">
          {/* ═══ STEP 0: DADOS ═══ */}
          {step === 0 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="font-bold text-gray-900">Dados do Entrevistado</h3>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Nome</label>
                <input type="text" value={nome} onChange={e => setNome(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-icat-green focus:ring-4 focus:ring-icat-green/10 outline-none text-sm font-medium"
                  placeholder="Nome completo (opcional)" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Telefone / WhatsApp</label>
                <input type="tel" value={telefone} onChange={e => setTelefone(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-icat-green focus:ring-4 focus:ring-icat-green/10 outline-none text-sm font-medium"
                  placeholder="(64) 99000-0000" />
              </div>
              <button onClick={() => setStep(1)}
                className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mt-4">
                Iniciar Pesquisa <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* ═══ STEP 1: PERGUNTA ═══ */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-center py-1">
                <h3 className="text-base font-bold text-gray-900">
                  {pesquisa.tipo === 'Intenção de Voto' ? 'Em quem você votaria?' : 'O que precisa de melhoria?'}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{multiSelect ? 'Pode marcar mais de uma opção' : 'Selecione uma opção abaixo'}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {pesquisa.opcoes.map((op, i) => {
                  const selected = selecionados.includes(i);
                  const icone = ICONES[op.nome];
                  return (
                    <button key={i} onClick={() => toggleSelecao(i)}
                      className={`relative rounded-2xl p-4 text-left transition-all duration-200 border-2 flex flex-col items-start ${
                        selected ? 'border-green-400 shadow-lg ring-2 ring-green-200 bg-green-50/50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <div className="flex w-full justify-between items-start mb-2.5">
                        <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${CORES_BG[i % CORES_BG.length]} flex items-center justify-center shadow-sm text-white flex-shrink-0`}>
                          {icone || <span className="text-xl font-black">{op.nome.charAt(0)}</span>}
                        </div>
                        {op.partido && <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full uppercase">{op.partido}</span>}
                      </div>
                      <p className="font-bold text-gray-900 text-xs leading-tight">{op.nome}</p>
                      {selected && (
                        <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}

                {!pesquisa.induzida && (
                  <button onClick={() => toggleSelecao(outroIdx)}
                    className={`relative rounded-2xl p-4 text-left transition-all duration-200 border-2 border-dashed flex flex-col items-start ${
                      selecionados.includes(outroIdx) ? 'border-green-400 bg-green-50/50' : 'border-gray-300'
                    }`}>
                    <div className="h-11 w-11 rounded-xl bg-gray-200 flex items-center justify-center mb-2.5 text-gray-500">
                      <span className="text-xl font-black">?</span>
                    </div>
                    <p className="font-bold text-gray-600 text-xs">Outro</p>
                    {selecionados.includes(outroIdx) && (
                      <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                )}
              </div>

              {selecionados.includes(outroIdx) && !pesquisa.induzida && (
                <input type="text" value={outroNome} onChange={e => setOutroNome(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-icat-green outline-none font-bold text-gray-900 text-sm text-center"
                  placeholder="Digite a resposta..." autoFocus />
              )}

              <div className="flex gap-3 mt-2">
                <button onClick={() => setStep(0)} className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-gray-200 text-gray-600">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button onClick={() => { if (podeAvancar) setStep(2); }}
                  disabled={!podeAvancar}
                  className="flex-1 bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 disabled:opacity-40 flex items-center justify-center gap-2 text-sm">
                  Continuar <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ═══ STEP 2: CONFIRMAR ═══ */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-center py-1">
                <h3 className="font-bold text-gray-900">Confirmar Resposta</h3>
                <p className="text-xs text-gray-500 mt-1">Revise antes de registrar</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 space-y-3 border border-gray-100">
                {nome && (
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                    <span className="text-xs text-gray-500">Entrevistado</span>
                    <span className="text-sm font-bold text-gray-900">{nome}</span>
                  </div>
                )}
                {telefone && (
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                    <span className="text-xs text-gray-500">Telefone</span>
                    <span className="text-sm font-medium text-gray-700">{telefone}</span>
                  </div>
                )}
                <div className="py-1.5">
                  <span className="text-xs text-gray-500 block mb-2">{multiSelect ? 'Respostas' : 'Resposta'}</span>
                  <div className="flex flex-wrap gap-2">
                    {selecionados.filter(i => i < pesquisa.opcoes.length).map(i => (
                      <span key={i} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white font-bold text-xs bg-gradient-to-r ${CORES_BG[i % CORES_BG.length]}`}>
                        {pesquisa.opcoes[i].nome}
                      </span>
                    ))}
                    {selecionados.includes(outroIdx) && outroNome && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white font-bold text-xs bg-gray-600">{outroNome}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-gray-200 text-gray-600">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md text-sm">
                  <Send className="w-4 h-4" /> Registrar Resposta
                </button>
              </div>
            </div>
          )}

          {/* ═══ STEP 3: SUCESSO ═══ */}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center text-center py-8 animate-in fade-in">
              <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-green-500 to-green-400 flex items-center justify-center shadow-xl shadow-green-500/30 mb-6">
                <Check className="w-10 h-10 text-white" strokeWidth={3} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Registrado!</h3>
              <p className="text-gray-400 text-sm mb-8">Resposta salva e painel atualizado.</p>
              <button onClick={reset}
                className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4" /> Nova Entrevista
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
