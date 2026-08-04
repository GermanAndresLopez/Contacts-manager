"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  const [search, setSearch] = useState(searchParams.get("q") ?? "");

  const careersForFaculty = useMemo(() => {
    if (facultySlug === ALL) return careers;
    return careers.filter((career) => career.faculty?.slug === facultySlug);
  }, [careers, facultySlug]);

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

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="relative sm:col-span-2 lg:col-span-1">
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

      <Select
        value={facultySlug}
        onValueChange={(value) => updateParams({ facultad: value, carrera: ALL })}
      >
        <SelectTrigger aria-label="Filtrar por facultad">
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

      <Select value={careerId} onValueChange={(value) => updateParams({ carrera: value })}>
        <SelectTrigger aria-label="Filtrar por carrera">
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

      <Select value={semester} onValueChange={(value) => updateParams({ semestre: value })}>
        <SelectTrigger aria-label="Filtrar por semestre">
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
  );
}
