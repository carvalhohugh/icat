// Global in-memory store for survey responses (simulates real-time backend)
// Both the public link and the interviewer app write to this store
// The admin panel reads from this store

export type Opcao = { nome: string; partido?: string; votos: number };

export type Resposta = {
  id: string;
  entrevistado: string;
  cpf?: string;
  telefone?: string;
  opcaoIdxs: number[];  // supports multi-select
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
  induzida: boolean;
  multiSelect?: boolean;
  opcoes: Opcao[];
  entrevistadores: number[];
  respostas: Resposta[];
  metaDiaria?: number;
};

const STORAGE_KEY = 'icat_pesquisas_v1';

const INICIAL: Pesquisa[] = [
  {
    id: 1,
    nome: 'Intenção de Voto — Prefeito Catalão 2026',
    tipo: 'Intenção de Voto',
    status: 'Ativa',
    induzida: true,
    multiSelect: false,
    opcoes: [
      { nome: 'Renato Ribeiro', partido: 'PL', votos: 142 },
      { nome: 'Velomar Rios', partido: 'MDB', votos: 98 },
      { nome: 'Adilson Cardoso', partido: 'PT', votos: 67 },
    ],
    entrevistadores: [1, 2],
    respostas: [
      { id: 'r1', entrevistado: 'José da Silva', telefone: '(64) 99900-0001', opcaoIdxs: [0], entrevistadorId: 1, fonte: 'entrevistador', data: '09/09/2026 14:22' },
      { id: 'r2', entrevistado: 'Maria Santos', telefone: '(64) 99900-0002', opcaoIdxs: [1], entrevistadorId: 2, fonte: 'entrevistador', data: '09/09/2026 14:35' },
      { id: 'r3', entrevistado: 'Carlos Pereira', telefone: '(64) 99900-0003', opcaoIdxs: [0], entrevistadorId: 1, fonte: 'entrevistador', data: '09/09/2026 15:01' },
    ],
  },
  {
    id: 2,
    nome: 'Melhorias Necessárias — Catalão',
    tipo: 'Opinião',
    status: 'Ativa',
    induzida: false,
    multiSelect: true,
    opcoes: [
      { nome: 'Saúde', votos: 87 },
      { nome: 'Segurança', votos: 65 },
      { nome: 'Educação', votos: 54 },
      { nome: 'Infraestrutura', votos: 43 },
      { nome: 'Transporte', votos: 31 },
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

  // Update votos counts
  novaResposta.opcaoIdxs.forEach(opcaoIdx => {
    if (pesquisa.opcoes[opcaoIdx]) {
      pesquisa.opcoes[opcaoIdx].votos += 1;
    }
  });

  pesquisa.respostas.push(novaResposta);
  pesquisas[idx] = pesquisa;
  saveStore(pesquisas);
}

export function addPesquisa(p: Omit<Pesquisa, 'id' | 'respostas'>) {
  const pesquisas = loadStore();
  const nova: Pesquisa = { ...p, id: Date.now(), respostas: [] };
  pesquisas.unshift(nova);
  saveStore(pesquisas);
  return nova;
}

export function deletePesquisa(id: number) {
  const pesquisas = loadStore().filter(p => p.id !== id);
  saveStore(pesquisas);
}

export function updatePesquisa(id: number, data: Partial<Pesquisa>) {
  const pesquisas = loadStore();
  const idx = pesquisas.findIndex(p => p.id === id);
  if (idx > -1) {
    pesquisas[idx] = { ...pesquisas[idx], ...data };
    saveStore(pesquisas);
  }
}
