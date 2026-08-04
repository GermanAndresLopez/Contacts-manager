"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createAdminSession, deleteAdminSession } from "@/lib/session";

const LoginSchema = z.object({
  username: z.string().min(1, "Ingresa el usuario."),
  password: z.string().min(1, "Ingresa la contraseña."),
});

export type LoginState = {
  error?: string;
} | null;

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Usuario y contraseña son obligatorios." };
  }

  const { username, password } = parsed.data;
  const validUsername = process.env.ADMIN_USERNAME ?? "admin";
  const validPassword = process.env.ADMIN_PASSWORD ?? "admin";

  if (username !== validUsername || password !== validPassword) {
    return { error: "Usuario o contraseña incorrectos." };
  }

  await createAdminSession();

  const redirectTo = formData.get("from");
  redirect(
    typeof redirectTo === "string" && redirectTo.startsWith("/admin")
      ? redirectTo
      : "/admin",
  );
}

export async function logout() {
  await deleteAdminSession();
  redirect("/login");
}
