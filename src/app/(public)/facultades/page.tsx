import { FacultyCard } from "@/components/faculty-card";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { getCareers, getFaculties, getLeaders } from "@/lib/data";

export const metadata = { title: "Facultades" };
export const dynamic = "force-dynamic";

export default async function FacultadesPage() {
  const [faculties, careers, leaders] = await Promise.all([
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
        <h1 className="font-heading text-3xl font-semibold">Facultades</h1>
        <p className="mt-2 text-muted-foreground">
          Explora las carreras y líderes registrados en cada facultad.
        </p>
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
    </div>
  );
}
