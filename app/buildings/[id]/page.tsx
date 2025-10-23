"use client";

import { useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import FloorMap from "@/components/FloorMap";
import FloorPicker from "@/components/FloorPicker";
import { BUILDING_FLOORS, parseFloor } from "@/lib/floors";
import { Container } from "@/components/ui/Container";
import { Building2, Info } from "lucide-react";

export default function BuildingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const floorParam = searchParams.get("floor") ?? "0";
  const activeFloor = parseFloor(floorParam, 0);

  const floors = useMemo<number[]>(() => {
    const b = Number(id);
    if (!Number.isFinite(b)) return [0];
    return BUILDING_FLOORS[b] ?? [0];
  }, [id]);

  if (!id) {
    return (
      <div className="py-12">
        <Container>
          <div className="text-center">
            <p className="text-slate-600">Building not found.</p>
          </div>
        </Container>
      </div>
    );
  }

  const handleFloorChange = (floor: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("floor", String(floor));
    router.replace(`/buildings/${id}?${next.toString()}`);
  };

  return (
    <div className="py-8">
      <Container>
        <div className="space-y-6">
          {/* Header */}
          <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm -mx-4 px-4 py-4 border-b border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-600 p-2.5 rounded-xl">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Building {id}
                  </h1>
                  <p className="text-sm text-slate-600 mt-1 flex items-center gap-1.5">
                    <Info className="h-4 w-4" />
                    Floor {floorParam} — Click zones for details
                  </p>
                </div>
              </div>
              <FloorPicker value={activeFloor} onChange={handleFloorChange} floors={floors} />
            </div>
          </div>

          {/* Floor Map */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
            <FloorMap building={id} floor={floorParam} />
          </div>
        </div>
      </Container>
    </div>
  );
}
