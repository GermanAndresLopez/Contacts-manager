import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SemesterBadge } from "@/components/semester-badge";
import { fullName, type LeaderWithCareer } from "@/lib/types";

function initials(leader: LeaderWithCareer) {
  return `${leader.first_name[0] ?? ""}${leader.last_name[0] ?? ""}`.toUpperCase();
}

export function LeaderCard({ leader }: { leader: LeaderWithCareer }) {
  const faculty = leader.career?.faculty;

  return (
    <Card className="press-feedback h-full transition-shadow duration-200 hover:shadow-md">
      <CardContent className="flex h-full flex-col gap-3 p-5">
        <div className="flex items-start gap-3">
          <div
            aria-hidden
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-base font-semibold text-primary-foreground"
          >
            {initials(leader)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-heading text-base font-semibold leading-tight">
              {fullName(leader)}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {leader.career?.name}
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <SemesterBadge semester={leader.semester} />
          {faculty ? (
            <Link
              href={`/facultades/${faculty.slug}`}
              className="press-feedback inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <GraduationCap className="size-3.5" aria-hidden />
              <span className="max-w-40 truncate">{faculty.name}</span>
            </Link>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
