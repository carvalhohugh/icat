-- 1. Atualizar Tabela de Cursos
ALTER TABLE public.courses
ADD COLUMN vacancies integer DEFAULT 0,
ADD COLUMN cost numeric DEFAULT 0;

-- 2. Empresas Parceiras
CREATE TABLE public.partners (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  logo_url text,
  website text,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- 3. Configurações do Site
CREATE TABLE public.site_settings (
  id uuid default gen_random_uuid() primary key,
  key_name text unique not null,
  value jsonb not null,
  description text,
  updated_at timestamp with time zone default now()
);

-- 4. Clube de Vantagens
CREATE TABLE public.advantage_club (
  id uuid default gen_random_uuid() primary key,
  partner_id uuid references public.partners(id) on delete cascade,
  title text not null,
  description text,
  discount_type text, -- 'percentage', 'fixed', 'freebie'
  discount_value numeric,
  rules text,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- RLS (simplificado para admin)
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advantage_club ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read partners" ON public.partners FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public read advantages" ON public.advantage_club FOR SELECT USING (true);

-- Inserir Configurações Padrões
INSERT INTO public.site_settings (key_name, value, description) VALUES
('contact', '{"phone": "5564999119610", "email": "contato@icat.org.br", "address": "Catalão, GO"}', 'Dados de contato do instituto'),
('donation_pix', '{"cnpj": "12.345.678/0001-90", "receiver_name": "INSTITUTO CATALANO"}', 'Chave PIX e dados para o gerador de doação'),
('social_media', '{"instagram": "https://instagram.com", "facebook": "https://facebook.com"}', 'Links das redes sociais');
