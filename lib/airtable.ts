import "server-only";
import { cache } from "react";

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_PLACES = process.env.AIRTABLE_TABLE_PLACES;

export type Place = {
  id: string;
  name: string;
  building: string;
  floor: number;
  category: string;
  slug?: string;
  description?: string;
};

const loadPlaces = cache(async (): Promise<Place[]> => {
  const hasEnv = Boolean(AIRTABLE_TOKEN && AIRTABLE_BASE_ID && AIRTABLE_TABLE_PLACES);
  if (!hasEnv) {
    console.warn("[airtable] Missing env; returning empty list for place data.");
    return [];
  }

  const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_PLACES}`);
  url.searchParams.set("pageSize", "100");
  url.searchParams.set("sort[0][field]", "name");
  url.searchParams.set("sort[0][direction]", "asc");

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`[airtable] API error (${response.status}): ${body}`);
      return [];
    }

    const json: {
      records: Array<{
        id: string;
        fields: {
          name?: string;
          building?: string | number;
          floor?: number;
          category?: string;
          description?: string;
          slug?: string;
        };
      }>;
    } = await response.json();

    return json.records.map((record) => ({
      id: record.id,
      name: record.fields.name ?? "",
      building: String(record.fields.building ?? ""),
      floor: Number(record.fields.floor ?? 0),
      category: record.fields.category ?? "",
      slug: record.fields.slug ?? undefined,
      description: record.fields.description ?? undefined,
    }));
  } catch (error) {
    console.error("[airtable] Failed to fetch places:", error);
    return [];
  }
});

export async function getPlaces(): Promise<Place[]> {
  return loadPlaces();
}

export const getPopularExamPlaces = cache(async (): Promise<Place[]> => {
  const all = await loadPlaces();
  return all.filter((place) => place.category === "Popular exam places");
});

export const getFoodAndDrinks = cache(async (): Promise<Place[]> => {
  const all = await loadPlaces();
  return all.filter((place) => place.category === "Food & drinks");
});

