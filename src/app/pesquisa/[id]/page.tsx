'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Send, Phone, Heart, Shield, GraduationCap, Wrench, Bus, Droplets, Wifi, TreePine, Building2, Utensils, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { getPesquisa, addResposta, type Pesquisa, type RespostaItem } from '@/lib/pesquisas-store';

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

export default function PublicPesquisa({ params }: { params: { id: string } }) {
  const [pesquisa, setPesquisa] = useState<Pesquisa | null>(null);
  const [step, setStep] = useState(0);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');

  const [respostas, setRespostas] = useState<Record<string, { opcaoIds: string[], novasOpcoesNomes: string[] }>>({});
  const [perguntaAtualIdx, setPerguntaAtualIdx] = useState(0);

  useEffect(() => {
    const p = getPesquisa(Number(params.id));
    if (p) {
      const initResp: Record<string, { opcaoIds: string[], novasOpcoesNomes: string[] }> = {};
      p.perguntas?.forEach(perg => {
        initResp[perg.id] = { opcaoIds: [], novasOpcoesNomes: [] };
      });
      setRespostas(initResp);
      setPesquisa(p);
    }
  }, [params.id]);

  if (!pesquisa) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8">
        <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700">Pesquisa não encontrada</h2>
        <p className="text-gray-500 mt-2">Este link pode ter expirado ou estar incorreto.</p>
        <Link href="/" className="mt-6 inline-block px-6 py-3 bg-icat-green text-white font-bold rounded-xl">Voltar ao site</Link>
      </div>
    </div>
  );

  const perguntaAtual = pesquisa.perguntas?.[perguntaAtualIdx];
  const respAtual = perguntaAtual ? respostas[perguntaAtual.id] : { opcaoIds: [], novasOpcoesNomes: [] };
  const hasOutro = respAtual.opcaoIds.includes('outro');

  const podeAvancarPergunta = respAtual.opcaoIds.length > 0 && (!hasOutro || (respAtual.novasOpcoesNomes.length > 0 && respAtual.novasOpcoesNomes[0].trim().length > 0));

  const toggleSelecao = (idOpcao: string) => {
    if (!perguntaAtual) return;
    setRespostas(prev => {
      const cur = prev[perguntaAtual.id];
      const isSelected = cur.opcaoIds.includes(idOpcao);
      
      let newOpcaoIds = [...cur.opcaoIds];
      if (perguntaAtual.multiSelect) {
        if (isSelected) {
          newOpcaoIds = newOpcaoIds.filter(x => x !== idOpcao);
        } else {
          newOpcaoIds.push(idOpcao);
        }
      } else {
        newOpcaoIds = [idOpcao];
      }
      return {
        ...prev,
        [perguntaAtual.id]: {
          ...cur,
          opcaoIds: newOpcaoIds
        }
      };
    });
  };

  const handleOutroChange = (val: string) => {
    if (!perguntaAtual) return;
    setRespostas(prev => ({
      ...prev,
      [perguntaAtual.id]: {
        ...prev[perguntaAtual.id],
        novasOpcoesNomes: val ? [val] : []
      }
    }));
  };

  const nextPergunta = () => {
    if (!pesquisa.perguntas) return;
    if (perguntaAtualIdx < pesquisa.perguntas.length - 1) {
      setPerguntaAtualIdx(perguntaAtualIdx + 1);
    } else {
      setStep(2); // Confirmar
    }
  };

  const prevPergunta = () => {
    if (perguntaAtualIdx > 0) {
      setPerguntaAtualIdx(perguntaAtualIdx - 1);
    } else {
      setStep(0);
    }
  };

  const handleSubmit = () => {
    const respostasFormatadas: RespostaItem[] = Object.keys(respostas).map(perguntaId => {
      const resp = respostas[perguntaId];
      return {
        perguntaId,
        opcaoIds: resp.opcaoIds.filter(id => id !== 'outro'),
        novasOpcoesNomes: resp.novasOpcoesNomes
      };
    });

    addResposta(pesquisa.id, {
      entrevistado: nome || 'Anônimo',
      cpf,
      telefone,
      respostas: respostasFormatadas,
      fonte: 'publico',
    });
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-lg bg-white min-h-screen shadow-xl border-x border-gray-100 flex flex-col">
        <header className="bg-gradient-to-r from-icat-blue to-icat-green px-6 py-8 text-center rounded-b-[2.5rem] shadow-sm">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 shadow-inner">
            <ClipboardList className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white mb-1">{pesquisa.nome}</h1>
          <p className="text-white/80 text-sm font-medium">Sua opinião é muito importante para nós.</p>
        </header>

        <div className="flex-1 p-6 flex flex-col">
          {step < 3 && (
            <div className="flex gap-2 mb-8 mt-2">
              <div className={`flex-1 h-2 rounded-full transition-all duration-300 ${step >= 0 ? 'bg-icat-green' : 'bg-gray-100'}`}></div>
              <div className={`flex-1 h-2 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-icat-green' : 'bg-gray-100'}`}></div>
              <div className={`flex-1 h-2 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-icat-green' : 'bg-gray-100'}`}></div>
            </div>
          )}

          {/* ═══ STEP 0: DADOS ═══ */}
          {step === 0 && (
            <div className="space-y-6 animate-in fade-in flex-1 flex flex-col">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Seus Dados</h2>
                <p className="text-gray-500 mt-2 text-sm">O CPF garante que cada pessoa vote apenas uma vez.</p>
              </div>
              <div className="space-y-5 flex-1">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Nome Completo</label>
                  <input type="text" value={nome} onChange={e => setNome(e.target.value)}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-icat-green focus:ring-4 focus:ring-icat-green/10 outline-none transition-all font-medium text-gray-900"
                    placeholder="Seu nome completo" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">CPF <span className="text-red-500">*</span></label>
                  <input type="text" value={cpf} onChange={e => setCpf(e.target.value)}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-icat-green focus:ring-4 focus:ring-icat-green/10 outline-none transition-all font-medium text-gray-900"
                    placeholder="000.000.000-00" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">WhatsApp</label>
                  <div className="relative">
                    <Phone className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="tel" value={telefone} onChange={e => setTelefone(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-icat-green focus:ring-4 focus:ring-icat-green/10 outline-none transition-all font-medium text-gray-900"
                      placeholder="(00) 00000-0000" />
                  </div>
                </div>
              </div>
              <button onClick={() => setStep(1)}
                disabled={!cpf.trim()}
                className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40 flex items-center justify-center gap-2 shadow-xl shadow-gray-900/20 mt-8">
                Começar Pesquisa <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* ═══ STEP 1: PERGUNTA ═══ */}
          {step === 1 && perguntaAtual && (
            <div className="space-y-6 animate-in fade-in flex-1 flex flex-col">
              <div className="text-center">
                <span className="text-xs font-bold text-gray-400">Pergunta {perguntaAtualIdx + 1} de {pesquisa.perguntas?.length}</span>
                <h2 className="text-2xl font-bold text-gray-900 mt-2">
                  {perguntaAtual.titulo}
                </h2>
                <p className="text-gray-500 mt-2 text-sm">
                  {perguntaAtual.multiSelect ? 'Selecione uma ou mais opções.' : 'Selecione apenas uma opção.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 flex-1">
                {perguntaAtual.opcoes.map((op, i) => {
                  const selected = respAtual.opcaoIds.includes(op.id);
                  const icone = ICONES[op.nome];
                  return (
                    <button key={op.id} onClick={() => toggleSelecao(op.id)}
                      className={`relative rounded-2xl p-5 text-left transition-all duration-300 border-2 flex flex-col items-start ${
                        selected ? 'border-icat-green bg-green-50/50 shadow-xl shadow-green-500/10 scale-[1.02]' : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                      }`}>
                      <div className="flex w-full justify-between items-start mb-4">
                        <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${CORES_BG[i % CORES_BG.length]} flex items-center justify-center shadow-sm text-white flex-shrink-0`}>
                          {op.foto ? <img src={op.foto} alt={op.nome} className="w-full h-full object-cover" /> : icone || <span className="text-2xl font-black">{op.nome.charAt(0)}</span>}
                        </div>
                        {op.partido && <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full uppercase tracking-wider">{op.partido}</span>}
                      </div>
                      <p className="font-bold text-gray-900 text-[15px] leading-tight">{op.nome}</p>
                      {selected && (
                        <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-icat-green flex items-center justify-center shadow-sm">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}

                {perguntaAtual.tipo === 'Espontânea' && (
                  <button onClick={() => toggleSelecao('outro')}
                    className={`relative rounded-2xl p-5 text-left transition-all duration-300 border-2 border-dashed flex flex-col items-start ${
                      hasOutro ? 'border-icat-green bg-green-50/50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}>
                    <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 text-gray-500">
                      <span className="text-2xl font-black">?</span>
                    </div>
                    <p className="font-bold text-gray-600 text-[15px]">Outro</p>
                    {hasOutro && (
                      <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-icat-green flex items-center justify-center shadow-sm">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                )}
              </div>

              {hasOutro && perguntaAtual.tipo === 'Espontânea' && (
                <div className="animate-in slide-in-from-bottom-2">
                  <input type="text" value={respAtual.novasOpcoesNomes[0] || ''} onChange={e => handleOutroChange(e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-icat-green outline-none font-bold text-gray-900 text-center"
                    placeholder="Digite sua resposta..." autoFocus />
                </div>
              )}

              <div className="flex gap-3 mt-8">
                <button onClick={prevPergunta} className="w-14 h-14 flex items-center justify-center rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button onClick={() => { if (podeAvancarPergunta) nextPergunta(); }}
                  disabled={!podeAvancarPergunta}
                  className="flex-1 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 disabled:opacity-40 flex items-center justify-center gap-2 shadow-xl shadow-gray-900/20 py-3">
                  Continuar <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* ═══ STEP 2: CONFIRMAÇÃO ═══ */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in flex-1 flex flex-col">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Confirme suas respostas</h2>
                <p className="text-gray-500 mt-2 text-sm">Revise antes de confirmar.</p>
              </div>
              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 flex-1 space-y-4 max-h-[50vh] overflow-y-auto">
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">CPF</span>
                  <span className="block text-base font-bold text-gray-900">{cpf}</span>
                  {nome && <span className="block text-sm text-gray-500 mt-0.5">{nome}</span>}
                </div>
                
                {pesquisa.perguntas?.map((perg, idx) => {
                  const resp = respostas[perg.id];
                  if (!resp) return null;
                  return (
                    <div key={perg.id} className="bg-white p-5 rounded-2xl shadow-sm border-2 border-green-100">
                      <span className="block text-xs font-bold text-green-500 uppercase tracking-wider mb-3">
                        {perg.titulo}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {resp.opcaoIds.filter(id => id !== 'outro').map((opId, i) => {
                          const opInfo = perg.opcoes.find(o => o.id === opId);
                          return opInfo ? (
                            <span key={opId} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r ${CORES_BG[i % CORES_BG.length]} text-white font-bold text-sm`}>
                              {opInfo.nome}
                              {opInfo.partido && <span className="opacity-75 text-xs">({opInfo.partido})</span>}
                            </span>
                          ) : null;
                        })}
                        {resp.opcaoIds.includes('outro') && resp.novasOpcoesNomes[0] && (
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-600 text-white font-bold text-sm">{resp.novasOpcoesNomes[0]}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setStep(1); setPerguntaAtualIdx((pesquisa.perguntas?.length || 1) - 1); }} className="w-14 h-14 flex items-center justify-center rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-icat-blue to-icat-green text-white font-bold rounded-xl hover:opacity-90 flex items-center justify-center gap-2 shadow-xl shadow-green-500/20 text-lg py-4">
                  <Send className="w-5 h-5" /> Confirmar Voto
                </button>
              </div>
            </div>
          )}

          {/* ═══ STEP 3: SUCESSO ═══ */}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center text-center py-12 animate-in fade-in flex-1">
              <div className="h-28 w-28 rounded-full bg-green-50 flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping opacity-20"></div>
                <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-green-500 to-green-400 flex items-center justify-center shadow-2xl shadow-green-500/40">
                  <Check className="w-10 h-10 text-white" strokeWidth={3} />
                </div>
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Obrigado!</h2>
              <p className="text-gray-500 mb-8 max-w-[250px] leading-relaxed">
                Sua resposta foi registrada e já aparece nos resultados em tempo real.
              </p>
              <Link href="/" className="px-8 py-3.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                Voltar para o site
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
