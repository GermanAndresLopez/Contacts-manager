"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { IdCard, Loader2 } from "lucide-react";
import { createLeader, updateLeader, type LeaderFormState } from "@/actions/leaders";
import { calculateAge } from "@/lib/schemas";
import type { CareerWithFaculty, Faculty, Leader } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
const SEMESTER_ITEMS = SEMESTERS.map((value) => ({
  value: String(value),
  label: `${value}° semestre`,
}));

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm text-destructive">
      {message}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-heading text-sm font-semibold tracking-wide text-muted-foreground uppercase">
      {children}
    </h2>
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

  const facultyItems = useMemo(
    () => faculties.map((faculty) => ({ value: faculty.slug, label: faculty.name })),
    [faculties],
  );

  const careersForFaculty = useMemo(
    () => careers.filter((career) => career.faculty?.slug === facultySlug),
    [careers, facultySlug],
  );

  const careerItems = useMemo(
    () => careersForFaculty.map((career) => ({ value: career.id, label: career.name })),
    [careersForFaculty],
  );

  const selectedCareer = careersForFaculty.find((career) => career.id === careerId);

  const previewAge =
    birthDate && !Number.isNaN(Date.parse(birthDate)) ? calculateAge(birthDate) : null;

  const errors = state?.fieldErrors ?? {};

  return (
    <Card className="max-w-3xl">
      <CardHeader className="border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <IdCard className="size-5" aria-hidden />
          </div>
          <div>
            <CardTitle className="font-heading text-lg">
              {mode === "create" ? "Registrar líder" : "Editar líder"}
            </CardTitle>
            <CardDescription>Los campos marcados con * son obligatorios.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form action={formAction} className="space-y-8" noValidate>
          <section className="space-y-4">
            <SectionTitle>Nombre completo</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="first_name">Primer nombre *</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  autoFocus
                  autoComplete="off"
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
                  autoComplete="off"
                  defaultValue={leader?.middle_name ?? ""}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last_name">Primer apellido *</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  autoComplete="off"
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
                  autoComplete="off"
                  defaultValue={leader?.second_last_name ?? ""}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <SectionTitle>Identificación y contacto</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="cedula">Cédula *</Label>
                <Input
                  id="cedula"
                  name="cedula"
                  inputMode="numeric"
                  autoComplete="off"
                  defaultValue={leader?.cedula}
                  aria-invalid={Boolean(errors.cedula)}
                  required
                />
                <FieldError message={errors.cedula} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Celular *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="3001234567"
                  defaultValue={leader?.phone ?? ""}
                  aria-invalid={Boolean(errors.phone)}
                  required
                />
                <FieldError message={errors.phone} />
                <p className="text-sm text-muted-foreground">
                  Se usa para el botón de WhatsApp en su tarjeta.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <SectionTitle>Nacimiento</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
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
              <div className="space-y-1.5">
                <Label htmlFor="birth_place">Lugar de nacimiento *</Label>
                <Input
                  id="birth_place"
                  name="birth_place"
                  autoComplete="off"
                  defaultValue={leader?.birth_place}
                  aria-invalid={Boolean(errors.birth_place)}
                  required
                />
                <FieldError message={errors.birth_place} />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <SectionTitle>Facultad y carrera</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="faculty">Facultad *</Label>
                <Select
                  items={facultyItems}
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
                  items={careerItems}
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
                {selectedCareer?.duration_semesters ? (
                  <p className="text-sm text-muted-foreground">
                    {selectedCareer.duration_semesters} semestres · {selectedCareer.degree_title}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="semester">Semestre *</Label>
                <Select
                  items={SEMESTER_ITEMS}
                  name="semester"
                  defaultValue={leader ? String(leader.semester) : undefined}
                >
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

          <div className="flex items-center gap-3 border-t border-border pt-6">
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
