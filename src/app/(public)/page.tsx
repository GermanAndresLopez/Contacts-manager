import { BookOpen, GraduationCap, Users } from "lucide-react";
import { StatTile } from "@/components/stat-tile";
import { FacultyCard } from "@/components/faculty-card";
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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold">Líderes</h1>
        <p className="mt-2 text-muted-foreground">
          {stats.totalLeaders} registrados en {stats.totalFaculties} facultades
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Líderes" value={stats.totalLeaders} icon={Users} />
        <StatTile label="Facultades" value={stats.totalFaculties} icon={GraduationCap} />
        <StatTile label="Carreras" value={stats.totalCareers} icon={BookOpen} />
      </div>

      <section className="mt-10">
        <h2 className="mb-4 font-heading text-xl font-semibold">Facultades</h2>
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
