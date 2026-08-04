import { FacultyAccordion } from "@/components/faculty-accordion";
import { getCareers, getFaculties, getLeaders } from "@/lib/data";

export const metadata = { title: "Facultades" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ f?: string }>;

export default async function FacultadesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { f } = await searchParams;
  const [faculties, careers, leaders] = await Promise.all([
    getFaculties(),
    getCareers(),
    getLeaders(),
  ]);

  const careerCountByFaculty = new Map<string, number>();
  const leaderCountByFaculty = new Map<string, number>();
  const leaderCountByCareer = new Map<string, number>();

  for (const career of careers) {
    careerCountByFaculty.set(
      career.faculty_id,
      (careerCountByFaculty.get(career.faculty_id) ?? 0) + 1,
    );
  }
  for (const leader of leaders) {
    leaderCountByCareer.set(leader.career_id, (leaderCountByCareer.get(leader.career_id) ?? 0) + 1);
    const facultyId = leader.career?.faculty_id;
    if (!facultyId) continue;
    leaderCountByFaculty.set(facultyId, (leaderCountByFaculty.get(facultyId) ?? 0) + 1);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold">Facultades</h1>
        <p className="mt-2 text-muted-foreground">
          Abre una facultad para ver sus carreras.
        </p>
      </div>

      <FacultyAccordion
        faculties={faculties}
        careers={careers}
        careerCountByFaculty={careerCountByFaculty}
        leaderCountByFaculty={leaderCountByFaculty}
        leaderCountByCareer={leaderCountByCareer}
        initialExpandedSlug={f}
      />
    </div>
  );
}
