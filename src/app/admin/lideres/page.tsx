import Link from "next/link";
import { UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DirectoryFilters } from "@/components/directory-filters";
import { LeadersTable } from "@/components/admin/leaders-table";
import { LeaderActionToast } from "@/components/admin/leader-action-toast";
import { EmptyState } from "@/components/empty-state";
import { getCareers, getFaculties, getLeaders } from "@/lib/data";

export const metadata = { title: "Líderes" };

type SearchParams = Promise<{
  facultad?: string;
  carrera?: string;
  semestre?: string;
  q?: string;
}>;

export default async function AdminLeadersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const semester = params.semestre ? Number(params.semestre) : undefined;

  const [faculties, careers, leaders] = await Promise.all([
    getFaculties(),
    getCareers(),
    getLeaders({
      facultySlug: params.facultad,
      careerId: params.carrera,
      semester: Number.isFinite(semester) ? semester : undefined,
      search: params.q,
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl">
      <LeaderActionToast />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold">Líderes</h1>
          <p className="mt-1 text-muted-foreground">
            {leaders.length} {leaders.length === 1 ? "líder registrado" : "líderes registrados"}
          </p>
        </div>
        <Button render={<Link href="/admin/lideres/nuevo" />} className="press-feedback">
          <UserPlus className="size-4" aria-hidden />
          Registrar líder
        </Button>
      </div>

      <DirectoryFilters faculties={faculties} careers={careers} />

      <div className="mt-6">
        {leaders.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No se encontraron líderes"
            description="Ajusta los filtros o registra un nuevo líder."
          />
        ) : (
          <LeadersTable leaders={leaders} />
        )}
      </div>
    </div>
  );
}
