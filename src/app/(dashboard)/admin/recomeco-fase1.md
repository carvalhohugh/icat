# Projeto Recomeço — Relatório de Análise Técnica (FASE 1)
**Autor:** Antigravity (Atuando como AIOX Master & UX/UI Lead)  
**Módulo:** Módulo Social Integrado ao ICAT

---

## 1. Módulos e Componentes Existentes a Serem Reutilizados
Para garantir a coesão do **Projeto Recomeço** com o restante do sistema ICAT, não recriaremos componentes. Utilizaremos o Design System já presente em `src/components` e `src/app/(dashboard)`.

- **Layout e Navegação:** A `Sidebar` existente será atualizada para incluir a seção "Projeto Recomeço" (logo abaixo de Assistência Social).
- **Cards e Gráficos (Dashboard):** Reutilização dos `KPI Cards` (ícones + valores), `PieChart` e `BarChart3` implementados em `admin/page.tsx`.
- **Tabelas e Paginação:** Utilizaremos o esqueleto de listagem, busca e filtro em tempo real (debounced) criado em `admin/alunos` e `admin/beneficiarios`.
- **Modais (Slide-overs / Modals):** A estrutura de formulários já desenhada em `admin/beneficiarios/page.tsx` será o ponto de partida para o formulário segmentado de "Novo Beneficiário".
- **Sistema de Carteirinhas PVC:** Será reutilizado no "Perfil do Beneficiário" para rápida emissão de carteirinha social.
- **Integração Auth & RLS:** Utilização da instância `supabase` configurada em `src/lib/supabase.ts`.

---

## 2. Entidades do Banco de Dados (Supabase)
### 2.1. Tabelas Existentes que Serão Aproveitadas
O ICAT já conta com uma tabela central que será a **espinha dorsal** do Projeto Recomeço, para evitar a duplicação de pessoas no banco de dados.
- `beneficiarios`: Atualmente possui `id`, `nome`, `cpf`, `bairro`, `filhos`, `status`, `renda_estimada`, `whatsapp`, `foto_url`.
  * **Ação:** Esta tabela sofrerá um `ALTER TABLE` para incluir novos relacionamentos e estados sociais, ao invés de criarmos uma `recomeco_participantes` do zero.

### 2.2. Novas Entidades Necessárias (Modelo Relacional)
As novas tabelas serão criadas sob o namespace do módulo (se aplicável), ou diretamente estendendo a arquitetura atual:

1. **`familias`:** `id`, `responsavel_id` (FK `beneficiarios`), `bairro`, `renda_familiar`, `moradia`, `observacoes`.
2. **`beneficiarios_habilidades` / `interesses`:** Relacionamento N:N entre a tabela base de Beneficiários e domínios fixos (ex: "Costura", "Informática").
3. **`atendimentos_sociais`:** Registro histórico. `id`, `beneficiario_id`, `data`, `tipo`, `motivo`, `orientacao`, `responsavel_id`.
4. **`acompanhamentos`:** `id`, `beneficiario_id`, `prazo`, `objetivo`, `status` (Pendente, Concluído, Atrasado).
5. **`planos_desenvolvimento` (Planos de Recomeço):** `id`, `beneficiario_id`, `objetivo_principal`, `progresso`.
6. **`oportunidades`:** Vagas/Cursos. `id`, `titulo`, `tipo`, `empresa_id`, `vagas`, `requisitos`, `status`.
7. **`encaminhamentos`:** Match. `id`, `beneficiario_id`, `oportunidade_id`, `status` (Entrevista, Aprovado, Concluído).
8. **`empresas_parceiras`:** `id`, `nome`, `cnpj`, `tipo_parceria`.

---

## 3. Web Scraping de Oportunidades (Integração Externa)
A automação solicitada para o portal oficial da Prefeitura de Catalão (SINE / Vagas) será implementada como uma API Route no Next.js (`/api/oportunidades/sync`).
- **Arquitetura:** Utilizaremos `cheerio` para varrer o DOM da URL `https://catalao.go.gov.br/` (seção do SINE ou Vagas), mapeando Título da Vaga e Requisitos.
- **Persistência:** Essas vagas serão inseridas na tabela `oportunidades` do ICAT de forma autônoma (via Cron Job usando Vercel Cron ou Trigger.dev).
- **Match:** O motor cruzará os requisitos salvos pela API com as `habilidades` da tabela de `beneficiarios` do Projeto Recomeço.

---

## 4. Ordem de Implementação (Roadmap)
Como o projeto é vasto, a execução tática será dividida nas seguintes próximas etapas (Fases 2 e 3):

1. **Atualizar Banco de Dados (Supabase Migration):** 
   - Expandir `beneficiarios` com campos essenciais (estado civil, escolaridade).
   - Criar tabelas de `familias` e tabelas auxiliares de Habilidades/Interesses.
2. **Refatorar Cadastro (Novo Beneficiário):**
   - Transformar o modal atual em um fluxo com 5 abas/sections (Dados Pessoais, Trabalho e Renda, Educação, Necessidades, Interesses).
3. **Construir Perfil do Participante:**
   - Criar a página de detalhes dinâmica `admin/recomeco/beneficiario/[id]` com a Linha do Tempo e "Status do Participante" (Emergencial -> Autonomia).
4. **Módulo de Oportunidades & Scraping API:**
   - Criar painel de vagas.
   - Escrever a API que raspa as vagas da prefeitura.
5. **Dashboards de Impacto.**

---

**Validação de Risco:** Não há conflitos arquiteturais. A expansão da entidade `beneficiarios` atual absorve a nova complexidade do *Projeto Recomeço* de maneira limpa, preservando as rotinas do módulo de Assistência (entregas de cestas) que já foram codificadas.
