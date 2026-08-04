import { LeaderForm } from "@/components/admin/leader-form";
import { getCareers, getFaculties } from "@/lib/data";

export const metadata = { title: "Registrar líder" };

export default async function NewLeaderPage() {
  const [faculties, careers] = await Promise.all([getFaculties(), getCareers()]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-semibold">Registrar líder</h1>
        <p className="mt-1 text-muted-foreground">
          Completa los datos del líder y su facultad y carrera.
        </p>
      </div>

      <LeaderForm mode="create" faculties={faculties} careers={careers} />
    </div>
  );
}
