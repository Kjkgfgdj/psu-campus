import { NextRequest, NextResponse } from "next/server";
import { ZONE_TO_NAME } from "@/lib/zoneToName";
import { findVideoUrlByName } from "@/lib/airtable";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const building = (url.searchParams.get("building") || "").trim();
  const zoneId = (url.searchParams.get("zoneId") || "").trim();

  if (!building || !zoneId) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const name = ZONE_TO_NAME[building]?.[zoneId];
  if (!name) {
    const payload: Record<string, unknown> = { videoUrl: null };
    if (process.env.NODE_ENV !== "production") {
      payload._debug = { reason: "no mapping", building, zoneId };
    }
    return NextResponse.json(payload);
  }

  const videoUrl = await findVideoUrlByName(building, name);
  const payload: Record<string, unknown> = { videoUrl };
  if (process.env.NODE_ENV !== "production") {
    payload._debug = { building, zoneId, name };
  }

  return NextResponse.json(payload);
}



