import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatTile } from "@/components/stat-tile";
import { SemesterBadge } from "@/components/semester-badge";
import { EmptyState } from "@/components/empty-state";
import { getLeaders, getStats } from "@/lib/data";
import { fullName } from "@/lib/types";

export const metadata = { title: "Panel de administración" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, recentLeaders] = await Promise.all([getStats(), getLeaders()]);
  const latest = recentLeaders.slice(0, 6);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold">Panel de administración</h1>
          <p className="mt-1 text-muted-foreground">
            Registra y gestiona los líderes estudiantiles.
          </p>
        </div>
        <Button render={<Link href="/admin/lideres/nuevo" />} className="press-feedback">
          <UserPlus className="size-4" aria-hidden />
          Registrar líder
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Líderes registrados" value={stats.totalLeaders} icon={Users} />
        <StatTile label="Facultades" value={stats.totalFaculties} icon={GraduationCap} />
        <StatTile label="Carreras" value={stats.totalCareers} icon={BookOpen} />
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-heading text-xl font-semibold">Últimos registrados</h2>
          <Link
            href="/admin/lideres"
            className="press-feedback inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Ver todos
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        {latest.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Todavía no hay líderes registrados"
            description="Usa el botón «Registrar líder» para agregar el primero."
            action={
              <Button
                render={<Link href="/admin/lideres/nuevo" />}
                size="sm"
                className="press-feedback"
              >
                Registrar líder
              </Button>
            }
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {latest.map((leader) => (
              <Card key={leader.id}>
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{fullName(leader)}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {leader.career?.name}
                    </p>
                  </div>
                  <SemesterBadge semester={leader.semester} className="shrink-0" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
