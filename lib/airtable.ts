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

async function fetchPlaces(): Promise<Place[]> {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_PLACES) {
    throw new Error("Missing Airtable configuration. Please set AIRTABLE_TOKEN, AIRTABLE_BASE_ID, and AIRTABLE_TABLE_PLACES.");
  }

  const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_PLACES}`);
  url.searchParams.set("pageSize", "100");
  url.searchParams.set("sort[0][field]", "name");
  url.searchParams.set("sort[0][direction]", "asc");

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Airtable API error (${response.status}): ${body}`);
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
}

let cachedPlaces: Promise<Place[]> | null = null;

export async function getPlaces(): Promise<Place[]> {
  if (!cachedPlaces) {
    cachedPlaces = fetchPlaces();
  }
  return cachedPlaces;
}

export async function getPopularExamPlaces(): Promise<Place[]> {
  const all = await getPlaces();
  return all.filter((place) => place.category === "Popular exam places");
}

export async function getFoodAndDrinks(): Promise<Place[]> {
  const all = await getPlaces();
  return all.filter((place) => place.category === "Food & drinks");
}

