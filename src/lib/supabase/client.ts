import { createClient } from "@supabase/supabase-js";

// Fall back to harmless placeholders so the app can build/boot without a
// configured Supabase project. Any real read will fail loudly at request
// time until NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are
// set in .env.local (see .env.example) — that's expected before setup.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

/**
 * Cliente con la clave anónima: solo puede leer (RLS permite select público).
 * Seguro para Server Components y Client Components por igual.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});
