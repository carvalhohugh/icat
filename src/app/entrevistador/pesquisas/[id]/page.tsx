'use client';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Send, RotateCcw, User, Phone, Heart, Shield, GraduationCap, Wrench, Bus, Droplets, Wifi, TreePine, Building2, Utensils } from 'lucide-react';
import Link from 'next/link';

const CORES_BG = [
  'from-blue-500 to-blue-600', 'from-red-500 to-red-600', 'from-green-500 to-green-600',
  'from-purple-500 to-purple-600', 'from-orange-500 to-orange-600', 'from-pink-500 to-pink-600',
  'from-cyan-500 to-cyan-600', 'from-amber-500 to-amber-600', 'from-indigo-500 to-indigo-600',
  'from-teal-500 to-teal-600', 'from-rose-500 to-rose-600', 'from-lime-500 to-lime-600'
];

const ICONES_OPINIAO: Record<string, React.ReactNode> = {
  'Saúde': <Heart className="w-7 h-7" />,
  'Segurança': <Shield className="w-7 h-7" />,
  'Educação': <GraduationCap className="w-7 h-7" />,
  'Infraestrutura': <Wrench className="w-7 h-7" />,
  'Transporte': <Bus className="w-7 h-7" />,
  'Saneamento': <Droplets className="w-7 h-7" />,
  'Tecnologia': <Wifi className="w-7 h-7" />,
  'Meio Ambiente': <TreePine className="w-7 h-7" />,
  'Habitação': <Building2 className="w-7 h-7" />,
  'Alimentação': <Utensils className="w-7 h-7" />,
};

// Mock data — em produção viria do backend via params.id
const PESQUISA_MOCK: Record<string, { nome: string; tipo: string; induzida: boolean; opcoes: {nome: string, partido?: string}[] }> = {
  '1': {
    nome: 'Intenção de Voto — Prefeito Catalão 2026',
    tipo: 'Intenção de Voto', induzida: true,
    opcoes: [
      {nome: 'Renato Ribeiro', partido: 'PL'},
      {nome: 'Velomar Rios', partido: 'MDB'},
      {nome: 'Adilson Cardoso', partido: 'PT'}
    ]
  },
  '2': {
    nome: 'Melhorias Necessárias — Catalão',
    tipo: 'Opinião', induzida: false,
    opcoes: [
      {nome: 'Saúde'}, {nome: 'Segurança'}, {nome: 'Educação'}, {nome: 'Infraestrutura'}, {nome: 'Transporte'}
    ]
  }
};

