"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Home, LayoutGrid, LockKeyhole, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Inicio", icon: Home, exact: true },
  { href: "/directorio", label: "Directorio", icon: Users, exact: false },
  { href: "/facultades", label: "Facultades", icon: LayoutGrid, exact: false },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md supports-backdrop-filter:bg-background/75">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-4 sm:px-6">
        <Link
          href="/"
          aria-label="UPC Líderes — inicio"
          className="press-feedback flex shrink-0 items-center gap-2 rounded-md font-heading text-lg font-semibold text-primary"
        >
          <GraduationCap className="size-6 shrink-0" aria-hidden />
          <span className="hidden sm:inline">UPC Líderes</span>
        </Link>

        <nav className="flex items-center gap-0.5 sm:gap-1.5">
          {NAV_LINKS.map((link) => {
            const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-label={link.label}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "press-feedback inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium transition-colors duration-200 sm:px-3",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}

          <Link
            href="/login"
            aria-label="Ingreso de administrador"
            className="press-feedback ml-0.5 inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-2.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground sm:ml-1 sm:px-3"
          >
            <LockKeyhole className="size-4 shrink-0" aria-hidden />
            <span className="hidden md:inline">Administración</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
