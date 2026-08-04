import { notFound } from "next/navigation";
import { CareerCard } from "@/components/career-card";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { getCareersByFacultySlug, getFacultyBySlug, getLeaders } from "@/lib/data";

type Params = Promise<{ facultad: string }>;

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Params }) {
  const { facultad } = await params;
  const faculty = await getFacultyBySlug(facultad);
  return { title: faculty?.name ?? "Facultad" };
}

export default async function FacultyPage({ params }: { params: Params }) {
  const { facultad } = await params;
  const faculty = await getFacultyBySlug(facultad);
  if (!faculty) notFound();

  const [careers, leaders] = await Promise.all([
    getCareersByFacultySlug(facultad),
    getLeaders({ facultySlug: facultad }),
  ]);

  const leaderCountByCareer = new Map<string, number>();
  for (const leader of leaders) {
    leaderCountByCareer.set(leader.career_id, (leaderCountByCareer.get(leader.career_id) ?? 0) + 1);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Facultad</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold text-balance">
          {faculty.name}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {careers.length} {careers.length === 1 ? "carrera" : "carreras"} · {leaders.length}{" "}
          {leaders.length === 1 ? "líder registrado" : "líderes registrados"}
        </p>
      </div>

      <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {careers.map((career) => (
          <StaggerItem key={career.id}>
            <CareerCard
              career={career}
              facultySlug={faculty.slug}
              leaderCount={leaderCountByCareer.get(career.id) ?? 0}
            />
          </StaggerItem>
        ))}
      </StaggerGrid>
    </div>
  );
}
