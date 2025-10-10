import CategoryChip from "@/components/CategoryChip";

const CHIPS = [
  { slug: "food" as const },
  { slug: "important" as const },
  { slug: "exams" as const },
  { slug: "public" as const },
  { slug: "classroom" as const },
] as const;

export default function HomeTopFilters() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {CHIPS.map(({ slug }) => (
        <CategoryChip key={slug} slug={slug} href={`/search?cat=${slug}`} />
      ))}
    </div>
  );
}


