import "server-only";
import { cache } from "react";
import { normalizeYouTubeUrl } from "./youtube";

const API_KEY = process.env.AIRTABLE_API_KEY ?? process.env.AIRTABLE_TOKEN ?? "";
const BASE_ID = process.env.AIRTABLE_BASE_ID ?? "";
const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME ?? process.env.AIRTABLE_TABLE_PLACES ?? "";

if (!API_KEY || !BASE_ID || !TABLE_NAME) {
  throw new Error(
    "Missing Airtable configuration. Required: AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME"
  );
}

function norm(s?: string) {
  return (s ?? "")
    .toLowerCase()
    .replace(/\u00a0/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9]+/g, "-");
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
  const collected: Place[] = [];
  const params = new URLSearchParams({ pageSize: "100", "sort[0][field]": "name", "sort[0][direction]": "asc" });
  let offset: string | undefined;

  do {
    if (offset) params.set("offset", offset);
    else params.delete("offset");

    const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`);
    params.forEach((value, key) => url.searchParams.set(key, value));

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
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
  const slugSource = typeof fields.slug === "string" && fields.slug.trim().length > 0
    ? (fields.slug as string)
    : typeof fields.x === "string" && fields.x.trim().length > 0
      ? (fields.x as string)
      : "";
  const slug = slugSource ? norm(slugSource) : norm(fields.name as string);
  
  // Normalize video URL (converts YouTube Shorts to standard format)
  const rawVideoUrl = (fields.videoUrl as string) ?? undefined;
  const videoUrl = rawVideoUrl && rawVideoUrl.trim() 
    ? normalizeYouTubeUrl(rawVideoUrl.trim())
    : undefined;
  
  return {
    id: record.id,
    name: String(fields.name ?? ""),
    building: Number(fields.building ?? 0),
    floor: Number(fields.floor ?? 0),
    category: String(fields.category ?? ""),
    description: (fields.description as string) ?? undefined,
    videoUrl: videoUrl,
    x: Number(fields.x ?? 0) || undefined,
    y: Number(fields.y ?? 0) || undefined,
    slug: slug || undefined,
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

// Back-compat so old imports continue working
export { listAllPlaces as listPlaces };

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

export async function findVideoUrlByName(
  building: string | number,
  name: string
): Promise<string | null> {
  const wantBuilding = String(building).trim()
  const wantNameLowerTrim = String(name).trim().toLowerCase().replace(/'/g, "\\'")

  const params = new URLSearchParams({
    maxRecords: "10",
    filterByFormula: `LOWER(TRIM({name}))='${wantNameLowerTrim}'`,
  })

  const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`)
  params.forEach((value, key) => url.searchParams.set(key, value))

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${API_KEY}` },
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    const body = await response.text()
    console.error(`[airtable] API error (${response.status}): ${body}`)
    return null
  }

  const data = (await response.json()) as AirtableResponse
  const records = Array.isArray(data.records) ? data.records : []

  const match = records.find((record) => String(record?.fields?.building ?? "").trim() === wantBuilding)
  const chosen = match ?? records[0]
  const urlField = chosen?.fields?.videoUrl
  return typeof urlField === "string" && urlField.trim() ? urlField.trim() : null
}

