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
import { DeleteLeaderButton } from "@/components/admin/delete-leader-button";
import { fullName, type LeaderWithCareer } from "@/lib/types";

export function LeadersTable({ leaders }: { leaders: LeaderWithCareer[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Cédula</TableHead>
            <TableHead>Carrera</TableHead>
            <TableHead>Facultad</TableHead>
            <TableHead>Semestre</TableHead>
            <TableHead>Edad</TableHead>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
