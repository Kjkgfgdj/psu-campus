"use client";

import { useCallback, useEffect, useMemo, useRef, useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FLOOR_LABEL } from "@/lib/floors";
import { useDebouncedValue } from "@/components/useDebouncedValue";
import { badgeClasses } from "@/lib/categories";
import { cn } from "@/lib/utils";

interface Place {
  id: string;
  name: string;
  building: number;
  floor: number;
  category: string;
  description?: string;
  slug?: string;
}

const MAX_SUGGESTIONS = 50;
const FETCH_URL = "/api/places?limit=1000";

export default function AutocompleteSearch({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const [term, setTerm] = useState(defaultValue);
  const debounced = useDebouncedValue(term, 200);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const listboxId = "autocomplete-listbox";
  const abortRef = useRef<AbortController | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!open) return;
      const target = event.target as Node | null;
      if (containerRef.current && target && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);

    fetch(FETCH_URL, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<{ places: Place[] }>;
      })
      .then((data) => {
        setPlaces(Array.isArray(data.places) ? data.places : []);
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error("Autocomplete fetch failed:", error);
        setPlaces([]);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (debounced.trim() && places.length > 0) {
      setOpen(true);
      setHighlightIndex(0);
    } else if (!debounced.trim()) {
      setHighlightIndex(-1);
    }
  }, [debounced, places.length]);

  const filtered = useMemo(() => {
    const query = debounced.trim().toLowerCase();
    if (!query) return [];

    const scored = places.map((place) => ({
      place,
      score: scorePlace(place, query),
    }));

    return scored
      .filter((item) => item.score > 0)
      .sort((a, b) => (b.score === a.score ? a.place.name.localeCompare(b.place.name) : b.score - a.score))
      .slice(0, MAX_SUGGESTIONS)
      .map((item) => item.place);
  }, [debounced, places]);

  const navigateTo = useCallback(
    (place: Place) => {
      const slugParam = place.slug ? `&slug=${place.slug}` : "";
      const href = `/buildings/${place.building}?floor=${place.floor}${slugParam}`;
      setOpen(false);
      startTransition(() => router.push(href));
    },
    [router],
  );

  const onSubmitSearch = useCallback(() => {
    const q = term.trim();
    if (!q) return;
    setOpen(false);
    startTransition(() => router.push(`/search?q=${encodeURIComponent(q)}`));
  }, [router, term]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setOpen(true);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightIndex((prev) => (filtered.length === 0 ? -1 : (prev + 1) % filtered.length));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightIndex((prev) => {
        if (filtered.length === 0) return -1;
        return prev <= 0 ? filtered.length - 1 : prev - 1;
      });
    } else if (event.key === "Enter") {
      if (open && highlightIndex >= 0 && highlightIndex < filtered.length) {
        event.preventDefault();
        navigateTo(filtered[highlightIndex]);
      } else {
        onSubmitSearch();
      }
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const showNoResults = debounced.trim().length > 0 && filtered.length === 0 && !isLoading;

  return (
    <div
      ref={containerRef}
      role="combobox"
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-controls={listboxId}
      aria-owns={listboxId}
      className="relative w-full"
    >
      <Input
        type="text"
        placeholder="Search for a classroom, office, or facility..."
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        onFocus={() => {
          if (filtered.length > 0) setOpen(true);
        }}
        onKeyDown={onKeyDown}
        className="w-full px-4 py-6 text-lg"
        aria-autocomplete="list"
        aria-controls="autocomplete-listbox"
        aria-activedescendant={highlightIndex >= 0 ? `ac-item-${highlightIndex}` : undefined}
      />

      {open && debounced.trim() && (
        <div
          id="autocomplete-listbox"
          role="listbox"
          className="absolute z-50 mt-2 w-full rounded-xl border bg-background shadow-md"
        >
          <div className="max-h-80 overflow-y-auto">
            {filtered.map((place, index) => {
              const active = index === highlightIndex;
              return (
                <div
                  key={place.id}
                  id={`ac-item-${index}`}
                  role="option"
                  aria-selected={active}
                  className={cn(
                    "cursor-pointer border-b px-4 py-3 last:border-b-0",
                    active && "bg-accent",
                  )}
                  onMouseEnter={() => setHighlightIndex(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => navigateTo(place)}
                >
                  <div className="font-medium text-foreground">{place.name}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-[10px]">
                      Building {place.building}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      Floor {FLOOR_LABEL[place.floor] ?? String(place.floor)}
                    </Badge>
                    <Badge className={cn("text-[10px]", badgeClasses(place.category))}>{place.category}</Badge>
                  </div>
                  {place.description && (
                    <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">{place.description}</div>
                  )}
                </div>
              );
            })}

            {showNoResults && (
              <div className="px-4 py-3 text-sm text-muted-foreground">No places found.</div>
            )}
          </div>
          <div className="border-t bg-muted/40 px-4 py-2 text-right text-sm">
            <button
              type="button"
              className="text-primary underline-offset-2 hover:underline"
              onMouseDown={(event) => event.preventDefault()}
              onClick={onSubmitSearch}
            >
              View all {filtered.length || 0} results →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function scorePlace(place: Place, query: string): number {
  const name = place.name.toLowerCase();
  const slug = (place.slug ?? "").toLowerCase();
  const description = (place.description ?? "").toLowerCase();

  if (name.startsWith(query)) return 100;
  if (slug.startsWith(query)) return 90;
  if (name.includes(query)) return 60;
  if (slug.includes(query)) return 50;
  if (description.includes(query)) return 30;
  return 0;
}
