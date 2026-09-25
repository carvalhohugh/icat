import { supabase } from '@/lib/supabase';

export type Opcao = { id: string; nome: string; partido?: string; votos: number; foto?: string; };
export type Pergunta = { id: string; titulo: string; tipo: 'Espontânea' | 'Induzida'; multiSelect: boolean; opcoes: Opcao[]; };

export type RespostaItem = { perguntaId: string; opcaoIds: string[]; novasOpcoesNomes?: string[] };

export type Resposta = {
  id: string;
  entrevistado: string;
  cpf?: string;
  telefone?: string;
  idade?: number;
  genero?: string;
  estado?: string;
  cidade?: string;
  bairro?: string;
  respostas: RespostaItem[];
  entrevistadorId?: number;
  fonte: 'entrevistador' | 'publico';
  data: string;
  lat?: number;
  lng?: number;
};

export type Pesquisa = {
  id: number;
  nome: string;
  tipo: string;
  status: string;
  exigeMorador?: boolean;
  idadeMinima?: number;
  perguntas: Pergunta[];
  entrevistadores: number[];
  respostas: Resposta[];
  metaDiaria?: number;
  metaEntrevistas?: number;
  // legacy
  induzida?: boolean;
  multiSelect?: boolean;
  opcoes?: Opcao[];
};

const STORAGE_KEY = 'icat_pesquisas_v2';

const INICIAL: Pesquisa[] = [
  {
    id: 1,
    nome: 'Intenção de Voto - Prefeito Catalão 2026',
    tipo: 'Intenção de Voto',
    status: 'Ativa',
    perguntas: [
      {
        id: 'p1',
        titulo: 'Se as eleições fossem hoje, em quem você votaria para prefeito?',
        tipo: 'Induzida',
        multiSelect: false,
        opcoes: [
          { id: 'o1', nome: 'Renato Ribeiro', partido: 'PL', votos: 142 },
          { id: 'o2', nome: 'Velomar Rios', partido: 'MDB', votos: 98 },
          { id: 'o3', nome: 'Adilson Cardoso', partido: 'PT', votos: 67 },
          { id: 'o4', nome: 'Branco/Nulo', partido: '', votos: 25 },
          { id: 'o5', nome: 'Não Sabe', partido: '', votos: 40 },
        ],
      }
    ],
    entrevistadores: [1, 2],
    respostas: [
      { id: 'r1', entrevistado: 'José da Silva', telefone: '(64) 99900-0001', idade: 45, respostas: [{ perguntaId: 'p1', opcaoIds: ['o1'] }], entrevistadorId: 1, fonte: 'entrevistador', data: '09/09/2026 14:22' },
      { id: 'r2', entrevistado: 'Maria Santos', telefone: '(64) 99900-0002', idade: 22, respostas: [{ perguntaId: 'p1', opcaoIds: ['o2'] }], entrevistadorId: 2, fonte: 'entrevistador', data: '09/09/2026 14:35' },
      { id: 'r3', entrevistado: 'Carlos Pereira', telefone: '(64) 99900-0003', idade: 60, respostas: [{ perguntaId: 'p1', opcaoIds: ['o1'] }], entrevistadorId: 1, fonte: 'entrevistador', data: '09/09/2026 15:01' },
      { id: 'r4', entrevistado: 'Ana Julia', telefone: '(64) 99900-0004', idade: 19, respostas: [{ perguntaId: 'p1', opcaoIds: ['o3'] }], entrevistadorId: 1, fonte: 'entrevistador', data: '09/09/2026 15:10' },
      { id: 'r5', entrevistado: 'Marcos Paulo', telefone: '(64) 99900-0005', idade: 35, respostas: [{ perguntaId: 'p1', opcaoIds: ['o4'] }], entrevistadorId: 2, fonte: 'entrevistador', data: '09/09/2026 15:20' },
    ],
  },
  {
    id: 2,
    nome: 'Melhorias Necessárias - Catalão',
    tipo: 'Opinião',
    status: 'Ativa',
    perguntas: [
      {
        id: 'p2',
        titulo: 'Quais as principais melhorias que a cidade precisa?',
        tipo: 'Espontânea',
        multiSelect: true,
        opcoes: [
          { id: 'o6', nome: 'Saúde', votos: 87 },
          { id: 'o7', nome: 'Segurança', votos: 65 },
          { id: 'o8', nome: 'Educação', votos: 54 },
          { id: 'o9', nome: 'Infraestrutura', votos: 43 },
          { id: 'o10', nome: 'Transporte', votos: 31 },
        ],
      }
    ],
    entrevistadores: [1, 3],
    respostas: [],
  },
];

