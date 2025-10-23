import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  variant?: "default" | "primary" | "secondary";
}

export function Chip({ label, active, onClick, variant = "default" }: ChipProps) {
  const baseClasses =
    "relative inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all duration-300 cursor-pointer";
  
  const variantClasses = {
    default: active
      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-600/30 scale-105 ring-2 ring-green-600/20"
      : "bg-white text-slate-700 border-2 border-slate-200 hover:border-green-300 hover:bg-gradient-to-br hover:from-slate-50 hover:to-green-50/30 hover:text-slate-900 hover:shadow-md",
    primary: active
      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-600/30 scale-105 ring-2 ring-green-600/20"
      : "bg-white text-slate-700 border-2 border-slate-200 hover:border-green-300 hover:bg-gradient-to-br hover:from-slate-50 hover:to-green-50/30 hover:text-slate-900 hover:shadow-md",
    secondary: active
      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-600/30 scale-105 ring-2 ring-green-600/20"
      : "bg-white text-slate-700 border-2 border-slate-200 hover:border-green-300 hover:bg-gradient-to-br hover:from-slate-50 hover:to-green-50/30 hover:text-slate-900 hover:shadow-md",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(baseClasses, variantClasses[variant])}
    >
      {active && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-50"></div>
      )}
      <span className="relative">{label}</span>
    </button>
  );
}

