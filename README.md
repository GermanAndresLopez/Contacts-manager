## UPC Líderes

Herramienta interna del equipo para llevar el registro de líderes estudiantiles
por facultad y carrera. Login de administrador para registrar/editar/eliminar
líderes, y una vista de consulta para el resto del equipo con filtros y
contacto directo por WhatsApp.

*   **Stack**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui
    *   Supabase (Postgres) + Server Actions.
*   **Diseño**: paleta unificada en azul (sin colores sueltos), una sola
    tipografía (Plus Jakarta Sans) para todo, animaciones con `motion`
    siguiendo los principios de Apple (spring, feedback inmediato) y Emil
    Kowalski (easing propio, stagger corto, presión en botones).

## 1\. Crear el proyecto en Supabase

1.  Crea un proyecto nuevo en [supabase.com](https://supabase.com).
2.  Ve a **SQL Editor** y ejecuta completo el archivo [`supabase/schema.sql`](supabase/schema.sql)  
    de este repo. Crea las tablas `faculties`, `careers`, `leaders` (con
    columna `phone`), activa RLS con lectura pública, precarga las 7
    facultades y 22 carreras, y agrega **20 líderes de ejemplo** para que el
    directorio no arranque vacío. El script es idempotente: puedes volver a
    correrlo sin duplicar nada.
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

## 3\. Correr en desarrollo

```plaintext
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

*   Vista del equipo: `/`, `/directorio`, `/facultades`.
*   Login de administrador: `/login` (usuario/contraseña definidos en  
    `ADMIN_USERNAME` / `ADMIN_PASSWORD`, por defecto `admin` / `admin`).
*   Panel de administración (protegido): `/admin`.

## Cómo funciona la seguridad

*   **Lectura**: el cliente con la `anon key` solo puede hacer `SELECT`  
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
    motion/                stagger-grid, fade-in ("motion")
    ui/                    shadcn/ui (base-ui)
  lib/
    supabase/              client.ts (anon, lectura) / admin.ts (service role, servidor)
    session.ts, dal.ts     sesión de admin (jose) y verificación
    data.ts                lecturas: facultades, carreras, líderes, stats
    schemas.ts              validación zod + cálculo de edad
    whatsapp.ts              helper wa.me a partir del celular
supabase/
  schema.sql                tablas + RLS + datos semilla (facultades/carreras/líderes)
```

## Notas de alcance

*   La edad del líder se calcula automáticamente a partir de la fecha de  
    nacimiento (en el servidor, al guardar) — no se pide como dato manual.
*   La tarjeta de cada líder muestra cédula, fecha y lugar de nacimiento,
    semestre, carrera/facultad y un botón de WhatsApp que abre el chat
    directo al celular registrado (asume indicativo +57 si el número tiene
    10 dígitos).
*   Facultades despliega las carreras de cada facultad en el mismo lugar
    (acordeón), sin recargar la página.
