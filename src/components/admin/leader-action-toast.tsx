"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";

export function LeaderActionToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const registrado = searchParams.get("registrado");
    const actualizado = searchParams.get("actualizado");
    if (!registrado && !actualizado) return;

    if (registrado) toast.success("Líder registrado correctamente.");
    if (actualizado) toast.success("Cambios guardados correctamente.");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("registrado");
    params.delete("actualizado");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