export default function EntrevistadorColeta({ params }: { params: { id: string } }) {
  const pesquisa = PESQUISA_MOCK[params.id] || PESQUISA_MOCK['1'];

  const [step, setStep] = useState(0); // 0=dados, 1=pergunta, 2=confirma, 3=sucesso
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [selecionado, setSelecionado] = useState<number | null>(null);
  const [outroNome, setOutroNome] = useState('');

  const respostaNome = selecionado !== null
    ? (selecionado === pesquisa.opcoes.length ? outroNome : pesquisa.opcoes[selecionado].nome)
    : '';

  const reset = () => {
    setStep(0); setNome(''); setTelefone(''); setSelecionado(null); setOutroNome('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/entrevistador/pesquisas" className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{pesquisa.nome}</p>
          <p className="text-xs text-gray-500">{pesquisa.tipo}</p>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white px-4 py-2 border-b border-gray-100">
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${step >= i ? 'bg-gradient-to-r from-icat-blue to-icat-green' : 'bg-gray-200'}`}></div>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 max-w-lg mx-auto w-full">

        {/* ═══ STEP 0: DADOS DO ENTREVISTADO ═══ */}
        {step === 0 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="text-center py-4">
              <div className="h-14 w-14 mx-auto rounded-2xl bg-gradient-to-br from-icat-blue to-icat-green flex items-center justify-center mb-3 shadow-sm">
                <User className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Dados do Entrevistado</h2>
              <p className="text-sm text-gray-500 mt-1">Preencha as informações da pessoa abordada</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input type="text" value={nome} onChange={e => setNome(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-icat-green outline-none"
                  placeholder="Nome da pessoa entrevistada" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" value={telefone} onChange={e => setTelefone(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-icat-green outline-none"
                    placeholder="(64) 99000-0000" />
                </div>
              </div>
            </div>

            <button onClick={() => { if (nome.trim()) setStep(1); }}
              disabled={!nome.trim()}
              className="w-full bg-gradient-to-r from-icat-blue to-icat-green text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2 shadow-sm">
              Avançar <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* ═══ STEP 1: PERGUNTA COM CARDS ═══ */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center py-2">
              <h2 className="text-lg font-bold text-gray-900">
                {pesquisa.tipo === 'Intenção de Voto' ? 'Em quem você votaria?' : 'O que precisa de melhoria?'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Selecione uma opção abaixo</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {pesquisa.opcoes.map((op, i) => {
                const selected = selecionado === i;
                const icone = ICONES_OPINIAO[op.nome];
                return (
                  <button key={i} onClick={() => setSelecionado(i)}
                    className={`relative rounded-2xl p-4 text-left transition-all duration-200 border-2 flex flex-col items-start ${
                      selected
                        ? 'border-green-400 shadow-lg scale-[1.02] ring-2 ring-green-200'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}>
                    <div className="flex w-full justify-between items-start mb-3">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${CORES_BG[i % CORES_BG.length]} flex items-center justify-center shadow-sm text-white flex-shrink-0`}>
                        {icone || <span className="text-xl font-black">{op.nome.charAt(0)}</span>}
                      </div>
                      {op.partido && <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full uppercase tracking-wider">{op.partido}</span>}
                    </div>
                    <p className="font-bold text-gray-900 text-sm leading-tight">{op.nome}</p>
                    {selected && (
                      <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}

              {/* Opção "Outro" (apenas pesquisa espontânea) */}
              {!pesquisa.induzida && (
                <button onClick={() => setSelecionado(pesquisa.opcoes.length)}
                  className={`relative rounded-2xl p-4 text-left transition-all duration-200 border-2 border-dashed ${
                    selecionado === pesquisa.opcoes.length
                      ? 'border-green-400 shadow-lg scale-[1.02] ring-2 ring-green-200 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                  <div className="h-12 w-12 rounded-xl bg-gray-200 flex items-center justify-center mb-3 text-gray-500">
                    <span className="text-xl font-black">?</span>
                  </div>
                  <p className="font-bold text-gray-600 text-sm">Outro</p>
                  {selecionado === pesquisa.opcoes.length && (
                    <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              )}
            </div>

            {/* Campo "Outro" */}
            {selecionado === pesquisa.opcoes.length && !pesquisa.induzida && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Qual?</label>
                <input type="text" value={outroNome} onChange={e => setOutroNome(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-icat-green outline-none"
                  placeholder="Digite a resposta..." autoFocus />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-semibold text-sm hover:bg-gray-50">
                <ArrowLeft className="w-4 h-4 inline mr-1" /> Voltar
              </button>
              <button onClick={() => { if (selecionado !== null) setStep(2); }}
                disabled={selecionado === null || (selecionado === pesquisa.opcoes.length && !outroNome.trim())}
                className="flex-1 bg-gradient-to-r from-icat-blue to-icat-green text-white font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-40 text-sm flex items-center justify-center gap-1">
                Confirmar <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ═══ STEP 2: CONFIRMAÇÃO ═══ */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="text-center py-4">
              <h2 className="text-lg font-bold text-gray-900">Confirmar Resposta</h2>
              <p className="text-sm text-gray-500 mt-1">Revise os dados antes de enviar</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Entrevistado</span>
                <span className="text-sm font-bold text-gray-900">{nome}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Telefone</span>
                <span className="text-sm font-medium text-gray-700">{telefone || '—'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-500">Resposta</span>
                <span className={`text-sm font-bold px-3 py-1 rounded-full bg-gradient-to-r ${selecionado !== null ? CORES_BG[selecionado % CORES_BG.length] : ''} text-white`}>
                  {respostaNome}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-semibold text-sm hover:bg-gray-50">
                <ArrowLeft className="w-4 h-4 inline mr-1" /> Editar
              </button>
              <button onClick={() => {
                if ('geolocation' in navigator) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      console.log('Localização:', position.coords.latitude, position.coords.longitude);
                      setStep(3);
                    },
                    (error) => {
                      console.error('Erro ao pegar localização', error);
                      setStep(3); // Go to success even if location fails for now
                    }
                  );
                } else {
                  setStep(3);
                }
              }}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-xl hover:opacity-90 text-sm flex items-center justify-center gap-1 shadow-sm">
                <Send className="w-4 h-4" /> Enviar
              </button>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: SUCESSO ═══ */}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center text-center py-12 animate-in fade-in">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
              <div className="h-14 w-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg animate-bounce">
                <Check className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Resposta Enviada!</h2>
            <p className="text-sm text-gray-500 mb-8">A resposta de <strong>{nome}</strong> foi registrada com sucesso.</p>
            <button onClick={reset}
              className="w-full max-w-xs bg-gradient-to-r from-icat-blue to-icat-green text-white font-bold py-3.5 rounded-xl hover:opacity-90 flex items-center justify-center gap-2 shadow-sm">
              <RotateCcw className="w-5 h-5" /> Nova Entrevista
            </button>
            <Link href="/entrevistador/pesquisas" className="mt-3 text-sm text-gray-500 hover:text-gray-700 underline">
              Voltar para pesquisas
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
