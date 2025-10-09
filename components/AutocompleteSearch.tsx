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
const FETCH_URL = "/api/places?limit=all";

function norm(s?: string) {
  return (s ?? "")
    .toLowerCase()
    .replace(/\u00a0/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9]+/g, "-");
}

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

  const fetchAll = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const resp = await fetch(FETCH_URL, { signal: controller.signal });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = (await resp.json()) as { places?: Place[] } | Place[];

      if (Array.isArray(data)) setPlaces(data);
      else if (Array.isArray(data?.places)) setPlaces(data.places);
      else setPlaces([]);
    } catch (err) {
      if (!abortRef.current?.signal.aborted) {
        console.error("Autocomplete fetch failed:", err);
        setPlaces([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

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
    fetchAll();
    return () => abortRef.current?.abort();
  }, [fetchAll]);

useEffect(() => {
    const hasText = debounced.trim().length > 0;
    setOpen(hasText);
    if (!hasText) setHighlightIndex(-1);
  }, [debounced]);

  const filtered = useMemo(() => {
    const nq = norm(debounced);
    if (!nq) return [];

    const tokens = nq.split("-").filter(Boolean);

    const scored = places
      .map((place) => {
        const name = norm(place.name);
        const slug = norm(place.slug);
        const descr = norm(place.description);

        const allHay = [name, slug, descr];

        const everyTokenFound = tokens.every((t) => allHay.some((h) => h.includes(t)));
        if (!everyTokenFound) return null;

        let score = 0;
        if (slug === nq || name === nq) score += 3;
        if (slug.startsWith(nq) || name.startsWith(nq)) score += 2;
        if (slug.includes(nq) || name.includes(nq)) score += 1;

        return { place, score };
      })
      .filter(Boolean) as { place: Place; score: number }[];

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, MAX_SUGGESTIONS).map((s) => s.place);
  }, [debounced, places]);

  const navigateTo = useCallback(
    (place: Place) => {
      if (!place.building) return;
      const slugParam = place.slug ? `&slug=${place.slug}` : "";
      const floorParam = place.floor ?? "0";
      const href = `/buildings/${place.building}?floor=${floorParam}${slugParam}`;
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
          const hasText = debounced.trim().length > 0 || term.trim().length > 0;
          setOpen(hasText);
          if (places.length === 0 && !isLoading) fetchAll();
        }}
        onKeyDown={onKeyDown}
        className="w-full max-w-3xl rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-sky-400/30 shadow-sm px-4 py-3"
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
            {isLoading && debounced.trim() && places.length === 0 && (
              <div className="px-4 py-3 text-sm text-muted-foreground">Loading…</div>
            )}
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
                    {place.category && (
                      <Badge className={cn("text-[10px]", badgeClasses(place.category))}>{place.category}</Badge>
                    )}
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

