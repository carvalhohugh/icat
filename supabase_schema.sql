-- ESQUEMA DE BANCO DE DADOS INDEPENDENTE - INSTITUTO CATALANO (ICAT)
-- Módulo Educacional e Assistência Social Integrados

-- 1. EXTENSÕES E FUNÇÕES BASE
create extension if not exists "uuid-ossp";

-- 2. PERFIS E USUÁRIOS
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  email text not null,
  role text default 'student', -- 'admin', 'manager', 'social_worker', 'coordinator', 'teacher', 'student'
  phone text,
  document text, -- CPF
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. MÓDULO: PROJETOS E CURSOS (STANDALONE)
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  category text, -- Esporte, Cultura, Educação, etc.
  cover_url text,
  status text default 'active',
  created_at timestamp with time zone default now()
);

create table public.courses (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  description text,
  cover_url text,
  age_group text,
  status text default 'active',
  created_at timestamp with time zone default now()
);

create table public.classes (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade,
  teacher_id uuid references public.profiles(id) on delete set null,
  name text not null, -- Ex: "Turma A - Matutino"
  schedule text, -- Ex: "Segundas e Quartas, 14h às 16h"
  location text,
  vacancies integer,
  status text default 'active',
  created_at timestamp with time zone default now()
);

create table public.enrollments (
  id uuid default uuid_generate_v4() primary key,
  class_id uuid references public.classes(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  status text default 'active', -- 'active', 'pending', 'cancelled'
  enrolled_at timestamp with time zone default now(),
  unique(class_id, student_id)
);

-- 4. MÓDULO: PRESENÇA (MANUAL E QR CODE)
create table public.diaries (
  id uuid default uuid_generate_v4() primary key,
  class_id uuid references public.classes(id) on delete cascade,
  teacher_id uuid references public.profiles(id) on delete set null,
  session_date date not null,
  qr_token text unique, -- Token gerado dinamicamente para o QR Code
  qr_expires_at timestamp with time zone,
  status text default 'open',
  created_at timestamp with time zone default now()
);

create table public.attendances (
  id uuid default uuid_generate_v4() primary key,
  diary_id uuid references public.diaries(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  registration_method text, -- 'manual' ou 'qrcode'
  registered_at timestamp with time zone default now(),
  unique(diary_id, student_id)
);

-- 5. MÓDULO: ASSISTÊNCIA SOCIAL E BENEFÍCIOS
create table public.beneficiaries (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  document text, -- CPF
  birth_date date,
  phone text,
  address text,
  family_size integer,
  family_income numeric,
  socioeconomic_status text,
  observations text,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default now()
);

create table public.benefits (
  id uuid default uuid_generate_v4() primary key,
  name text not null, -- Cesta Básica, Roupa, Material Escolar
  category text,
  description text,
  status text default 'active'
);

create table public.benefit_deliveries (
  id uuid default uuid_generate_v4() primary key,
  benefit_id uuid references public.benefits(id) on delete cascade,
  beneficiary_id uuid references public.beneficiaries(id) on delete cascade,
  delivered_by uuid references public.profiles(id),
  quantity integer default 1,
  delivery_date timestamp with time zone default now(),
  observations text
);

-- 6. POLÍTICAS DE SEGURANÇA (RLS - Row Level Security)
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.courses enable row level security;
alter table public.classes enable row level security;
alter table public.enrollments enable row level security;
alter table public.diaries enable row level security;
alter table public.attendances enable row level security;
alter table public.beneficiaries enable row level security;
alter table public.benefits enable row level security;
alter table public.benefit_deliveries enable row level security;

-- (Políticas simplificadas para inicialização)
create policy "Public read access for projects and courses" on public.projects for select using (true);
create policy "Public read access for courses" on public.courses for select using (true);

-- Alunos podem ver suas matrículas e presenças
create policy "Students view own enrollments" on public.enrollments for select using (auth.uid() = student_id);
create policy "Students view own attendance" on public.attendances for select using (auth.uid() = student_id);

-- Professores gerenciam seus diários e presenças
create policy "Teachers manage own diaries" on public.diaries for all using (auth.uid() = teacher_id);
create policy "Teachers manage attendance of own diaries" on public.attendances for all using (
  exists (select 1 from public.diaries d where d.id = diary_id and d.teacher_id = auth.uid())
);

-- Proteção total aos dados socioeconômicos (Apenas Admins e Assistentes Sociais)
create policy "Restricted access to beneficiaries" on public.beneficiaries for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'social_worker', 'manager'))
);
