"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { BUILDING_FLOORS, parseFloor } from "@/lib/floors";
import FloorPicker from "@/components/FloorPicker";
import PlaceholderFloor from "@/components/PlaceholderFloor";

export default function BuildingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buildingId = params.id;
  const currentFloor = parseFloor(searchParams.get("floor"));
  
  // Get available floors for this building
  const availableFloors = BUILDING_FLOORS[buildingId] ?? [0];
  
  const handleFloorChange = (nextFloor: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("floor", String(nextFloor));
    router.replace(`?${params.toString()}`);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Building {buildingId}
        </h1>
        
        <div className="relative">
          <FloorPicker
            value={currentFloor}
            onChange={handleFloorChange}
            floors={availableFloors}
          />
          
          <PlaceholderFloor
            building={buildingId}
            floor={currentFloor}
          />
        </div>
      </div>
    </div>
  );
}