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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/20">
      <Container>
        <div className="py-8 space-y-8">
          {/* Premium Header - Sticky */}
          <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-lg -mx-6 px-6 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Building Info */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-30"></div>
                  <div className="relative bg-gradient-to-br from-green-600 to-emerald-600 p-4 rounded-2xl shadow-lg">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                    Building {id}
                  </h1>
                  <p className="text-sm text-slate-600 mt-2 flex items-center gap-2 font-medium">
                    <Info className="h-4 w-4 text-green-600" />
                    Floor {floorParam === '0' ? 'G' : floorParam} • Click zones for details
                  </p>
                </div>
              </div>
              
              {/* Floor Picker */}
              <div className="bg-white rounded-2xl shadow-xl ring-1 ring-slate-200/50 p-2">
                <FloorPicker value={activeFloor} onChange={handleFloorChange} floors={floors} />
              </div>
            </div>
          </div>

          {/* Floor Map - Premium Card */}
          <div className="relative group">
            {/* Hover glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative bg-white rounded-3xl shadow-2xl ring-2 ring-slate-200/50 overflow-hidden">
              {/* Map header badge */}
              <div className="absolute top-6 left-6 z-10">
                <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-slate-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg ring-1 ring-slate-200/50">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Interactive Map
                </div>
              </div>
              
              <div className="p-8 md:p-12">
                <FloorMap 
                  building={id} 
                  floor={floorParam}
                  autoOpen={searchParams.get("autoOpen") === "true"}
                  placeSlug={searchParams.get("slug") || undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
