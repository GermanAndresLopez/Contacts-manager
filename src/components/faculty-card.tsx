import Link from "next/link";
import { ArrowRight, BookOpen, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function FacultyCard({
  name,
  slug,
  careerCount,
  leaderCount,
}: {
  name: string;
  slug: string;
  careerCount: number;
  leaderCount: number;
}) {
  return (
    <Link href={`/facultades?f=${slug}`} className="press-feedback block h-full">
      <Card className="h-full transition-shadow duration-200 hover:shadow-md">
        <CardContent className="flex h-full flex-col gap-4 p-5">
          <p className="font-heading text-lg font-semibold leading-snug">{name}</p>

          <div className="mt-auto flex items-center justify-between gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="size-4" aria-hidden />
                {careerCount} {careerCount === 1 ? "carrera" : "carreras"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-4" aria-hidden />
                {leaderCount} {leaderCount === 1 ? "líder" : "líderes"}
              </span>
            </div>
            <ArrowRight className="size-4 shrink-0 text-primary" aria-hidden />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
