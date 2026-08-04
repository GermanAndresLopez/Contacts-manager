## UPC Líderes

Directorio de líderes estudiantiles por facultad y carrera. Incluye un login  
básico de administrador para registrar/editar/eliminar líderes, y una vista  
pública (espectador) para consultar el directorio, filtrar y explorar  
facultades y carreras.

*   **Stack**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui
    *   Supabase (Postgres) + Server Actions.
*   **Diseño**: paleta institucional navy/oro, tipografía Crimson Pro (títulos) +  
    Atkinson Hyperlegible (texto), animaciones con `motion` siguiendo los  
    principios de Apple (spring, feedback inmediato) y Emil Kowalski  
    (easing propio, stagger corto, presión en botones).

## 1\. Crear el proyecto en Supabase

1.  Crea un proyecto nuevo en [supabase.com](https://supabase.com).
2.  Ve a **SQL Editor** y ejecuta completo el archivo [`supabase/schema.sql`](supabase/schema.sql)  
    de este repo. Crea las tablas `faculties`, `careers`, `leaders`, activa RLS  
    con lectura pública, y **precarga las 7 facultades y 22 carreras** con sus  
    datos (título otorgado, créditos, resolución, etc.).
3.  Ve a **Project Settings → API** y copia:
    *   `Project URL`
    *   `anon public` key
    *   `service_role` key (secreta — nunca la expongas al navegador)

## 2\. Configurar variables de entorno

Copia `.env.example` a `.env.local` (ya existe un `.env.local` de plantilla)  
y completa:

```plaintext
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin

# genera uno nuevo con: openssl rand -base64 32
ADMIN_SESSION_SECRET=...
```

Sin `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` reales, la app  
compila y el login funciona, pero las páginas que leen datos (inicio,  
directorio, facultades, panel admin) mostrarán un error — es esperado hasta  
que conectes tu proyecto.

## 3\. Correr en desarrollo

```plaintext
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

*   Sitio público: `/`, `/directorio`, `/facultades`.
*   Login de administrador: `/login` (usuario/contraseña definidos en  
    `ADMIN_USERNAME` / `ADMIN_PASSWORD`, por defecto `admin` / `admin`).
*   Panel de administración (protegido): `/admin`.

## Cómo funciona la seguridad

*   **Lectura pública**: el cliente con la `anon key` solo puede hacer `SELECT`  
    (RLS lo permite explícitamente; no hay políticas de `insert/update/delete`  
    para el rol anónimo).
*   **Escritura (crear/editar/eliminar líderes)**: ocurre únicamente en Server  
    Actions (`src/actions/leaders.ts`), que verifican la sesión de  
    administrador y usan la `service_role key` — esta clave nunca llega al  
    navegador.
*   **Sesión de administrador**: cookie `httpOnly` firmada con JWT (librería  
    `jose`), válida por 8 horas. `src/proxy.ts` (el equivalente a Middleware en  
    Next.js 16) hace un chequeo optimista por cookie para redirigir a `/login`;  
    cada Server Action y cada página `/admin/**` vuelve a verificar la sesión  
    del lado del servidor (`src/lib/dal.ts`).

## Estructura relevante

```plaintext
src/
  app/
    (public)/            inicio, /directorio, /facultades — con SiteHeader/Footer
    admin/                panel protegido (layout verifica sesión)
    login/
  actions/                Server Actions: auth.ts, leaders.ts
  components/
    admin/                formulario de líder, tabla, sidebar, login
    motion/                stagger-grid, fade-in (framer-motion / "motion")
    ui/                    shadcn/ui (base-ui)
  lib/
    supabase/              client.ts (anon, lectura) / admin.ts (service role, servidor)
    session.ts, dal.ts     sesión de admin (jose) y verificación
    data.ts                lecturas: facultades, carreras, líderes, stats
    schemas.ts              validación zod + cálculo de edad
supabase/
  schema.sql                tablas + RLS + datos semilla (facultades/carreras)
```

## Notas de alcance

*   La edad del líder se calcula automáticamente a partir de la fecha de  
    nacimiento (en el servidor, al guardar) — no se pide como dato manual para  
    evitar inconsistencias.
*   La vista pública **no expone cédula ni fecha/lugar de nacimiento** de los  
    líderes (solo nombre, carrera, facultad y semestre); esos datos completos  
    solo se ven en el panel de administración. Si prefieres mostrarlos también  
    al público, es un cambio puntual en `src/components/leader-card.tsx`.