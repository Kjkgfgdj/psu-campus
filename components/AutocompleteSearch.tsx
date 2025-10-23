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
      {/* Screen reader help text */}
      <div id="search-help-text" className="sr-only">
        Search for classrooms, offices, or facilities across PSU campus. Use arrow keys to navigate results, Enter to select, Escape to close.
      </div>
      
      <div className="relative w-full">
        {/* Search icon with premium styling */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg blur opacity-30"></div>
            <svg className="relative h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <Input
          type="text"
          role="searchbox"
          placeholder="Search for classrooms, offices, or facilities..."
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          onFocus={() => {
            const hasText = debounced.trim().length > 0 || term.trim().length > 0;
            setOpen(hasText);
            if (places.length === 0 && !isLoading) fetchAll();
          }}
          onKeyDown={onKeyDown}
          className="w-full rounded-2xl bg-white text-slate-900 placeholder-slate-500 border-2 border-slate-200/80 shadow-2xl hover:shadow-green-500/20 hover:shadow-2xl hover:border-green-400 focus:border-green-600 focus:shadow-green-500/25 transition-all duration-300 pl-16 pr-28 py-7 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-green-500/20"
          style={{
            height: '72px'
          }}
          aria-autocomplete="list"
          aria-controls="autocomplete-listbox"
          aria-activedescendant={highlightIndex >= 0 ? `ac-item-${highlightIndex}` : undefined}
          aria-label="Search campus locations"
          aria-describedby="search-help-text"
        />
        
        {/* Enhanced keyboard hint */}
        {!term && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
            <span className="hidden sm:block text-xs text-slate-500 font-medium mr-2">Press</span>
            <kbd className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-3 py-2 text-sm text-slate-700 font-bold shadow-md">
              <span className="text-base">⌘</span>K
            </kbd>
          </div>
        )}
        
        {/* Loading indicator */}
        {isLoading && term && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-600 border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* Live region for screen reader announcements */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isLoading && debounced.trim() && "Loading search results..."}
        {!isLoading && filtered.length > 0 && `${filtered.length} ${filtered.length === 1 ? 'result' : 'results'} found`}
        {showNoResults && "No results found"}
      </div>

      {open && debounced.trim() && (
        <div
          id="autocomplete-listbox"
          role="listbox"
          aria-label="Search results"
          className="absolute z-50 mt-3 w-full rounded-2xl border-2 border-slate-200/80 bg-white/95 backdrop-blur-2xl shadow-2xl ring-1 ring-green-500/10 overflow-hidden"
        >
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading && debounced.trim() && places.length === 0 && (
              <div className="px-4 py-3 text-sm text-muted-foreground" role="status">
                Loading…
              </div>
            )}
            {filtered.map((place, index) => {
              const active = index === highlightIndex;
              const isFirst = index === 0;
              const isLast = index === filtered.length - 1;
              
              return (
                <div
                  key={place.id}
                  id={`ac-item-${index}`}
                  role="option"
                  aria-selected={active}
                  className={cn(
                    "group cursor-pointer border-b border-slate-100/60 px-6 py-5 transition-all duration-200 relative",
                    isFirst && "rounded-t-2xl pt-4",
                    isLast && "border-b-0 rounded-b-2xl pb-4",
                    active ? "bg-gradient-to-r from-green-50 via-emerald-50/50 to-green-50 shadow-sm" : "hover:bg-gradient-to-r hover:from-slate-50 hover:to-green-50/30",
                  )}
                  onMouseEnter={() => setHighlightIndex(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => navigateTo(place)}
                >
                  {/* Enhanced green accent bar for active item */}
                  {active && (
                    <div className="absolute left-2 top-3 bottom-3 w-1.5 bg-gradient-to-b from-green-600 via-emerald-600 to-green-600 rounded-full shadow-md"></div>
                  )}
                  
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        "font-bold text-slate-900 text-base mb-2.5 leading-tight group-hover:text-green-700 transition-colors",
                        active && "text-green-700"
                      )}>
                        {place.name}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="text-xs font-semibold rounded-lg px-3 py-1 bg-green-50 text-green-700 border border-green-200 shadow-sm">
                          Building {place.building}
                        </Badge>
                        <Badge variant="outline" className="text-xs font-semibold rounded-lg px-3 py-1 border-blue-300 bg-blue-50 text-blue-700 shadow-sm">
                          Floor {FLOOR_LABEL[place.floor] ?? String(place.floor)}
                        </Badge>
                        {place.category && (
                          <Badge className={cn("text-xs font-semibold rounded-lg px-3 py-1 shadow-sm", badgeClasses(place.category))}>
                            {place.category}
                          </Badge>
                        )}
                      </div>
                      {place.description && (
                        <div className="mt-2.5 line-clamp-1 text-sm text-slate-600 leading-relaxed">{place.description}</div>
                      )}
                    </div>
                    <div className={cn(
                      "flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200",
                      active && "opacity-100"
                    )}>
                      <div className="relative">
                        <div className={cn(
                          "absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg blur opacity-0 group-hover:opacity-40 transition-opacity",
                          active && "opacity-40"
                        )}></div>
                        <svg className={cn(
                          "relative h-5 w-5 text-slate-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all",
                          active && "text-green-600 translate-x-1"
                        )} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {showNoResults && (
              <div className="px-6 py-12 text-center">
                <div className="mb-3">
                  <svg className="w-12 h-12 mx-auto text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-600">No places found</p>
                <p className="text-xs text-slate-500 mt-1">Try adjusting your search terms</p>
              </div>
            )}
          </div>
          <div className="border-t-2 border-slate-100 bg-gradient-to-r from-slate-50/80 via-green-50/40 to-slate-50/80 px-6 py-4 flex items-center justify-between rounded-b-2xl backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-slate-700">
                {filtered.length} {filtered.length === 1 ? 'place' : 'places'}
              </span>
            </div>
            <button
              type="button"
              className="group relative inline-flex items-center gap-2 text-sm font-bold text-green-700 hover:text-green-800 transition-all"
              onMouseDown={(event) => event.preventDefault()}
              onClick={onSubmitSearch}
            >
              <span className="relative">View all results</span>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded opacity-0 group-hover:opacity-30 blur transition-opacity"></div>
                <svg className="relative h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

