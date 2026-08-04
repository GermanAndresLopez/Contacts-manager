import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SemesterBadge({
  semester,
  className,
}: {
  semester: number;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-accent/30 bg-accent/10 font-medium text-amber-800 dark:text-amber-300",
        className,
      )}
    >
      {semester}° semestre
    </Badge>
  );
}
