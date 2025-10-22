"use client";

import { useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import FloorMap from "@/components/FloorMap";
import FloorPicker from "@/components/FloorPicker";
import { BUILDING_FLOORS, parseFloor } from "@/lib/floors";

export default function BuildingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const floorParam = searchParams.get("floor") ?? "0";
  const activeFloor = parseFloor(floorParam, 0);

  // FIX: index BUILDING_FLOORS with a number, not a string
  const floors = useMemo<number[]>(() => {
    const b = Number(id);
    if (!Number.isFinite(b)) return [0];
    return BUILDING_FLOORS[b] ?? [0];
  }, [id]);

  if (!id) {
    return (
      <main className="space-y-6 p-6">
        <p className="text-sm text-muted-foreground">Building not found.</p>
      </main>
    );
  }

  const handleFloorChange = (floor: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("floor", String(floor));
    router.replace(`/buildings/${id}?${next.toString()}`);
  };

  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent">Building {id}</h1>
          <p className="text-base text-amber-700 font-medium mt-2 leading-relaxed">
            Floor {floorParam} overview with interactive zones. Activate a highlighted area for more details and videos.
          </p>
        </div>
        <FloorPicker value={activeFloor} onChange={handleFloorChange} floors={floors} />
      </div>

      <FloorMap building={id} floor={floorParam} />
    </main>
  );
}
