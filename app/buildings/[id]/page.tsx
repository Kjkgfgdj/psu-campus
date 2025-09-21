"use client";

import { useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { BUILDING_FLOORS, FLOOR_LABEL, parseFloor } from '@/lib/floors';
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
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Building {buildingId}</h1>

      <div className="relative">
        {/* floating floor picker */}
        <div className="pointer-events-auto absolute inset-x-0 -top-6 mx-auto flex justify-center">
          <div className="rounded-2xl border bg-card shadow-sm">
            <FloorPicker value={currentFloor} onChange={setFloor} floors={floors} />
          </div>
        </div>

        {/* placeholder “image” area */}
        <PlaceholderFloor building={String(buildingId)} floor={currentFloor} />
      </div>
    </div>
  );
}