function loadStore(): Pesquisa[] {
  if (typeof window === 'undefined') return INICIAL;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) { /* ignore */ }
  return INICIAL;
}

function saveStore(pesquisas: Pesquisa[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pesquisas));
  window.dispatchEvent(new Event('icat_pesquisas_update'));
}

export function getPesquisas(): Pesquisa[] {
  return loadStore();
}

export function getPesquisa(id: number): Pesquisa | undefined {
  return loadStore().find(p => p.id === id);
}

export function addResposta(pesquisaId: number, resposta: Omit<Resposta, 'id' | 'data'>) {
  const pesquisas = loadStore();
  const idx = pesquisas.findIndex(p => p.id === pesquisaId);
  if (idx === -1) return;

  const pesquisa = pesquisas[idx];
  const novaResposta: Resposta = {
    ...resposta,
    id: `r${Date.now()}`,
    data: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
  };

  novaResposta.respostas.forEach(rItem => {
    const pergunta = pesquisa.perguntas.find(p => p.id === rItem.perguntaId);
    if (!pergunta) return;

    if (rItem.novasOpcoesNomes && rItem.novasOpcoesNomes.length > 0) {
      rItem.novasOpcoesNomes.forEach(nome => {
        const cleanName = nome.trim();
        if (!cleanName) return;
        
        const existingOpcao = pergunta.opcoes.find(o => o.nome.toLowerCase() === cleanName.toLowerCase());
        if (existingOpcao) {
          if (!rItem.opcaoIds.includes(existingOpcao.id)) {
            rItem.opcaoIds.push(existingOpcao.id);
          }
        } else {
          const novoId = `o${Date.now()}_${Math.floor(Math.random() * 1000)}`;
          pergunta.opcoes.push({ id: novoId, nome: cleanName, votos: 0 });
          rItem.opcaoIds.push(novoId);
        }
      });
    }

    rItem.opcaoIds.forEach(opcaoId => {
      const opcao = pergunta.opcoes.find(o => o.id === opcaoId);
      if (opcao) {
        opcao.votos += 1;
      }
    });
  });

  pesquisa.respostas.push(novaResposta);
  pesquisas[idx] = pesquisa;
  saveStore(pesquisas);

  supabase.from('pesquisas_respostas').insert([{
    pesquisa_id: pesquisaId, entrevistado: resposta.entrevistado,
    telefone: resposta.telefone, fonte: resposta.fonte,
    opcoes_selecionadas: novaResposta.respostas, lat: resposta.lat, lng: resposta.lng,
    idade: resposta.idade
  }]).then(() => {
    supabase.from('pesquisas').update({ perguntas: pesquisa.perguntas }).eq('id', pesquisaId);
  });
}

export function addPesquisa(p: Omit<Pesquisa, 'id' | 'respostas'>) {
  const pesquisas = loadStore();
  const nova: Pesquisa = { ...p, id: Date.now(), respostas: [] };
  pesquisas.unshift(nova);
  saveStore(pesquisas);

  supabase.from('pesquisas').insert([{
    nome: p.nome, tipo: p.tipo, status: p.status, 
    perguntas: p.perguntas, meta_diaria: p.metaDiaria, meta_entrevistas: p.metaEntrevistas
  }]);

  return nova;
}

export function deletePesquisa(id: number) {
  const pesquisas = loadStore().filter(p => p.id !== id);
  saveStore(pesquisas);
  supabase.from('pesquisas').delete().eq('id', id);
}

export function updatePesquisa(id: number, data: Partial<Pesquisa>) {
  const pesquisas = loadStore();
  const idx = pesquisas.findIndex(p => p.id === id);
  if (idx > -1) {
    pesquisas[idx] = { ...pesquisas[idx], ...data };
    saveStore(pesquisas);
    supabase.from('pesquisas').update({
      nome: data.nome, tipo: data.tipo, status: data.status,
       perguntas: data.perguntas, meta_entrevistas: data.metaEntrevistas
    }).eq('id', id);
  }
}
