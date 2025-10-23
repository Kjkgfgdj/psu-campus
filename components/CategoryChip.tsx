import Link from "next/link";
import clsx from "clsx";
import type { UrlObject } from "url";

export type CatSlug = "food" | "important" | "exam" | "public" | "classroom";

export const CAT_STYLES: Record<CatSlug, { label: string; bg: string; text: string; ring: string }> = {
  food:       { label: "Food & drinks",       bg: "bg-green-50",  text: "text-green-700",  ring: "ring-green-200"  },
  important:  { label: "Important places",    bg: "bg-red-50",    text: "text-red-700",    ring: "ring-red-200"    },
  exam:       { label: "Popular exam places", bg: "bg-amber-50",  text: "text-amber-700",  ring: "ring-amber-200"  },
  public:     { label: "Public facilities",   bg: "bg-red-50",    text: "text-red-700",    ring: "ring-red-200"    },
  classroom:  { label: "Classroom",           bg: "bg-gray-50",   text: "text-gray-700",   ring: "ring-gray-200"   },
};

// Loose mapping from Airtable names to our slugs
export function toCatSlug(name: string): CatSlug | null {
  const n = (name || "").toLowerCase();
  if (n.includes("food")) return "food";
  if (n.includes("important")) return "important";
  if (n.includes("exam")) return "exam";
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
  href?: string | UrlObject;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const s = CAT_STYLES[slug];
  const base = clsx(
    "inline-flex items-center rounded-lg ring-1 transition hover:opacity-95 focus:outline-none focus:ring-2",
    s.bg, s.text, s.ring,
    size === "sm" ? "px-2.5 py-1 text-xs font-semibold" : "px-4 py-2",
  );
  const node = <span className={clsx(base, className)}>{label ?? s.label}</span>;
  return href ? <Link href={href} aria-label={label ?? s.label}>{node}</Link> : node;
}


