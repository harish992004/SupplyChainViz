import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  valueClassName?: string;
  large?: boolean;
}

export default function KPICard({ title, value, valueClassName, large = false }: KPICardProps) {
  return (
    <div className={cn(
      "p-4 bg-primary rounded-lg", 
      large && "p-6"
    )}>
      <div className="text-sm text-gray-400 mb-1">{title}</div>
      <div className={cn(
        "font-semibold text-white",
        large ? "text-3xl" : "text-2xl",
        valueClassName
      )}>
        {value}
      </div>
    </div>
  );
}
