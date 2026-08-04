"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/dal";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { LeaderSchema, calculateAge } from "@/lib/schemas";

export type LeaderFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
} | null;

function revalidateLeaderPaths() {
  revalidatePath("/");
  revalidatePath("/directorio");
  revalidatePath("/facultades");
  revalidatePath("/admin");
  revalidatePath("/admin/lideres");
}

function parseLeaderForm(formData: FormData) {
  const parsed = LeaderSchema.safeParse({
    first_name: formData.get("first_name"),
    middle_name: formData.get("middle_name"),
    last_name: formData.get("last_name"),
    second_last_name: formData.get("second_last_name"),
    cedula: formData.get("cedula"),
    birth_date: formData.get("birth_date"),
    birth_place: formData.get("birth_place"),
    phone: formData.get("phone"),
    semester: formData.get("semester"),
    career_id: formData.get("career_id"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { success: false as const, fieldErrors };
  }

  return { success: true as const, data: parsed.data };
}

export async function createLeader(
  _prevState: LeaderFormState,
  formData: FormData,
): Promise<LeaderFormState> {
  await verifyAdminSession();

  const result = parseLeaderForm(formData);
  if (!result.success) {
    return { error: "Revisa los campos marcados.", fieldErrors: result.fieldErrors };
  }

  const { data } = result;
  const supabaseAdmin = getSupabaseAdmin();

  const { error } = await supabaseAdmin.from("leaders").insert({
    first_name: data.first_name,
    middle_name: data.middle_name || null,
    last_name: data.last_name,
    second_last_name: data.second_last_name || null,
    cedula: data.cedula,
    birth_date: data.birth_date,
    birth_place: data.birth_place,
    age: calculateAge(data.birth_date),
    semester: data.semester,
    career_id: data.career_id,
    phone: data.phone,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        error: "Ya existe un líder registrado con esa cédula.",
        fieldErrors: { cedula: "Cédula duplicada." },
      };
    }
    return { error: "No se pudo registrar el líder. Intenta de nuevo." };
  }

  revalidateLeaderPaths();
  redirect("/admin/lideres?registrado=1");
}

export async function updateLeader(
  leaderId: string,
  _prevState: LeaderFormState,
  formData: FormData,
): Promise<LeaderFormState> {
  await verifyAdminSession();

  const result = parseLeaderForm(formData);
  if (!result.success) {
    return { error: "Revisa los campos marcados.", fieldErrors: result.fieldErrors };
  }

  const { data } = result;
  const supabaseAdmin = getSupabaseAdmin();

  const { error } = await supabaseAdmin
    .from("leaders")
    .update({
      first_name: data.first_name,
      middle_name: data.middle_name || null,
      last_name: data.last_name,
      second_last_name: data.second_last_name || null,
      cedula: data.cedula,
      birth_date: data.birth_date,
      birth_place: data.birth_place,
      age: calculateAge(data.birth_date),
      semester: data.semester,
      career_id: data.career_id,
      phone: data.phone,
    })
    .eq("id", leaderId);

  if (error) {
    if (error.code === "23505") {
      return {
        error: "Ya existe un líder registrado con esa cédula.",
        fieldErrors: { cedula: "Cédula duplicada." },
      };
    }
    return { error: "No se pudo actualizar el líder. Intenta de nuevo." };
  }

  revalidateLeaderPaths();
  redirect("/admin/lideres?actualizado=1");
}

export async function deleteLeader(leaderId: string) {
  await verifyAdminSession();

  const supabaseAdmin = getSupabaseAdmin();
  const { error } = await supabaseAdmin.from("leaders").delete().eq("id", leaderId);

  if (error) {
    throw new Error("No se pudo eliminar el líder.");
  }

  revalidateLeaderPaths();
}
