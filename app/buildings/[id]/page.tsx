"use client";

import { useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { BUILDING_FLOORS, parseFloor } from '@/lib/floors';
import FloorPicker from '@/components/FloorPicker';
import PlaceholderFloor from '@/components/PlaceholderFloor';

export default function BuildingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id: buildingId } = useParams<{ id: string }>();

  const currentFloor = parseFloor(searchParams.get('floor'));
  const floors = useMemo(() => BUILDING_FLOORS[buildingId] ?? [0], [buildingId]);

  const setFloor = (n: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('floor', String(n));
    router.replace(`?${next.toString()}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Building {buildingId}</h1>

      <div className="relative">
        {/* Top-right overlay */}
        <div className="absolute top-4 right-4 z-20">
          <FloorPicker value={currentFloor} onChange={setFloor} floors={floors} />
        </div>

        {/* Large placeholder “map” */}
        <PlaceholderFloor building={String(buildingId)} floor={currentFloor} />
      </div>
    </div>
  );
}