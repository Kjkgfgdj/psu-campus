import "server-only";
import { cache } from "react";

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_PLACES = process.env.AIRTABLE_TABLE_PLACES;

if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_PLACES) {
  console.warn("[airtable] Missing env vars: AIRTABLE_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TABLE_PLACES");
}

export type Place = {
  id: string;
  name: string;
  building: number;
  floor: number;
  category: string;
  slug?: string;
  description?: string;
  videoUrl?: string;
  x?: number;
  y?: number;
};

export const CATEGORY = {
  exam: "Popular exam places",
  food: "Food & drinks",
} as const;

export type CategorySlug = keyof typeof CATEGORY;

type AirtableRecord = {
  id: string;
  fields?: Record<string, unknown>;
};

type AirtableResponse = {
  records?: AirtableRecord[];
  offset?: string;
};

const listAllPlacesCached = cache(async (): Promise<Place[]> => {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_PLACES) {
    return [];
  }

  const collected: Place[] = [];
  const params = new URLSearchParams({ pageSize: "100", "sort[0][field]": "name", "sort[0][direction]": "asc" });
  let offset: string | undefined;

  do {
    if (offset) params.set("offset", offset);
    else params.delete("offset");

    const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_PLACES}`);
    params.forEach((value, key) => url.searchParams.set(key, value));

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`[airtable] API error (${response.status}): ${body}`);
      break;
    }

    const data: AirtableResponse = await response.json();
    for (const record of data.records ?? []) {
      collected.push(mapPlace(record));
    }

    offset = data.offset;
  } while (offset);

  return collected;
});

function mapPlace(record: AirtableRecord): Place {
  const fields = record.fields ?? {};
  return {
    id: record.id,
    name: String(fields.name ?? ""),
    building: Number(fields.building ?? 0),
    floor: Number(fields.floor ?? 0),
    category: String(fields.category ?? ""),
    description: (fields.description as string) ?? undefined,
    videoUrl: (fields.videoUrl as string) ?? undefined,
    x: Number(fields.x ?? 0) || undefined,
    y: Number(fields.y ?? 0) || undefined,
    slug: (fields.slug as string) ?? undefined,
  };
}

function uniqBySlug(items: Place[]): Place[] {
  const seen = new Set<string>();
  return items.filter((place) => {
    const key = (place.slug ?? `${place.name}-${place.building}-${place.floor}`).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function listAllPlaces(): Promise<Place[]> {
  return listAllPlacesCached();
}

export async function getPlaces(): Promise<Place[]> {
  return listAllPlaces();
}

export async function getPlacesByCategory(categoryName: string): Promise<Place[]> {
  const all = await listAllPlaces();
  return all.filter((place) => place.category === categoryName);
}

export async function getPopularExamPlaces(limit = 8): Promise<Place[]> {
  const deduped = uniqBySlug(await getPlacesByCategory(CATEGORY.exam));
  return deduped.slice(0, limit);
}

export async function getFoodAndDrinks(limit = 8): Promise<Place[]> {
  const deduped = uniqBySlug(await getPlacesByCategory(CATEGORY.food));
  return deduped.slice(0, limit);
}

