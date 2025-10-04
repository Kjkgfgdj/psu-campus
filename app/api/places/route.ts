import { NextRequest, NextResponse } from "next/server";
import { listAllPlaces } from "@/lib/airtable";

function norm(s?: string) {
  return (s ?? "")
    .toLowerCase()
    .replace(/\u00a0/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9]+/g, "-");
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);

    const limitParam = url.searchParams.get("limit");
    const all = limitParam === "all";
    const n = Number(limitParam);
    const limit = all ? Number.MAX_SAFE_INTEGER : Number.isFinite(n) ? Math.min(Math.max(n, 1), 100) : 8;

    const q = url.searchParams.get("q") ?? "";
    const building = url.searchParams.get("building");
    const floor = url.searchParams.get("floor");
    const category = url.searchParams.get("category");
    const format = url.searchParams.get("format") ?? "array";

    const nq = norm(q);
    const tokens = nq ? nq.split("-").filter(Boolean) : [];

    const items = (await listAllPlaces())
      .filter((p) => {
        if (building && String(p.building) !== building) return false;
        if (floor && String(p.floor) !== floor) return false;

        if (category) {
          const want = norm(category);
          const have = norm(p.category);
          if (want !== have) return false;
        }

        if (tokens.length) {
          const name = norm(p.name);
          const slug = norm(p.slug);
          const descr = norm(p.description);
          return tokens.every((t) => name.includes(t) || slug.includes(t) || descr.includes(t));
        }

        return true;
      })
      .slice(0, limit);

    if (format === "legacy") {
      return NextResponse.json({ places: items });
    }

    return NextResponse.json(items);
  } catch (err) {
    console.error("[api/places] GET error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
