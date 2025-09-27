"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { BUILDING_FLOORS, parseFloor } from "@/lib/floors";
import { CATEGORY, type CategoryFilter, categoryFromQuery, categoryToQuery } from "@/lib/categories";
import FloorPicker from "@/components/FloorPicker";
import PlaceholderFloor from "@/components/PlaceholderFloor";
import { CategoryChips } from "@/components/CategoryChips";

export default function BuildingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id: buildingId } = useParams<{ id: string }>();

  const [category, setCategory] = useState<CategoryFilter>(CATEGORY.ALL);

  const currentFloor = parseFloor(searchParams.get("floor"));
  const floors = useMemo(() => BUILDING_FLOORS[buildingId] ?? [0], [buildingId]);

  useEffect(() => {
    setCategory((prev) => {
      const next = categoryFromQuery(searchParams.get("cat"));
      return prev === next ? prev : next;
    });
  }, [searchParams]);

  const replaceParams = useCallback(
    (nextParams: URLSearchParams) => {
      router.replace(`?${nextParams.toString()}`);
    },
    [router],
  );

  const setFloor = (n: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("floor", String(n));
    const catQuery = categoryToQuery(category);
    if (catQuery === "all") {
      next.delete("cat");
    } else {
      next.set("cat", catQuery);
    }
    replaceParams(next);
  };

  const handleCategoryChange = (nextCategory: CategoryFilter) => {
    setCategory(nextCategory);
    const next = new URLSearchParams(searchParams);
    const queryValue = categoryToQuery(nextCategory);
    if (queryValue === "all") {
      next.delete("cat");
    } else {
      next.set("cat", queryValue);
    }
    replaceParams(next);
  };

  return (
    <div className="w-full max-w-none px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-semibold mb-4">Building {buildingId}</h1>

      <div className="mb-4">
        <CategoryChips selected={category} onChange={handleCategoryChange} />
      </div>

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