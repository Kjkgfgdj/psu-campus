import Link from "next/link";
import { cache } from "react";
import { getPopularExamPlaces } from "@/lib/airtable";

type PopularExamListProps = {
  limit?: number;
};

const loadPopularExamPlaces = cache(getPopularExamPlaces);

export async function PopularExamList({ limit = 12 }: PopularExamListProps) {
  const places = await loadPopularExamPlaces();
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
        No popular exam places yet.
      </div>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((place) => (
        <li key={place.id}>
          <Link
            href={`/buildings/${place.building}?floor=${place.floor}${place.slug ? `&slug=${place.slug}` : ""}`}
            className="group block rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md hover:ring-1 hover:ring-black/10"
          >
            <div className="font-medium">{place.name}</div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">Bldg {place.building}</span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">Floor {place.floor}</span>
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700 ring-1 ring-amber-200">Popular exam</span>
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

export default PopularExamList;

