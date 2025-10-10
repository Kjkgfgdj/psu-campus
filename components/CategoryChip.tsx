import Link from "next/link";
import clsx from "clsx";

export type CatSlug = "food" | "important" | "exams" | "public" | "classroom";

export const CAT_STYLES: Record<CatSlug, { label: string; bg: string; text: string; ring: string }> = {
  food:       { label: "Food & drinks",       bg: "bg-green-700",  text: "text-white",     ring: "ring-green-700"  },
  important:  { label: "Important places",    bg: "bg-red-600",    text: "text-white",     ring: "ring-red-600"    },
  exams:      { label: "Popular exam places", bg: "bg-cyan-100",   text: "text-slate-900", ring: "ring-cyan-200"   },
  public:     { label: "Public facilities",   bg: "bg-blue-700",   text: "text-white",     ring: "ring-blue-700"   },
  classroom:  { label: "Classroom",           bg: "bg-amber-400",  text: "text-black",     ring: "ring-amber-400"  },
};

// Loose mapping from Airtable names to our slugs
export function toCatSlug(name: string): CatSlug | null {
  const n = (name || "").toLowerCase();
  if (n.includes("food")) return "food";
  if (n.includes("important")) return "important";
  if (n.includes("exam")) return "exams";
  if (n.includes("public")) return "public";
  if (n.includes("classroom")) return "classroom";
  return null;
}

export default function CategoryChip({
  slug,
  href,
  label,
  size = "md",
  className,
}: {
  slug: CatSlug;
  href?: string;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const s = CAT_STYLES[slug];
  const base = clsx(
    "inline-flex items-center rounded-full ring-1 transition hover:opacity-95 focus:outline-none focus:ring-2",
    s.bg, s.text, s.ring,
    size === "sm" ? "px-3 py-1 text-sm" : "px-4 py-2",
  );
  const node = <span className={clsx(base, className)}>{label ?? s.label}</span>;
  return href ? <Link href={href} aria-label={label ?? s.label}>{node}</Link> : node;
}


