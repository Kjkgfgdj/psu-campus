import { NextResponse } from "next/server";
import { CATEGORY, type CategorySlug, listAllPlaces } from "@/lib/airtable";

export const revalidate = 60;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") ?? "").toLowerCase().trim();
    const category = searchParams.get("category") ?? searchParams.get("cat");
    const limitParam = searchParams.get("limit");
    const limit = Math.max(1, Math.min(Number(limitParam) || 1000, 5000));

    let places = await listAllPlaces();

    if (category) {
      const slug = category.toLowerCase() as CategorySlug;
      if (CATEGORY[slug]) {
        places = places.filter((place) => place.category === CATEGORY[slug]);
      } else {
        places = places.filter((place) => place.category === category);
      }
    }

    if (q) {
      places = places.filter((place) => {
        const haystack = [place.name, place.slug, place.description]
          .filter(Boolean)
          .map((value) => String(value).toLowerCase());
        return haystack.some((value) => value.includes(q));
      });
    }

    return NextResponse.json({ places: places.slice(0, limit) });
  } catch (error) {
    console.error("Places API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
