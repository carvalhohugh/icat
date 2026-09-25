'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Send, RotateCcw, Heart, Shield, GraduationCap, Wrench, Bus, Droplets, Wifi, TreePine, Building2, Utensils, ClipboardList } from 'lucide-react';
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

function getEntrevistadorLogado(): { id: number; nome: string } | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('entrevistador_session');
  if (raw) return JSON.parse(raw);
  return null;
}

export default function EntrevistadorColeta({ params }: { params: { id: string } }) {
  const [pesquisa, setPesquisa] = useState<Pesquisa | null>(null);
  const [entrevistador, setEntrevistador] = useState<{ id: number; nome: string } | null>(null);

  const [step, setStep] = useState(0); // 0=dados, 1=pergunta(loop), 2=confirma, 3=sucesso
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [idade, setIdade] = useState<number | undefined>(undefined);
  const [isMorador, setIsMorador] = useState<string>('sim');
  const [genero, setGenero] = useState('');
  const [local, setLocal] = useState({ estado: '', cidade: '', bairro: '' });

  const [respostas, setRespostas] = useState<Record<string, { opcaoIds: string[], novasOpcoesNomes: string[] }>>({});
  const [perguntaAtualIdx, setPerguntaAtualIdx] = useState(0);

  const [estados, setEstados] = useState<any[]>([]);
  const [cidades, setCidades] = useState<any[]>([]);

  useEffect(() => {
    if (local.estado) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${local.estado}/municipios`)
        .then(res => res.json())
        .then(data => setCidades(data))
        .catch(console.error);
    } else {
      setCidades([]);
    }
  }, [local.estado]);

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(res => res.json())
      .then(data => setEstados(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const p = getPesquisa(Number(params.id));
    if (p) {
      // Initialize respostas map if empty
      const initResp: Record<string, { opcaoIds: string[], novasOpcoesNomes: string[] }> = {};
      p.perguntas?.forEach(perg => {
        initResp[perg.id] = { opcaoIds: [], novasOpcoesNomes: [] };
      });
      setRespostas(initResp);
      setPesquisa(p);
    }
    const ev = getEntrevistadorLogado();
    setEntrevistador(ev);
  }, [params.id]);

  const reset = () => {
    setIsMorador('sim');
    setStep(0); setNome(''); setCpf(''); setTelefone(''); setNascimento(''); setIdade(undefined); setGenero('');
    const initResp: Record<string, { opcaoIds: string[], novasOpcoesNomes: string[] }> = {};
    if (pesquisa?.perguntas) {
      pesquisa.perguntas.forEach(perg => {
        initResp[perg.id] = { opcaoIds: [], novasOpcoesNomes: [] };
      });
    }
    setRespostas(initResp);
    setPerguntaAtualIdx(0);
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
    const respostasFormatadas: RespostaItem[] = Object.keys(respostas).map(perguntaId => {
      const resp = respostas[perguntaId];
      return {
        perguntaId,
        opcaoIds: resp.opcaoIds.filter(id => id !== 'outro'),
        novasOpcoesNomes: resp.novasOpcoesNomes
      };
    });

    addResposta(pesquisa.id, {
      entrevistado: nome || 'Sem nome',
      cpf,
      telefone,
      idade, genero, estado: local.estado, cidade: local.cidade, bairro: local.bairro,
      respostas: respostasFormatadas,
      entrevistadorId: entrevistador?.id, fonte: 'entrevistador', lat, lng 
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
              <div className={`flex-1 h-1.5 rounded-full transition-all ${step >= 0 ? 'bg-white' : 'bg-white/30'}`}></div>
              <div className={`flex-1 h-1.5 rounded-full transition-all ${step >= 1 ? 'bg-white' : 'bg-white/30'}`}></div>
              <div className={`flex-1 h-1.5 rounded-full transition-all ${step >= 2 ? 'bg-white' : 'bg-white/30'}`}></div>
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
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">CPF</label>
                <input type="text" value={cpf} onChange={e => setCpf(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-icat-green focus:ring-4 focus:ring-icat-green/10 outline-none text-sm font-medium"
                  placeholder="000.000.000-00 (opcional)" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {pesquisa.exigeMorador && (<div className="mb-4"><label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">É morador do município?</label><div className="flex gap-4"><label className="flex items-center gap-2"><input type="radio" name="morador" checked={isMorador === 'sim'} onChange={() => setIsMorador('sim')} /><span>Sim</span></label><label className="flex items-center gap-2"><input type="radio" name="morador" checked={isMorador === 'nao'} onChange={() => setIsMorador('nao')} /><span>Não</span></label></div></div>)}
                <div><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Nascimento</label>
                  <input type="date" value={nascimento} onChange={e => {
                    setNascimento(e.target.value);
                    if (e.target.value) {
                      const age = Math.abs(new Date(Date.now() - new Date(e.target.value).getTime()).getUTCFullYear() - 1970);
                      setIdade(age);
                    } else setIdade(undefined);
                  }}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:border-icat-green outline-none text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">WhatsApp</label>
                  <input type="tel" value={telefone} onChange={e => setTelefone(e.target.value)}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:border-icat-green outline-none text-sm font-medium"
                    placeholder="(64) 99000-0000" />
                </div>
              </div>
              <button onClick={() => { if (pesquisa.exigeMorador && isMorador === 'nao') { alert('Pesquisa encerrada: O entrevistado não é morador do município.'); reset(); return; } if (pesquisa.idadeMinima && idade !== undefined && idade < pesquisa.idadeMinima) { alert('Pesquisa encerrada: O entrevistado é menor que a idade mínima permitida.'); reset(); return; } setStep(1); }}
                className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mt-4">
                Iniciar Pesquisa <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* ═══ STEP 1: PERGUNTA ═══ */}
          {step === 1 && perguntaAtual && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-center py-1">
                <span className="text-xs font-bold text-gray-400">Pergunta {perguntaAtualIdx + 1} de {pesquisa.perguntas?.length}</span>
                <h3 className="text-base font-bold text-gray-900 mt-1">
                  {perguntaAtual.titulo}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{perguntaAtual.multiSelect ? 'Pode marcar mais de uma opção' : 'Selecione uma opção abaixo'}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {perguntaAtual.opcoes.map((op, i) => {
                  const selected = respAtual.opcaoIds.includes(op.id);
                  const icone = ICONES[op.nome];
                  return (
                    <button key={op.id} onClick={() => toggleSelecao(op.id)}
                      className={`relative rounded-2xl p-4 text-left transition-all duration-200 border-2 flex flex-col items-start ${
                        selected ? 'border-green-400 shadow-lg ring-2 ring-green-200 bg-green-50/50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <div className="flex w-full justify-between items-start mb-2.5">
                        <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${CORES_BG[i % CORES_BG.length]} flex items-center justify-center shadow-sm text-white flex-shrink-0`}>
                          {op.foto ? <img src={op.foto} alt={op.nome} className="w-full h-full object-cover" /> : icone || <span className="text-xl font-black">{op.nome.charAt(0)}</span>}
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

                {perguntaAtual.tipo === 'Espontânea' && (
                  <button onClick={() => toggleSelecao('outro')}
                    className={`relative rounded-2xl p-4 text-left transition-all duration-200 border-2 border-dashed flex flex-col items-start ${
                      hasOutro ? 'border-green-400 bg-green-50/50' : 'border-gray-300'
                    }`}>
                    <div className="h-11 w-11 rounded-xl bg-gray-200 flex items-center justify-center mb-2.5 text-gray-500">
                      <span className="text-xl font-black">?</span>
                    </div>
                    <p className="font-bold text-gray-600 text-xs">Outro</p>
                    {hasOutro && (
                      <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                )}
              </div>

              {hasOutro && perguntaAtual.tipo === 'Espontânea' && (
                <input type="text" value={respAtual.novasOpcoesNomes[0] || ''} onChange={e => handleOutroChange(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-icat-green outline-none font-bold text-gray-900 text-sm text-center"
                  placeholder="Digite a resposta..." autoFocus />
              )}

              <div className="flex gap-3 mt-2">
                <button onClick={prevPergunta} className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-gray-200 text-gray-600">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button onClick={() => { if (podeAvancarPergunta) nextPergunta(); }}
                  disabled={!podeAvancarPergunta}
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
              <div className="bg-gray-50 rounded-2xl p-4 space-y-3 border border-gray-100 max-h-[50vh] overflow-y-auto">
                {nome && (
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                    <span className="text-xs text-gray-500">Entrevistado</span>
                    <span className="text-sm font-bold text-gray-900">{nome}</span>
                  </div>
                )}
                {cpf && (
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                    <span className="text-xs text-gray-500">CPF</span>
                    <span className="text-sm font-bold text-gray-900">{cpf}</span>
                  </div>
                )}
                {idade !== undefined && (
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                    <span className="text-xs text-gray-500">Idade</span>
                    <span className="text-sm font-bold text-gray-900">{idade} anos</span>
                  </div>
                )}
                {telefone && (
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                    <span className="text-xs text-gray-500">Telefone</span>
                    <span className="text-sm font-medium text-gray-700">{telefone}</span>
                  </div>
                )}
                
                {pesquisa.perguntas?.map((perg, idx) => {
                  const resp = respostas[perg.id];
                  if (!resp) return null;
                  return (
                    <div key={perg.id} className="py-1.5 border-t border-gray-100 mt-2">
                      <span className="text-xs text-gray-500 block mb-2">{perg.titulo}</span>
                      <div className="flex flex-wrap gap-2">
                        {resp.opcaoIds.filter(id => id !== 'outro').map((opId, i) => {
                          const opInfo = perg.opcoes.find(o => o.id === opId);
                          return opInfo ? (
                            <span key={opId} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white font-bold text-xs bg-gradient-to-r ${CORES_BG[i % CORES_BG.length]}`}>
                              {opInfo.nome}
                            </span>
                          ) : null;
                        })}
                        {resp.opcaoIds.includes('outro') && resp.novasOpcoesNomes[0] && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white font-bold text-xs bg-gray-600">{resp.novasOpcoesNomes[0]}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setStep(1); setPerguntaAtualIdx((pesquisa.perguntas?.length || 1) - 1); }} className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-gray-200 text-gray-600">
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
