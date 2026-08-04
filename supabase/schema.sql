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
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Por si ya habías creado la tabla antes de que existiera esta columna.
alter table public.leaders add column if not exists phone text;

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

-- ============================================================================
-- Líderes de ejemplo (para que el directorio no arranque vacío).
-- Bórralos cuando tengas datos reales: delete from public.leaders where
-- cedula like '10658423%';
-- ============================================================================

insert into public.leaders
  (first_name, middle_name, last_name, second_last_name, cedula, birth_date, birth_place, age, semester, career_id, phone)
select 'Valentina', 'Sofía', 'Martínez', 'Pérez', '1065842301', date '2003-05-14', 'Valledupar - Cesar', 23, 3, id, '3001234567' from public.careers where slug = 'administracion-de-empresas'
union all
select 'Juan', 'David', 'Rodríguez', 'Gómez', '1065842302', date '2001-11-02', 'Valledupar - Cesar', 24, 5, id, '3012345678' from public.careers where slug = 'administracion-de-empresas-turisticas-y-hoteleras'
union all
select 'María', 'José', 'Ramírez', 'Torres', '1065842303', date '2004-02-20', 'Valledupar - Cesar', 22, 2, id, '3023456789' from public.careers where slug = 'comercio-internacional'
union all
select 'Andrés', 'Felipe', 'López', 'Cárdenas', '1065842304', date '2000-08-09', 'Bosconia - Cesar', 25, 7, id, '3034567890' from public.careers where slug = 'contaduria-publica'
union all
select 'Laura', 'Camila', 'Díaz', 'Ospina', '1065842305', date '2002-12-30', 'Valledupar - Cesar', 23, 4, id, '3045678901' from public.careers where slug = 'economia'
union all
select 'Sebastián', 'Andrés', 'Vega', 'Molina', '1065842306', date '2001-04-17', 'Aguachica - Cesar', 25, 6, id, '3056789012' from public.careers where slug = 'licenciatura-en-artes'
union all
select 'Isabella', 'Fernanda', 'Guerra', 'Castro', '1065842307', date '2005-09-05', 'Valledupar - Cesar', 20, 1, id, '3067890123' from public.careers where slug = 'musica'
union all
select 'Santiago', 'Rafael', 'Mendoza', 'Ríos', '1065842308', date '1999-06-25', 'Valledupar - Cesar', 27, 8, id, '3078901234' from public.careers where slug = 'derecho'
union all
select 'Camila', 'Andrea', 'Peralta', 'Julio', '1065842309', date '2003-01-12', 'La Paz - Cesar', 23, 3, id, '3089012345' from public.careers where slug = 'sociologia'
union all
select 'Diego', 'Alejandro', 'Solano', 'Brito', '1065842310', date '2002-03-28', 'Valledupar - Cesar', 24, 5, id, '3090123456' from public.careers where slug = 'psicologia'
union all
select 'Daniela', 'Patricia', 'Nieves', 'Arias', '1065842311', date '2000-07-19', 'Santa Marta - Magdalena', 26, 9, id, '3101234567' from public.careers where slug = 'microbiologia'
union all
select 'Kevin', 'Alexander', 'Daza', 'Uribe', '1065842312', date '2002-10-08', 'Codazzi - Cesar', 23, 4, id, '3112345678' from public.careers where slug = 'ingenieria-agroindustrial'
union all
select 'Paula', 'Andrea', 'Rincón', 'Salcedo', '1065842313', date '2001-05-23', 'Valledupar - Cesar', 25, 6, id, '3123456789' from public.careers where slug = 'ingenieria-ambiental-y-sanitaria'
union all
select 'Jhon', 'Fredy', 'Quintero', 'Barros', '1065842314', date '2004-08-30', 'Valledupar - Cesar', 21, 2, id, '3134567890' from public.careers where slug = 'ingenieria-de-sistemas'
union all
select 'Karen', 'Sofía', 'Villazón', 'Meza', '1065842315', date '2000-02-14', 'Barranquilla - Atlántico', 26, 7, id, '3145678901' from public.careers where slug = 'ingenieria-de-sistemas'
union all
select 'Luis', 'Fernando', 'Iguarán', 'Epieyú', '1065842316', date '2001-12-01', 'Riohacha - La Guajira', 24, 5, id, '3156789012' from public.careers where slug = 'ingenieria-electronica'
union all
select 'Adriana', 'Lucía', 'Barros', 'Fontalvo', '1065842317', date '2003-06-06', 'Valledupar - Cesar', 23, 3, id, '3167890123' from public.careers where slug = 'enfermeria'
union all
select 'Miguel', 'Ángel', 'Choles', 'Pushaina', '1065842318', date '1999-10-22', 'Valledupar - Cesar', 26, 8, id, '3178901234' from public.careers where slug = 'instrumentacion-quirurgica'
union all
select 'Natalia', 'Andrea', 'Orozco', 'Beltrán', '1065842319', date '2005-03-15', 'Valledupar - Cesar', 21, 1, id, '3189012345' from public.careers where slug = 'fisioterapia'
union all
select 'Carlos', 'Andrés', 'Movil', 'Redondo', '1065842320', date '1998-11-11', 'Valledupar - Cesar', 27, 10, id, '3190123456' from public.careers where slug = 'licenciatura-en-matematicas'
on conflict (cedula) do nothing;
