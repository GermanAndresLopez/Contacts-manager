import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";

export const metadata = { title: "Ingreso de administrador" };

type SearchParams = Promise<{ from?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const { from } = await searchParams;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-muted/40 px-4 py-12">
      <Link
        href="/"
        className="press-feedback mb-8 flex items-center gap-2 font-heading text-xl font-semibold text-primary"
      >
        <GraduationCap className="size-7" aria-hidden />
        UPC Líderes
      </Link>

      <LoginForm redirectTo={from} />

      <Link
        href="/"
        className="press-feedback mt-6 text-sm text-muted-foreground hover:text-foreground hover:underline"
      >
        Volver al sitio público
      </Link>
    </div>
  );
}
