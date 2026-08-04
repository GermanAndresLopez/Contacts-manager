import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatTile } from "@/components/stat-tile";
import { FacultyCard } from "@/components/faculty-card";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { getCareers, getFaculties, getLeaders, getStats } from "@/lib/data";

// Always render fresh: the directory changes whenever an admin registers a
// leader, and Supabase reads aren't wired into Next's fetch cache.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [stats, faculties, careers, leaders] = await Promise.all([
    getStats(),
    getFaculties(),
    getCareers(),
    getLeaders(),
  ]);

  const careerCountByFaculty = new Map<string, number>();
  const leaderCountByFaculty = new Map<string, number>();

  for (const career of careers) {
    careerCountByFaculty.set(
      career.faculty_id,
      (careerCountByFaculty.get(career.faculty_id) ?? 0) + 1,
    );
  }
  for (const leader of leaders) {
    const facultyId = leader.career?.faculty_id;
    if (!facultyId) continue;
    leaderCountByFaculty.set(facultyId, (leaderCountByFaculty.get(facultyId) ?? 0) + 1);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <FadeIn className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-amber-800 dark:text-amber-300">
          <GraduationCap className="size-3.5" aria-hidden />
          Directorio institucional
        </span>
        <h1 className="mt-5 font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Líderes estudiantiles por facultad y carrera
        </h1>
        <p className="mt-4 text-balance text-muted-foreground sm:text-lg">
          Consulta el directorio de líderes registrados en cada programa académico,
          o filtra por facultad, carrera y semestre.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            render={<Link href="/directorio" />}
            size="lg"
            className="press-feedback"
          >
            Ver directorio
            <ArrowRight className="size-4" aria-hidden />
          </Button>
          <Button
            render={<Link href="/facultades" />}
            variant="outline"
            size="lg"
            className="press-feedback"
          >
            Explorar facultades
          </Button>
        </div>
      </FadeIn>

      <FadeIn delay={0.1} className="mt-12 grid gap-4 sm:grid-cols-3">
        <StatTile label="Líderes registrados" value={stats.totalLeaders} icon={Users} />
        <StatTile
          label="Facultades"
          value={stats.totalFaculties}
          icon={GraduationCap}
        />
        <StatTile label="Carreras" value={stats.totalCareers} icon={BookOpen} />
      </FadeIn>

      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-heading text-2xl font-semibold">Facultades</h2>
          <Link
            href="/facultades"
            className="press-feedback inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Ver todas
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {faculties.map((faculty) => (
            <StaggerItem key={faculty.id}>
              <FacultyCard
                name={faculty.name}
                slug={faculty.slug}
                careerCount={careerCountByFaculty.get(faculty.id) ?? 0}
                leaderCount={leaderCountByFaculty.get(faculty.id) ?? 0}
              />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>
    </div>
  );
}
