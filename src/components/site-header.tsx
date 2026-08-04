"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, LayoutGrid, LockKeyhole, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/directorio", label: "Directorio", icon: Users },
  { href: "/facultades", label: "Facultades", icon: LayoutGrid },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="press-feedback flex items-center gap-2 rounded-md font-heading text-lg font-semibold text-primary"
        >
          <GraduationCap className="size-6 shrink-0" aria-hidden />
          <span className="hidden sm:inline">UPC Líderes</span>
          <span className="sm:hidden">UPC</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "press-feedback inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground",
                )}
              >
                {Icon ? <Icon className="size-4" aria-hidden /> : null}
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/login"
            aria-label="Ingreso de administrador"
            className="press-feedback ml-1 inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
          >
            <LockKeyhole className="size-4" aria-hidden />
            <span className="hidden md:inline">Administración</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
