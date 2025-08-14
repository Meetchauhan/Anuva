import { cn, getRiskLevelColor, getRiskLevelText } from "@/lib/utils";

interface RecoveryBadgeProps {
  status: 'critical' | 'recovering' | 'stable' | 'waiting';
  className?: string;
}

export function RecoveryBadge({ status, className }: RecoveryBadgeProps) {
  const baseClasses = "px-2 py-0.5 rounded-full text-xs";
  const colorClasses = `${getRiskLevelColor(status)} bg-opacity-20`;
  
  return (
    <span className={cn(baseClasses, colorClasses, className)}>
      {getRiskLevelText(status)}
    </span>
  );
}
