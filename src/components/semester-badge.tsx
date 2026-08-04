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
        "border-accent/30 bg-accent/10 font-medium text-accent dark:text-accent",
        className,
      )}
    >
      {semester}° semestre
    </Badge>
  );
}
