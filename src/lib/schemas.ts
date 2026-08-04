import { z } from "zod";

export const LeaderSchema = z.object({
  first_name: z.string().trim().min(1, "El primer nombre es obligatorio."),
  middle_name: z.string().trim().optional().or(z.literal("")),
  last_name: z.string().trim().min(1, "El primer apellido es obligatorio."),
  second_last_name: z.string().trim().optional().or(z.literal("")),
  cedula: z
    .string()
    .trim()
    .min(5, "La cédula debe tener al menos 5 dígitos.")
    .regex(/^[0-9]+$/, "La cédula solo debe contener números."),
  birth_date: z
    .string()
    .min(1, "La fecha de nacimiento es obligatoria.")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Fecha de nacimiento inválida.",
    }),
  birth_place: z.string().trim().min(1, "El lugar de nacimiento es obligatorio."),
  phone: z
    .string()
    .trim()
    .min(7, "Ingresa un número de celular válido.")
    .regex(/^[0-9]+$/, "El celular solo debe contener números."),
  semester: z.coerce
    .number()
    .int()
    .min(1, "El semestre debe estar entre 1 y 10.")
    .max(10, "El semestre debe estar entre 1 y 10."),
  career_id: z.string().uuid("Selecciona una carrera."),
});

export type LeaderInput = z.infer<typeof LeaderSchema>;

export function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}
