import { Users } from "lucide-react";
import { DirectoryFilters } from "@/components/directory-filters";
import { LeaderCard } from "@/components/leader-card";
import { EmptyState } from "@/components/empty-state";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { getCareers, getFaculties, getLeaders } from "@/lib/data";

export const metadata = { title: "Directorio" };

type SearchParams = Promise<{
  facultad?: string;
  carrera?: string;
  semestre?: string;
  q?: string;
}>;

export default async function DirectorioPage({
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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold">Directorio de líderes</h1>
        <p className="mt-2 text-muted-foreground">
          {leaders.length} {leaders.length === 1 ? "líder encontrado" : "líderes encontrados"}
        </p>
      </div>

      <DirectoryFilters faculties={faculties} careers={careers} />

      <div className="mt-8">
        {leaders.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No se encontraron líderes"
            description="Ajusta los filtros o el término de búsqueda para ver más resultados."
          />
        ) : (
          <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {leaders.map((leader) => (
              <StaggerItem key={leader.id}>
                <LeaderCard leader={leader} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}
      </div>
    </div>
  );
}
