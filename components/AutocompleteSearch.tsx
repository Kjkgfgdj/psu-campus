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
      <div className="relative w-full">
        {/* Search icon */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
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
          className="w-full rounded-2xl bg-white/90 text-slate-900 placeholder-slate-500 border-2 border-slate-200 shadow-xl hover:shadow-2xl hover:border-green-300 focus:border-green-500 transition-all duration-300 pl-14 pr-6 py-6 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-green-500/20"
          style={{
            height: '64px'
          }}
          aria-autocomplete="list"
          aria-controls="autocomplete-listbox"
          aria-activedescendant={highlightIndex >= 0 ? `ac-item-${highlightIndex}` : undefined}
        />
        
        {/* Keyboard hint */}
        {!term && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-500 font-mono">
              <span className="text-[10px]">⌘</span>K
            </kbd>
          </div>
        )}
      </div>

      {open && debounced.trim() && (
        <div
          id="autocomplete-listbox"
          role="listbox"
          className="absolute z-50 mt-4 w-full rounded-2xl border-2 border-slate-200 bg-white shadow-2xl backdrop-blur-xl ring-1 ring-black/5 overflow-hidden"
        >
          <div className="max-h-96 overflow-y-auto">
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
                    "group cursor-pointer border-b border-slate-100 px-6 py-4 last:border-b-0 transition-all duration-200 relative",
                    active ? "bg-gradient-to-r from-green-50 to-emerald-50" : "hover:bg-slate-50",
                  )}
                  onMouseEnter={() => setHighlightIndex(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => navigateTo(place)}
                >
                  {/* Green accent bar for active item */}
                  {active && (
                    <div className="absolute left-1 top-2 bottom-2 w-1 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full"></div>
                  )}
                  
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        "font-semibold text-slate-900 text-base mb-2 group-hover:text-green-700 transition-colors",
                        active && "text-green-700"
                      )}>
                        {place.name}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs font-medium rounded-lg px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-200">
                          Building {place.building}
                        </Badge>
                        <Badge variant="outline" className="text-xs font-medium rounded-lg px-2.5 py-0.5 border-slate-300">
                          Floor {FLOOR_LABEL[place.floor] ?? String(place.floor)}
                        </Badge>
                        {place.category && (
                          <Badge className={cn("text-xs font-medium rounded-lg px-2.5 py-0.5", badgeClasses(place.category))}>
                            {place.category}
                          </Badge>
                        )}
                      </div>
                      {place.description && (
                        <div className="mt-2 line-clamp-1 text-sm text-slate-600">{place.description}</div>
                      )}
                    </div>
                    <svg className={cn(
                      "h-5 w-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-all",
                      active && "opacity-100 text-green-600"
                    )} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              );
            })}

            {showNoResults && (
              <div className="px-4 py-3 text-sm text-muted-foreground">No places found.</div>
            )}
          </div>
          <div className="border-t border-slate-200 bg-gradient-to-r from-slate-50 to-green-50/30 px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-slate-600">
              {filtered.length} {filtered.length === 1 ? 'result' : 'results'} found
            </span>
            <button
              type="button"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800 transition-all"
              onMouseDown={(event) => event.preventDefault()}
              onClick={onSubmitSearch}
            >
              View all results
              <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

