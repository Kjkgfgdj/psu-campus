import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  centered?: boolean;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  action,
  centered = false,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "space-y-3",
        centered && "text-center",
        className
      )}
    >
      <div className={cn("flex items-center gap-4", centered && "justify-center")}>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
          {title}
        </h1>
        {action && <div className="ml-auto">{action}</div>}
      </div>
      {subtitle && (
        <p className={cn(
          "text-lg text-slate-600 max-w-2xl leading-relaxed",
          centered && "mx-auto"
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

