import { notFound } from "next/navigation";
import { LeaderForm } from "@/components/admin/leader-form";
import { getCareers, getFaculties, getLeaderById } from "@/lib/data";
import { fullName } from "@/lib/types";

export const metadata = { title: "Editar líder" };

type Params = Promise<{ id: string }>;

export default async function EditLeaderPage({ params }: { params: Params }) {
  const { id } = await params;
  const [leader, faculties, careers] = await Promise.all([
    getLeaderById(id),
    getFaculties(),
    getCareers(),
  ]);

  if (!leader) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-semibold">Editar líder</h1>
        <p className="mt-1 text-muted-foreground">{fullName(leader)}</p>
      </div>

      <LeaderForm
        mode="edit"
        leader={{ ...leader, facultySlug: leader.career?.faculty?.slug }}
        faculties={faculties}
        careers={careers}
      />
    </div>
  );
}
