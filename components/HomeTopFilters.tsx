import Link from "next/link";

const CHIPS = [
  // Food & drinks — solid green
  { label: "Food & drinks",       slug: "food",       bg: "bg-green-700", text: "text-white",     ring: "ring-green-700" },

  // Important places — solid red
  { label: "Important places",    slug: "important",  bg: "bg-red-600",   text: "text-white",     ring: "ring-red-600" },

  // Popular exam places — light aqua (pale)
  { label: "Popular exam places", slug: "exam",       bg: "bg-cyan-100",  text: "text-slate-900", ring: "ring-cyan-200" },

  // Public facilities — solid blue
  { label: "Public facilities",   slug: "public",     bg: "bg-blue-700",  text: "text-white",     ring: "ring-blue-700" },

  // Classroom — amber/yellow
  { label: "Classroom",           slug: "classroom",  bg: "bg-amber-400", text: "text-black",     ring: "ring-amber-400" },
] as const;

export default function HomeTopFilters() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {CHIPS.map((c) => (
        <Link
          key={c.slug}
          href={`/search?cat=${c.slug}`}
          className={[
            "inline-flex items-center rounded-full px-4 py-2 ring-1 transition",
            "hover:opacity-95 focus:outline-none focus:ring-2",
            c.bg, c.text, c.ring,
          ].join(" ")}
          aria-label={c.label}
        >
          {c.label}
        </Link>
      ))}
    </div>
  );
}


