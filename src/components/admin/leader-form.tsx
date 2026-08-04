"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { createLeader, updateLeader, type LeaderFormState } from "@/actions/leaders";
import { calculateAge } from "@/lib/schemas";
import type { CareerWithFaculty, Faculty, Leader } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SEMESTERS = Array.from({ length: 10 }, (_, i) => i + 1);

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm text-destructive">
      {message}
    </p>
  );
}

export function LeaderForm({
  mode,
  leader,
  faculties,
  careers,
}: {
  mode: "create" | "edit";
  leader?: Leader & { facultySlug?: string };
  faculties: Faculty[];
  careers: CareerWithFaculty[];
}) {
  const action = mode === "create" ? createLeader : updateLeader.bind(null, leader!.id);
  const [state, formAction, pending] = useActionState<LeaderFormState, FormData>(
    action,
    null,
  );

  const [facultySlug, setFacultySlug] = useState(leader?.facultySlug ?? "");
  const [careerId, setCareerId] = useState(leader?.career_id ?? "");
  const [birthDate, setBirthDate] = useState(leader?.birth_date ?? "");

  const careersForFaculty = useMemo(
    () => careers.filter((career) => career.faculty?.slug === facultySlug),
    [careers, facultySlug],
  );

  const previewAge =
    birthDate && !Number.isNaN(Date.parse(birthDate)) ? calculateAge(birthDate) : null;

  const errors = state?.fieldErrors ?? {};

  return (
    <Card className="max-w-3xl">
      <CardContent className="p-6">
        <form action={formAction} className="space-y-8" noValidate>
          <section className="space-y-4">
            <h2 className="font-heading text-lg font-semibold">Datos personales</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="first_name">Primer nombre *</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  defaultValue={leader?.first_name}
                  aria-invalid={Boolean(errors.first_name)}
                  required
                />
                <FieldError message={errors.first_name} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="middle_name">Segundo nombre</Label>
                <Input
                  id="middle_name"
                  name="middle_name"
                  defaultValue={leader?.middle_name ?? ""}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last_name">Primer apellido *</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  defaultValue={leader?.last_name}
                  aria-invalid={Boolean(errors.last_name)}
                  required
                />
                <FieldError message={errors.last_name} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="second_last_name">Segundo apellido</Label>
                <Input
                  id="second_last_name"
                  name="second_last_name"
                  defaultValue={leader?.second_last_name ?? ""}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cedula">Cédula *</Label>
                <Input
                  id="cedula"
                  name="cedula"
                  inputMode="numeric"
                  defaultValue={leader?.cedula}
                  aria-invalid={Boolean(errors.cedula)}
                  required
                />
                <FieldError message={errors.cedula} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="birth_date">Fecha de nacimiento *</Label>
                <Input
                  id="birth_date"
                  name="birth_date"
                  type="date"
                  value={birthDate}
                  onChange={(event) => setBirthDate(event.target.value)}
                  aria-invalid={Boolean(errors.birth_date)}
                  required
                />
                <FieldError message={errors.birth_date} />
                {previewAge !== null ? (
                  <p className="text-sm text-muted-foreground">Edad: {previewAge} años</p>
                ) : null}
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="birth_place">Lugar de nacimiento *</Label>
                <Input
                  id="birth_place"
                  name="birth_place"
                  defaultValue={leader?.birth_place}
                  aria-invalid={Boolean(errors.birth_place)}
                  required
                />
                <FieldError message={errors.birth_place} />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-lg font-semibold">Facultad y carrera</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="faculty">Facultad *</Label>
                <Select
                  value={facultySlug}
                  onValueChange={(value) => {
                    setFacultySlug(value ?? "");
                    setCareerId("");
                  }}
                >
                  <SelectTrigger id="faculty" className="w-full">
                    <SelectValue placeholder="Selecciona una facultad" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.map((faculty) => (
                      <SelectItem key={faculty.id} value={faculty.slug}>
                        {faculty.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="career_id">Carrera *</Label>
                <Select
                  name="career_id"
                  value={careerId}
                  onValueChange={(value) => setCareerId(value ?? "")}
                  disabled={!facultySlug}
                >
                  <SelectTrigger id="career_id" className="w-full" aria-invalid={Boolean(errors.career_id)}>
                    <SelectValue
                      placeholder={facultySlug ? "Selecciona una carrera" : "Elige primero la facultad"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {careersForFaculty.map((career) => (
                      <SelectItem key={career.id} value={career.id}>
                        {career.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.career_id} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="semester">Semestre *</Label>
                <Select name="semester" defaultValue={leader ? String(leader.semester) : undefined}>
                  <SelectTrigger id="semester" className="w-full" aria-invalid={Boolean(errors.semester)}>
                    <SelectValue placeholder="Selecciona el semestre" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMESTERS.map((value) => (
                      <SelectItem key={value} value={String(value)}>
                        {value}° semestre
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.semester} />
              </div>
            </div>
          </section>

          {state?.error ? (
            <p role="alert" className="text-sm font-medium text-destructive">
              {state.error}
            </p>
          ) : null}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={pending} className="press-feedback">
              {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
              {mode === "create" ? "Registrar líder" : "Guardar cambios"}
            </Button>
            <Button
              render={<Link href="/admin/lideres" />}
              type="button"
              variant="ghost"
              className="press-feedback"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
