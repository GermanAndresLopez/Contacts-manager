"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronDown, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CareerWithFaculty, Faculty } from "@/lib/types";

export function FacultyAccordion({
  faculties,
  careers,
  careerCountByFaculty,
  leaderCountByFaculty,
  leaderCountByCareer,
  initialExpandedSlug,
}: {
  faculties: Faculty[];
  careers: CareerWithFaculty[];
  careerCountByFaculty: Map<string, number>;
  leaderCountByFaculty: Map<string, number>;
  leaderCountByCareer: Map<string, number>;
  initialExpandedSlug?: string;
}) {
  const [expanded, setExpanded] = useState<string | null>(initialExpandedSlug ?? null);

  return (
    <div className="divide-y divide-border rounded-xl border border-border bg-card">
      {faculties.map((faculty) => {
        const isOpen = expanded === faculty.slug;
        const facultyCareers = careers.filter((career) => career.faculty_id === faculty.id);

        return (
          <div key={faculty.id}>
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : faculty.slug)}
              aria-expanded={isOpen}
              className="press-feedback flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-muted/60"
            >
              <div className="min-w-0">
                <p className="font-heading text-base font-semibold text-balance">
                  {faculty.name}
                </p>
                <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen className="size-3.5" aria-hidden />
                    {careerCountByFaculty.get(faculty.id) ?? 0}{" "}
                    {(careerCountByFaculty.get(faculty.id) ?? 0) === 1 ? "carrera" : "carreras"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="size-3.5" aria-hidden />
                    {leaderCountByFaculty.get(faculty.id) ?? 0}
                  </span>
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "size-5 shrink-0 text-muted-foreground transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
                aria-hidden
              />
            </button>

            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="grid gap-2 px-5 pb-4 sm:grid-cols-2 lg:grid-cols-3">
                  {facultyCareers.map((career) => (
                    <Link
                      key={career.id}
                      href={`/facultades/${faculty.slug}/${career.slug}`}
                      className="press-feedback flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm transition-colors duration-200 hover:border-primary/40 hover:bg-muted/60"
                    >
                      <span className="min-w-0 truncate font-medium">{career.name}</span>
                      <span className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                        {career.duration_semesters ? (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="size-3.5" aria-hidden />
                            {career.duration_semesters}
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-1">
                          <Users className="size-3.5" aria-hidden />
                          {leaderCountByCareer.get(career.id) ?? 0}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
