"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CareerWithFaculty, Faculty } from "@/lib/types";

const SEMESTERS = Array.from({ length: 10 }, (_, i) => i + 1);
const ALL = "todos";
const SEMESTER_ITEMS = [
  { value: ALL, label: "Todos los semestres" },
  ...SEMESTERS.map((value) => ({ value: String(value), label: `${value}° semestre` })),
];

export function DirectoryFilters({
  faculties,
  careers,
}: {
  faculties: Faculty[];
  careers: CareerWithFaculty[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const facultySlug = searchParams.get("facultad") ?? ALL;
  const careerId = searchParams.get("carrera") ?? ALL;
  const semester = searchParams.get("semestre") ?? ALL;
  const activeQuery = searchParams.get("q") ?? "";
  const [search, setSearch] = useState(activeQuery);

  const careersForFaculty = useMemo(() => {
    if (facultySlug === ALL) return careers;
    return careers.filter((career) => career.faculty?.slug === facultySlug);
  }, [careers, facultySlug]);

  const facultyItems = useMemo(
    () => [
      { value: ALL, label: "Todas las facultades" },
      ...faculties.map((faculty) => ({ value: faculty.slug, label: faculty.name })),
    ],
    [faculties],
  );

  const careerItems = useMemo(
    () => [
      { value: ALL, label: "Todas las carreras" },
      ...careersForFaculty.map((career) => ({ value: career.id, label: career.name })),
    ],
    [careersForFaculty],
  );

  function updateParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (!value || value === ALL) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  // Debounce the free-text search so we don't push a route change per keystroke.
  useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (search === current) return;
    const timeout = setTimeout(() => updateParams({ q: search }), 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const facultyLabel = faculties.find((f) => f.slug === facultySlug)?.name;
  const careerLabel = careers.find((c) => c.id === careerId)?.name;

  const chips = [
    activeQuery
      ? { key: "q", label: `“${activeQuery}”`, onClear: () => setSearch("") }
      : null,
    facultySlug !== ALL && facultyLabel
      ? { key: "facultad", label: facultyLabel, onClear: () => updateParams({ facultad: null }) }
      : null,
    careerId !== ALL && careerLabel
      ? { key: "carrera", label: careerLabel, onClear: () => updateParams({ carrera: null }) }
      : null,
    semester !== ALL
      ? { key: "semestre", label: `${semester}° semestre`, onClear: () => updateParams({ semestre: null }) }
      : null,
  ].filter((chip): chip is { key: string; label: string; onClear: () => void } => chip !== null);

  function clearAll() {
    setSearch("");
    updateParams({ q: null, facultad: null, carrera: null, semestre: null });
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:gap-3">
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre..."
            aria-label="Buscar líder por nombre"
            className="pl-9"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 sm:contents">
          <Select
            items={facultyItems}
            value={facultySlug}
            onValueChange={(value) => updateParams({ facultad: value, carrera: ALL })}
          >
            <SelectTrigger aria-label="Filtrar por facultad" className="w-full">
              <SelectValue placeholder="Facultad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todas las facultades</SelectItem>
              {faculties.map((faculty) => (
                <SelectItem key={faculty.id} value={faculty.slug}>
                  {faculty.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            items={careerItems}
            value={careerId}
            onValueChange={(value) => updateParams({ carrera: value })}
          >
            <SelectTrigger aria-label="Filtrar por carrera" className="w-full">
              <SelectValue placeholder="Carrera" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todas las carreras</SelectItem>
              {careersForFaculty.map((career) => (
                <SelectItem key={career.id} value={career.id}>
                  {career.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            items={SEMESTER_ITEMS}
            value={semester}
            onValueChange={(value) => updateParams({ semestre: value })}
          >
            <SelectTrigger aria-label="Filtrar por semestre" className="w-full">
              <SelectValue placeholder="Semestre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos los semestres</SelectItem>
              {SEMESTERS.map((value) => (
                <SelectItem key={value} value={String(value)}>
                  {value}° semestre
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {chips.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.onClear}
              className="press-feedback inline-flex max-w-full items-center gap-1 rounded-full border border-border bg-secondary py-1 pr-1.5 pl-2.5 text-xs font-medium text-secondary-foreground transition-colors duration-200 hover:bg-muted"
            >
              <span className="truncate">{chip.label}</span>
              <X className="size-3.5 shrink-0" aria-hidden />
            </button>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="press-feedback h-7 px-2 text-xs text-muted-foreground"
          >
            Limpiar todo
          </Button>
        </div>
      ) : null}
    </div>
  );
}
