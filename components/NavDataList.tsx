import Link from "next/link";
import { cache } from "react";
import { getFoodAndDrinks, getPopularExamPlaces, type Place } from "@/lib/airtable";
import { badgeClasses } from "@/lib/categories";
import { cn } from "@/lib/utils";

type NavKind = "exam" | "food";

type NavDataListProps = {
  kind: NavKind;
  limit?: number;
  className?: string;
};

const loadPopularExam = cache(getPopularExamPlaces);
const loadFoodPlaces = cache(getFoodAndDrinks);

const LABELS: Record<NavKind, { empty: string; href: (place: Place) => string; seeAll: string; seeAllHref: string }> = {
  exam: {
    empty: "No popular exam places yet.",
    href: (place) => `/buildings/${place.building}?floor=${place.floor}&cat=exam${place.slug ? `&slug=${place.slug}` : ""}`,
    seeAll: "See all →",
    seeAllHref: "/search?cat=exam",
  },
  food: {
    empty: "No food & drinks yet.",
    href: (place) => `/buildings/${place.building}?floor=${place.floor}&cat=food${place.slug ? `&slug=${place.slug}` : ""}`,
    seeAll: "See all →",
    seeAllHref: "/search?cat=food",
  },
};

const CATEGORY_LABEL: Record<NavKind, string> = {
  exam: "Popular exam places",
  food: "Food & drinks",
};

export async function NavDataList({ kind, limit = 8, className }: NavDataListProps) {
  const loader = kind === "exam" ? loadPopularExam : loadFoodPlaces;
  const places = await loader();
  const items = places
    .slice()
    .sort((a, b) => {
      if (a.building === b.building) {
        return a.name.localeCompare(b.name);
      }
      return a.building.localeCompare(b.building);
    })
    .slice(0, limit);

  if (items.length === 0) {
    return (
      <div
        className={cn(
          "w-[320px] max-h-[60vh] overflow-auto rounded-md border border-dashed bg-muted/20 p-4 text-sm text-muted-foreground",
          className,
        )}
      >
        {LABELS[kind].empty}
      </div>
    );
  }

  return (
    <div className={cn("w-[320px] max-h-[60vh] overflow-auto p-3", className)}>
      <p className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {CATEGORY_LABEL[kind]}
      </p>
      <ul className="mt-2 space-y-2">
        {items.map((place) => (
          <li key={place.id}>
            <Link
              href={LABELS[kind].href(place)}
              className="block rounded-md px-2 py-2 transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              aria-label={`${place.name}, building ${place.building}, floor ${place.floor}`}
            >
              <div className="font-medium text-sm">{place.name}</div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">Bldg {place.building}</span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">Floor {place.floor}</span>
                <span className={cn("rounded-full px-2 py-0.5", badgeClasses(place.category))}>{place.category}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-3 border-t pt-3 text-right">
        <Link
          href={LABELS[kind].seeAllHref}
          className="text-sm font-medium text-primary underline-offset-2 hover:underline"
        >
          {LABELS[kind].seeAll}
        </Link>
      </div>
    </div>
  );
}

export default NavDataList;

