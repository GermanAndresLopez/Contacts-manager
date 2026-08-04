import Link from "next/link";
import { IdCard } from "lucide-react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { SemesterBadge } from "@/components/semester-badge";
import { formatDate } from "@/lib/format";
import { formatPhone, toWhatsAppLink } from "@/lib/whatsapp";
import { fullName, type LeaderWithCareer } from "@/lib/types";

function initials(leader: LeaderWithCareer) {
  return `${leader.first_name[0] ?? ""}${leader.last_name[0] ?? ""}`.toUpperCase();
}

export function LeaderCard({ leader }: { leader: LeaderWithCareer }) {
  const faculty = leader.career?.faculty;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center justify-between gap-2 bg-primary px-4 py-2.5 text-primary-foreground">
        <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
          <IdCard className="size-3.5" aria-hidden />
          Líder
        </span>
        <SemesterBadge
          semester={leader.semester}
          className="border-white/30 bg-white/10 text-white"
        />
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-lg font-bold text-primary">
            {initials(leader)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-heading text-base font-semibold leading-tight">
              {fullName(leader)}
            </p>
            <p className="truncate text-sm text-muted-foreground">{leader.career?.name}</p>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2.5 border-t border-dashed border-border pt-3 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Cédula</dt>
            <dd className="font-medium tabular-nums">{leader.cedula}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Nacimiento</dt>
            <dd className="font-medium">{formatDate(leader.birth_date)}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs text-muted-foreground">Lugar de nacimiento</dt>
            <dd className="truncate font-medium">{leader.birth_place}</dd>
          </div>
        </dl>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
          {faculty ? (
            <Link
              href={`/facultades?f=${faculty.slug}`}
              className="press-feedback min-w-0 truncate text-xs text-muted-foreground hover:text-foreground hover:underline"
            >
              {faculty.name}
            </Link>
          ) : (
            <span />
          )}

          {leader.phone ? (
            <a
              href={toWhatsAppLink(leader.phone)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Escribir a ${fullName(leader)} por WhatsApp`}
              className="press-feedback flex shrink-0 items-center gap-1.5 rounded-full bg-[#25D366]/10 px-2.5 py-1 text-xs font-medium text-[#0d8a4f] hover:bg-[#25D366]/20 dark:text-[#25D366]"
            >
              <WhatsAppIcon className="size-3.5" />
              {formatPhone(leader.phone)}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
