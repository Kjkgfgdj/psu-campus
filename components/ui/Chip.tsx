import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  variant?: "default" | "primary" | "secondary";
}

export function Chip({ label, active, onClick, variant = "default" }: ChipProps) {
  const baseClasses =
    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer";
  
  const variantClasses = {
    default: active
      ? "bg-green-600 text-white shadow-md"
      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    primary: active
      ? "bg-green-600 text-white shadow-md"
      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    secondary: active
      ? "bg-slate-900 text-white shadow-md"
      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(baseClasses, variantClasses[variant], active && "scale-105")}
    >
      {label}
    </button>
  );
}

