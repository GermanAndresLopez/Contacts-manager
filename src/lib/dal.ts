import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session";

/**
 * Verificación "segura": se usa dentro de Server Actions y páginas /admin
 * para confirmar la sesión antes de leer/escribir datos sensibles.
 * Memoizada por render con React.cache.
 */
export const verifyAdminSession = cache(async () => {
  const session = await getAdminSession();
  if (!session || session.role !== "admin") {
    redirect("/login");
  }
  return session;
});

/**
 * Igual que verifyAdminSession pero sin redirigir — útil para Server
 * Actions que deben devolver un estado de error en vez de navegar.
 */
export const getAdminSessionOrNull = cache(async () => {
  const session = await getAdminSession();
  if (!session || session.role !== "admin") return null;
  return session;
});
