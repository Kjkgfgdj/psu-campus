import Link from "next/link";
import { cache } from "react";
import { getFoodAndDrinks } from "@/lib/airtable";
import { badgeClasses } from "@/lib/categories";
import { cn } from "@/lib/utils";

type FoodListProps = {
  limit?: number;
};

const loadFoodPlaces = cache(getFoodAndDrinks);

export async function FoodList({ limit = 12 }: FoodListProps) {
  const places = await loadFoodPlaces();
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
      <div className="rounded-xl border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground">
        No food &amp; drinks yet.
      </div>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((place) => (
        <li key={place.id}>
          <Link
            href={`/buildings/${place.building}?floor=${place.floor}&cat=food${place.slug ? `&slug=${place.slug}` : ""}`}
            className="group block rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md hover:ring-1 hover:ring-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
            aria-label={`${place.name}, building ${place.building}, floor ${place.floor}`}
          >
            <div className="font-medium">{place.name}</div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">Bldg {place.building}</span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">Floor {place.floor}</span>
              <span className={cn("rounded-full px-2 py-0.5 text-[11px]", badgeClasses("Food & drinks"))}>Food &amp; drinks</span>
            </div>
            {place.description ? (
              <p className="mt-2 line-clamp-2 text-sm text-gray-500">{place.description}</p>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default FoodList;

