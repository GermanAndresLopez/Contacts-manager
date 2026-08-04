"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, LayoutDashboard, LogOut, UserPlus, Users } from "lucide-react";
import { logout } from "@/actions/auth";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard, exact: true },
  { href: "/admin/lideres", label: "Líderes", icon: Users, exact: false },
  { href: "/admin/lideres/nuevo", label: "Registrar", icon: UserPlus, exact: true },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      {NAV_LINKS.map((link) => {
        const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "press-feedback flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop / tablet: vertical sidebar */}
      <aside className="hidden h-dvh w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground sm:sticky sm:top-0 sm:flex">
        <div className="flex h-16 items-center gap-2 px-5">
          <GraduationCap className="size-6 text-sidebar-primary" aria-hidden />
          <span className="font-heading text-lg font-semibold">UPC Líderes</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
          <NavLinks pathname={pathname} />
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <Link
            href="/"
            className="press-feedback flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors duration-200 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
          >
            Ver sitio público
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="press-feedback flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-sidebar-foreground/70 transition-colors duration-200 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
            >
              <LogOut className="size-4" aria-hidden />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile: sticky top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-sidebar-border bg-sidebar px-3 text-sidebar-foreground sm:hidden">
        <GraduationCap className="size-5 shrink-0 text-sidebar-primary" aria-hidden />
        <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
          <NavLinks pathname={pathname} />
        </nav>
        <form action={logout}>
          <button
            type="submit"
            aria-label="Cerrar sesión"
            className="press-feedback flex size-9 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
          >
            <LogOut className="size-4" aria-hidden />
          </button>
        </form>
      </header>
    </>
  );
}
