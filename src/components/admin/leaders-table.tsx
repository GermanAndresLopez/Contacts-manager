import Link from "next/link";
import { Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SemesterBadge } from "@/components/semester-badge";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { DeleteLeaderButton } from "@/components/admin/delete-leader-button";
import { formatPhone, toWhatsAppLink } from "@/lib/whatsapp";
import { fullName, type LeaderWithCareer } from "@/lib/types";

function WhatsAppLink({ leader }: { leader: LeaderWithCareer }) {
  if (!leader.phone) return <span className="text-muted-foreground">—</span>;
  return (
    <a
      href={toWhatsAppLink(leader.phone)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Escribir a ${fullName(leader)} por WhatsApp`}
      className="press-feedback inline-flex items-center gap-1.5 whitespace-nowrap text-[#0d8a4f] hover:underline dark:text-[#25D366]"
    >
      <WhatsAppIcon className="size-3.5" />
      {formatPhone(leader.phone)}
    </a>
  );
}

function RowActions({ leader }: { leader: LeaderWithCareer }) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button
        render={<Link href={`/admin/lideres/${leader.id}/editar`} />}
        variant="outline"
        size="icon-sm"
        aria-label={`Editar a ${fullName(leader)}`}
        className="press-feedback"
      >
        <Pencil className="size-4" aria-hidden />
      </Button>
      <DeleteLeaderButton leaderId={leader.id} leaderName={fullName(leader)} />
    </div>
  );
}

export function LeadersTable({ leaders }: { leaders: LeaderWithCareer[] }) {
  return (
    <>
      {/* Mobile: tarjetas apiladas — una tabla ancha no funciona bien en pantallas chicas */}
      <div className="space-y-3 sm:hidden">
        {leaders.map((leader) => (
          <div key={leader.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium">{fullName(leader)}</p>
                <p className="truncate text-sm text-muted-foreground">{leader.career?.name}</p>
              </div>
              <SemesterBadge semester={leader.semester} className="shrink-0" />
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Cédula</dt>
                <dd className="font-medium tabular-nums">{leader.cedula}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Edad</dt>
                <dd className="font-medium tabular-nums">{leader.age}</dd>
              </div>
            </dl>

            <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
              <WhatsAppLink leader={leader} />
              <RowActions leader={leader} />
            </div>
          </div>
        ))}
      </div>

      {/* sm+: tabla completa */}
      <div className="hidden overflow-x-auto rounded-xl border border-border bg-card sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Cédula</TableHead>
              <TableHead>Carrera</TableHead>
              <TableHead>Facultad</TableHead>
              <TableHead>Semestre</TableHead>
              <TableHead>Edad</TableHead>
              <TableHead>Celular</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaders.map((leader) => (
              <TableRow key={leader.id}>
                <TableCell className="font-medium whitespace-nowrap">{fullName(leader)}</TableCell>
                <TableCell className="tabular-nums whitespace-nowrap">{leader.cedula}</TableCell>
                <TableCell className="whitespace-nowrap">{leader.career?.name}</TableCell>
                <TableCell className="max-w-56 truncate">{leader.career?.faculty?.name}</TableCell>
                <TableCell>
                  <SemesterBadge semester={leader.semester} />
                </TableCell>
                <TableCell className="tabular-nums">{leader.age}</TableCell>
                <TableCell>
                  <WhatsAppLink leader={leader} />
                </TableCell>
                <TableCell>
                  <RowActions leader={leader} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
