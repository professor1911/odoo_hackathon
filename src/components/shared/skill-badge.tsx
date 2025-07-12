import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SkillBadgeProps {
  skill: string;
  className?: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export function SkillBadge({ skill, className, variant = "secondary" }: SkillBadgeProps) {
  return (
    <Badge variant={variant} className={cn("font-normal", className)}>
      {skill}
    </Badge>
  );
}
