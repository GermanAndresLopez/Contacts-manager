"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Loader2 } from "lucide-react";
import { login, type LoginState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <LockKeyhole className="size-5" aria-hidden />
        </div>
        <CardTitle className="mt-2 font-heading text-xl">Ingreso de administrador</CardTitle>
        <CardDescription>Registra y gestiona los líderes estudiantiles.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4" noValidate>
          {redirectTo ? <input type="hidden" name="from" value={redirectTo} /> : null}

          <div className="space-y-1.5">
            <Label htmlFor="username">Usuario</Label>
            <Input
              id="username"
              name="username"
              autoComplete="username"
              placeholder="admin"
              required
              aria-invalid={Boolean(state?.error)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••"
                required
                aria-invalid={Boolean(state?.error)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="press-feedback absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden />
                ) : (
                  <Eye className="size-4" aria-hidden />
                )}
              </button>
            </div>
          </div>

          {state?.error ? (
            <p role="alert" className="text-sm font-medium text-destructive">
              {state.error}
            </p>
          ) : null}

          <Button type="submit" disabled={pending} className="press-feedback w-full">
            {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            Ingresar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
