import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  variant?: "default" | "primary" | "secondary";
}

export function Chip({ label, active, onClick, variant = "default" }: ChipProps) {
  const baseClasses =
    "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all cursor-pointer";
  
  const variantClasses = {
    default: active
      ? "bg-green-600 text-white border-transparent"
      : "bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] hover:bg-slate-200",
    primary: active
      ? "bg-green-600 text-white border-transparent"
      : "bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] hover:bg-slate-200",
    secondary: active
      ? "bg-green-600 text-white border-transparent"
      : "bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] hover:bg-slate-200",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(baseClasses, variantClasses[variant])}
    >
      {label}
    </button>
  );
}

