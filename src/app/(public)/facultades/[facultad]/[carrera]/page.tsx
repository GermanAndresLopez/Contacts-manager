import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LeaderCard } from "@/components/leader-card";
import { EmptyState } from "@/components/empty-state";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { getCareerBySlug, getLeaders } from "@/lib/data";

type Params = Promise<{ facultad: string; carrera: string }>;

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Params }) {
  const { facultad, carrera } = await params;
  const career = await getCareerBySlug(facultad, carrera);
  return { title: career?.name ?? "Carrera" };
}

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function CareerPage({ params }: { params: Params }) {
  const { facultad, carrera } = await params;
  const career = await getCareerBySlug(facultad, carrera);
  if (!career) notFound();

  const leaders = await getLeaders({ careerId: career.id });

  const allInfoItems: Array<[string, string | number | null]> = [
    ["Título otorgado", career.degree_title],
    ["Nivel de programa", career.level],
    ["Duración", career.duration_semesters ? `${career.duration_semesters} semestres` : null],
    ["Créditos", career.credits],
    ["Metodología", career.methodology],
    ["Jornada", career.schedule],
    ["Tipo de resolución", career.resolution_type],
    ["No. resolución de aprobación", career.resolution_number],
    ["No. resolución de acreditación", career.accreditation_number],
    ["Fecha de aprobación", formatDate(career.approval_date)],
    ["Ubicación", career.location],
  ];
  const infoItems = allInfoItems.filter(
    ([, value]) => value !== null && value !== undefined && value !== "",
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/facultades" className="press-feedback hover:text-foreground hover:underline">
          Facultades
        </Link>
        <ChevronRight className="size-3.5" aria-hidden />
        <Link
          href={`/facultades/${facultad}`}
          className="press-feedback hover:text-foreground hover:underline"
        >
          {career.faculty?.name}
        </Link>
        <ChevronRight className="size-3.5" aria-hidden />
        <span className="text-foreground">{career.name}</span>
      </nav>

      <h1 className="font-heading text-3xl font-semibold text-balance">{career.name}</h1>
      <p className="mt-2 text-muted-foreground">
        {leaders.length} {leaders.length === 1 ? "líder registrado" : "líderes registrados"}
      </p>

      <Card className="mt-6">
        <CardContent className="p-5">
          <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {infoItems.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {label}
                </dt>
                <dd className="mt-0.5 text-sm font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <section className="mt-10">
        <h2 className="mb-4 font-heading text-xl font-semibold">Líderes de la carrera</h2>
        {leaders.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Aún no hay líderes registrados"
            description="Cuando el administrador registre líderes de esta carrera, aparecerán aquí."
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
      </section>
    </div>
  );
}
