-- ============================================================================
-- UPC Líderes — esquema de base de datos para Supabase
-- Ejecutar completo en el SQL Editor de tu proyecto Supabase (una sola vez).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Tabla: faculties (facultades)
-- ----------------------------------------------------------------------------
create table if not exists public.faculties (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Tabla: careers (carreras / programas)
-- ----------------------------------------------------------------------------
create table if not exists public.careers (
  id uuid primary key default gen_random_uuid(),
  faculty_id uuid not null references public.faculties(id) on delete cascade,
  name text not null,
  slug text not null,
  degree_title text,
  level text default 'Pregrado',
  duration_semesters int,
  credits int,
  methodology text default 'Presencial',
  schedule text default 'Única',
  resolution_type text,
  resolution_number text,
  accreditation_number text,
  approval_date date,
  location text default 'Valledupar - Cesar',
  created_at timestamptz not null default now(),
  unique (faculty_id, slug)
);

-- ----------------------------------------------------------------------------
-- Tabla: leaders (líderes)
-- ----------------------------------------------------------------------------
create table if not exists public.leaders (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  middle_name text,
  last_name text not null,
  second_last_name text,
  cedula text not null unique,
  birth_date date not null,
  birth_place text not null,
  age int not null check (age >= 0 and age <= 120),
  semester int not null check (semester between 1 and 10),
  career_id uuid not null references public.careers(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leaders_career_id_idx on public.leaders (career_id);
create index if not exists careers_faculty_id_idx on public.careers (faculty_id);

-- updated_at automático en leaders
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leaders_set_updated_at on public.leaders;
create trigger leaders_set_updated_at
  before update on public.leaders
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Row Level Security
-- Lectura pública (vista de espectador). Las escrituras (crear/editar/eliminar
-- líderes) se hacen desde rutas del servidor con la service role key, previa
-- verificación de sesión de administrador — nunca desde el navegador con la
-- clave anónima. Por eso no se definen políticas de insert/update/delete aquí.
-- ----------------------------------------------------------------------------
alter table public.faculties enable row level security;
alter table public.careers enable row level security;
alter table public.leaders enable row level security;

drop policy if exists "faculties_public_read" on public.faculties;
create policy "faculties_public_read" on public.faculties for select using (true);

drop policy if exists "careers_public_read" on public.careers;
create policy "careers_public_read" on public.careers for select using (true);

drop policy if exists "leaders_public_read" on public.leaders;
create policy "leaders_public_read" on public.leaders for select using (true);

-- ============================================================================
-- Datos semilla: facultades y carreras
-- ============================================================================

insert into public.faculties (name, slug) values
  ('Facultad Ciencias Administrativas, Contables y Económicas', 'ciencias-administrativas-contables-economicas'),
  ('Facultad de Bellas Artes', 'bellas-artes'),
  ('Facultad de Derecho, Ciencias Políticas y Sociales', 'derecho-ciencias-politicas-sociales'),
  ('Facultad de Ciencias Básicas', 'ciencias-basicas'),
  ('Facultad de Ingenierías y Tecnologías', 'ingenierias-tecnologias'),
  ('Facultad Ciencias de la Salud', 'ciencias-de-la-salud'),
  ('Facultad de Educación', 'educacion')
on conflict (slug) do nothing;

-- Ciencias Administrativas, Contables y Económicas
insert into public.careers (faculty_id, name, slug, degree_title, duration_semesters, credits, resolution_type, resolution_number, location)
select id, 'Administración de Empresas', 'administracion-de-empresas', 'Administrador de Empresas', 10, 169, 'Registro calificado', '009334', 'Valledupar - Cesar'
from public.faculties where slug = 'ciencias-administrativas-contables-economicas'
union all
select id, 'Administración de Empresas Turísticas y Hoteleras', 'administracion-de-empresas-turisticas-y-hoteleras', 'Administrador de Empresas Turísticas y Hoteleras', 9, 155, 'Registro calificado', '014965', 'Valledupar - Cesar'
from public.faculties where slug = 'ciencias-administrativas-contables-economicas'
union all
select id, 'Comercio Internacional', 'comercio-internacional', 'Profesional en Comercio Internacional', 10, 166, 'Registro calificado', '21930', 'Valledupar - Cesar'
from public.faculties where slug = 'ciencias-administrativas-contables-economicas'
union all
select id, 'Contaduría Pública', 'contaduria-publica', 'Contador(a) Público', 10, 168, 'Registro calificado', '9333', 'Valledupar - Cesar'
from public.faculties where slug = 'ciencias-administrativas-contables-economicas'
union all
select id, 'Economía', 'economia', 'Economista', 10, 168, 'Registro calificado', '9335', 'Valledupar - Cesar'
from public.faculties where slug = 'ciencias-administrativas-contables-economicas'
on conflict (faculty_id, slug) do nothing;

-- Bellas Artes
insert into public.careers (faculty_id, name, slug, degree_title, duration_semesters, credits, resolution_type, resolution_number, location)
select id, 'Licenciatura en Artes', 'licenciatura-en-artes', 'Licenciado(a) en Artes', 10, 170, 'Registro calificado', '24650', 'Valledupar - Cesar'
from public.faculties where slug = 'bellas-artes'
union all
select id, 'Música', 'musica', 'Maestro(a) en Música', 10, 168, 'Registro calificado', '04524', 'Valledupar - Cesar'
from public.faculties where slug = 'bellas-artes'
on conflict (faculty_id, slug) do nothing;

-- Derecho, Ciencias Políticas y Sociales
insert into public.careers (faculty_id, name, slug, degree_title, duration_semesters, credits, resolution_type, resolution_number, schedule, location)
select id, 'Derecho', 'derecho', 'Abogado(a)', 10, 169, 'Registro calificado', '5804', 'Única', 'Valledupar - Cesar'
from public.faculties where slug = 'derecho-ciencias-politicas-sociales'
union all
select id, 'Sociología', 'sociologia', 'Sociólogo(a)', 10, 162, 'Registro calificado', '03053', 'Diurna/Nocturna', 'Valledupar - Cesar'
from public.faculties where slug = 'derecho-ciencias-politicas-sociales'
union all
select id, 'Psicología', 'psicologia', 'Psicólogo(a)', 10, 160, 'Registro calificado', '17786', 'Diurna/Nocturna', 'Valledupar - Cesar'
from public.faculties where slug = 'derecho-ciencias-politicas-sociales'
on conflict (faculty_id, slug) do nothing;

-- Ciencias Básicas
insert into public.careers (faculty_id, name, slug, degree_title, duration_semesters, credits, resolution_type, resolution_number, accreditation_number, approval_date, location)
select id, 'Microbiología', 'microbiologia', 'Microbiólogo(a)', 10, 158, 'Acreditación', '004927', '004927', date '2024-04-16', 'Valledupar - Cesar'
from public.faculties where slug = 'ciencias-basicas'
on conflict (faculty_id, slug) do nothing;

-- Ingenierías y Tecnologías
insert into public.careers (faculty_id, name, slug, degree_title, duration_semesters, credits, resolution_type, resolution_number, location)
select id, 'Ingeniería Agroindustrial', 'ingenieria-agroindustrial', 'Ingeniero Agroindustrial', 10, 187, 'Registro calificado', '09870', 'Valledupar - Cesar'
from public.faculties where slug = 'ingenierias-tecnologias'
union all
select id, 'Ingeniería Ambiental y Sanitaria', 'ingenieria-ambiental-y-sanitaria', 'Ingeniero Ambiental y Sanitario', 10, 169, 'Registro calificado', '15826', 'Valledupar - Cesar'
from public.faculties where slug = 'ingenierias-tecnologias'
union all
select id, 'Ingeniería de Sistemas', 'ingenieria-de-sistemas', 'Ingeniero de Sistemas', 9, 155, 'Registro calificado', '013785 del 01/07/2025', 'Valledupar - Cesar'
from public.faculties where slug = 'ingenierias-tecnologias'
union all
select id, 'Ingeniería Electrónica', 'ingenieria-electronica', 'Ingeniero Electrónico', 10, 186, 'Registro calificado', '15489', 'Valledupar - Cesar'
from public.faculties where slug = 'ingenierias-tecnologias'
on conflict (faculty_id, slug) do nothing;

-- Ciencias de la Salud
insert into public.careers (faculty_id, name, slug, degree_title, duration_semesters, credits, resolution_type, resolution_number, location)
select id, 'Enfermería', 'enfermeria', 'Enfermera(o)', 9, 160, 'Registro calificado', '473', 'Valledupar - Cesar'
from public.faculties where slug = 'ciencias-de-la-salud'
union all
select id, 'Instrumentación Quirúrgica', 'instrumentacion-quirurgica', 'Instrumentador(a) Quirúrgico(a)', 9, 160, 'Registro calificado', '391', 'Valledupar - Cesar'
from public.faculties where slug = 'ciencias-de-la-salud'
union all
select id, 'Fisioterapia', 'fisioterapia', 'Fisioterapeuta', 10, 160, 'Registro calificado', '11944', 'Valledupar - Cesar'
from public.faculties where slug = 'ciencias-de-la-salud'
on conflict (faculty_id, slug) do nothing;

-- Educación
insert into public.careers (faculty_id, name, slug, degree_title, duration_semesters, credits, resolution_type, resolution_number, location)
select id, 'Licenciatura en Ciencias Naturales y Educación Ambiental', 'licenciatura-en-ciencias-naturales-y-educacion-ambiental', 'Licenciado(a) en Ciencias Naturales y Educación Ambiental', 10, 166, 'Registro calificado', '3998', 'Valledupar - Cesar'
from public.faculties where slug = 'educacion'
union all
select id, 'Licenciatura en Literatura y Lengua Castellana', 'licenciatura-en-literatura-y-lengua-castellana', 'Licenciado(a) en Literatura y Lengua Castellana', 10, 170, 'Registro calificado', '012587', 'Valledupar - Cesar'
from public.faculties where slug = 'educacion'
union all
select id, 'Licenciatura en Matemáticas', 'licenciatura-en-matematicas', 'Licenciado(a) en Matemáticas', 10, 167, 'Registro calificado', '07346', 'Valledupar - Cesar'
from public.faculties where slug = 'educacion'
union all
select id, 'Licenciatura en Español e Inglés', 'licenciatura-en-espanol-e-ingles', 'Licenciado(a) en Español e Inglés', 10, 160, 'Registro calificado', '01993', 'Valledupar - Cesar'
from public.faculties where slug = 'educacion'
on conflict (faculty_id, slug) do nothing;

-- Registro de acreditación adicional para Licenciatura en Matemáticas
update public.careers
set accreditation_number = '021456'
where slug = 'licenciatura-en-matematicas';
