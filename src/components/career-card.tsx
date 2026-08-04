import Link from "next/link";
import { ArrowRight, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Career } from "@/lib/types";

export function CareerCard({
  career,
  facultySlug,
  leaderCount,
}: {
  career: Career;
  facultySlug: string;
  leaderCount: number;
}) {
  return (
    <Link
      href={`/facultades/${facultySlug}/${career.slug}`}
      className="press-feedback block h-full"
    >
      <Card className="h-full transition-shadow duration-200 hover:shadow-md">
        <CardContent className="flex h-full flex-col gap-3 p-5">
          <div>
            <p className="font-heading text-lg font-semibold leading-snug">
              {career.name}
            </p>
            {career.degree_title ? (
              <p className="mt-1 text-sm text-muted-foreground">{career.degree_title}</p>
            ) : null}
          </div>

          <div className="mt-auto flex items-center justify-between gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              {career.duration_semesters ? (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4" aria-hidden />
                  {career.duration_semesters} semestres
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-4" aria-hidden />
                {leaderCount}
              </span>
            </div>
            <ArrowRight className="size-4 shrink-0 text-primary" aria-hidden />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
