-- ==========================================
-- SCHEMA DO INSTITUTO CATALANO (ICAT)
-- Para rodar no SQL Editor do Supabase
-- ==========================================

-- 1. Alunos
CREATE TABLE IF NOT EXISTS public.alunos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR NOT NULL,
  curso VARCHAR NOT NULL,
  idade INTEGER,
  status VARCHAR DEFAULT 'Matriculado',
  whatsapp VARCHAR,
  responsavel VARCHAR,
  foto_url TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER SEQUENCE public.alunos_id_seq RESTART WITH 7001;

-- 2. Beneficiários
CREATE TABLE IF NOT EXISTS public.beneficiarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR NOT NULL,
  cpf VARCHAR,
  bairro VARCHAR,
  filhos INTEGER DEFAULT 0,
  status VARCHAR DEFAULT 'Pendente',
  renda_estimada DECIMAL(10,2) DEFAULT 0,
  whatsapp VARCHAR,
  foto_url TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER SEQUENCE public.beneficiarios_id_seq RESTART WITH 1001;

-- 3. Estoque
CREATE TABLE IF NOT EXISTS public.estoque_itens (
  id SERIAL PRIMARY KEY,
  nome VARCHAR NOT NULL,
  categoria VARCHAR NOT NULL,
  quantidade_atual INTEGER DEFAULT 0,
  limite_alerta INTEGER DEFAULT 5,
  descricao TEXT,
  conteudo_pacote JSONB,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.estoque_movimentacoes (
  id SERIAL PRIMARY KEY,
  item_id INTEGER REFERENCES public.estoque_itens(id) ON DELETE CASCADE,
  tipo VARCHAR NOT NULL, -- 'Entrada' ou 'Saída'
  quantidade INTEGER NOT NULL,
  responsavel_nome VARCHAR,
  beneficiario_id INTEGER REFERENCES public.beneficiarios(id) ON DELETE SET NULL,
  data_movimento TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Financeiro
CREATE TABLE IF NOT EXISTS public.financeiro_transacoes (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR NOT NULL, -- 'Receita' ou 'Despesa'
  descricao TEXT NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  categoria VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'pendente',
  data_pagamento DATE,
  conta_bancaria VARCHAR,
  criado_por UUID,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Pesquisas
CREATE TABLE IF NOT EXISTS public.pesquisas (
  id BIGINT PRIMARY KEY,
  nome VARCHAR NOT NULL,
  tipo VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'Ativa',
  induzida BOOLEAN DEFAULT false,
  multi_select BOOLEAN DEFAULT false,
  meta_diaria INTEGER,
  opcoes JSONB,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pesquisas_respostas (
  id SERIAL PRIMARY KEY,
  pesquisa_id BIGINT REFERENCES public.pesquisas(id) ON DELETE CASCADE,
  entrevistado VARCHAR,
  telefone VARCHAR,
  fonte VARCHAR,
  entrevistador_id UUID,
  opcoes_selecionadas JSONB,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Configurações
CREATE TABLE IF NOT EXISTS public.configuracoes_instituicao (
  chave VARCHAR PRIMARY KEY,
  valor JSONB NOT NULL,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Segurança) mas deixar aberto para o ICAT (MVP)
ALTER TABLE public.alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beneficiarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estoque_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estoque_movimentacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financeiro_transacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pesquisas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pesquisas_respostas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes_instituicao ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso total (apenas para MVP/Desenvolvimento)
CREATE POLICY "Acesso total" ON public.alunos FOR ALL USING (true);
CREATE POLICY "Acesso total" ON public.beneficiarios FOR ALL USING (true);
CREATE POLICY "Acesso total" ON public.estoque_itens FOR ALL USING (true);
CREATE POLICY "Acesso total" ON public.estoque_movimentacoes FOR ALL USING (true);
CREATE POLICY "Acesso total" ON public.financeiro_transacoes FOR ALL USING (true);
CREATE POLICY "Acesso total" ON public.pesquisas FOR ALL USING (true);
CREATE POLICY "Acesso total" ON public.pesquisas_respostas FOR ALL USING (true);
CREATE POLICY "Acesso total" ON public.configuracoes_instituicao FOR ALL USING (true);
