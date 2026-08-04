import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Cliente con la service role key: puede escribir sin restricciones de RLS.
 * SOLO se importa desde Server Actions / código de servidor, nunca desde
 * componentes cliente. Cada acción que la usa debe verificar la sesión de
 * administrador primero (ver lib/dal.ts).
 */
export function getSupabaseAdmin() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY. Revisa tu archivo .env.local (ver .env.example).",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
