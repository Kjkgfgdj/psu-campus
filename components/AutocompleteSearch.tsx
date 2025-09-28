"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FLOOR_LABEL } from "@/lib/floors";
import { useDebouncedValue } from "@/components/useDebouncedValue";
import { badgeClasses } from "@/lib/categories";
import { cn } from "@/lib/utils";

type Place = {
  id: string;
  name: string;
  building: number;
  floor: number;
  category: string;
  description: string;
  videoUrl: string;
  x: number;
  y: number;
  slug: string;
};

type AutocompleteSearchProps = {
  defaultValue?: string;
};

export default function AutocompleteSearch({ defaultValue = "" }: AutocompleteSearchProps) {
  const router = useRouter();
  const [term, setTerm] = useState<string>(defaultValue);
  const debounced = useDebouncedValue(term, 200);
  const [results, setResults] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const abortRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // listbox ref is not required currently; can be added if needed

  const hasTerm = debounced.trim().length > 0;

  // Close on route change (best-effort by listening to visibility of list)
  useEffect(() => {
    const handleRouteChange = () => setOpen(false);
    // next/navigation does not expose events; rely on blur/outside click primarily
    return () => {
      handleRouteChange();
    };
  }, []);

  // Outside click handler
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const target = e.target as Node | null;
      if (containerRef.current && target && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // Fetch results
  useEffect(() => {
    if (!hasTerm) {
      setResults([]);
      setHighlightIndex(-1);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const doFetch = async () => {
      try {
        const resp = await fetch(`/api/places?q=${encodeURIComponent(debounced)}`, {
          method: "GET",
          signal: controller.signal,
          headers: { "Accept": "application/json" },
        });
        if (!resp.ok) return;
        const data = await resp.json();
        const places: Place[] = Array.isArray(data?.places) ? data.places.slice(0, 8) : [];
        setResults(places);
        setOpen(true);
        setHighlightIndex(places.length > 0 ? 0 : -1);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        // swallow errors for UX
      }
    };

    doFetch();
    return () => controller.abort();
  }, [debounced, hasTerm]);

  const navigateTo = useCallback((place: Place) => {
    const href = `/buildings/${place.building}?floor=${place.floor}${place.slug ? `&slug=${place.slug}` : ""}`;
    setOpen(false);
    router.push(href);
  }, [router]);

  const onSubmitSearch = useCallback(() => {
    const q = term.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }, [router, term]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((idx) => {
        const next = results.length === 0 ? -1 : (idx + 1) % results.length;
        return next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((idx) => {
        if (results.length === 0) return -1;
        const next = idx <= 0 ? results.length - 1 : idx - 1;
        return next;
      });
    } else if (e.key === "Enter") {
      if (open && highlightIndex >= 0 && highlightIndex < results.length) {
        e.preventDefault();
        navigateTo(results[highlightIndex]);
      } else {
        // No highlighted result -> go to /search?q=
        onSubmitSearch();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const onFocus = () => {
    if (results.length > 0) setOpen(true);
  };

  const showNoResults = hasTerm && open && results.length === 0;

  return (
    <div
      ref={containerRef}
      role="combobox"
      aria-expanded={open}
      aria-controls="autocomplete-listbox"
      aria-haspopup="listbox"
      className="relative w-full"
    >
      <Input
        type="text"
        placeholder="Search for a classroom, office, or facility..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        className="w-full text-lg py-6 px-4"
        aria-autocomplete="list"
        aria-controls="autocomplete-listbox"
        aria-activedescendant={highlightIndex >= 0 ? `ac-item-${highlightIndex}` : undefined}
      />

      {open && hasTerm && (
        <div
          id="autocomplete-listbox"
          role="listbox"
          className="absolute z-50 mt-2 w-full rounded-xl border bg-background shadow-md max-h-80 overflow-auto"
        >
          {results.map((place, idx) => {
            const active = idx === highlightIndex;
            return (
              <div
                key={place.id}
                id={`ac-item-${idx}`}
                role="option"
                aria-selected={active}
                tabIndex={-1}
                onMouseEnter={() => setHighlightIndex(idx)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => navigateTo(place)}
                className={[
                  "cursor-pointer px-4 py-3 border-b last:border-b-0",
                  active ? "bg-accent" : "",
                ].join(" ")}
              >
                <div className="font-medium text-foreground">{place.name}</div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="text-[10px]">Building {place.building}</Badge>
                  <Badge variant="outline" className="text-[10px]">Floor {FLOOR_LABEL[place.floor] ?? String(place.floor)}</Badge>
                  {place.category && (
                    <Badge className={cn("text-[10px]", badgeClasses(place.category))}>
                      {place.category}
                    </Badge>
                  )}
                </div>
                {place.description && (
                  <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">{place.description}</div>
                )}
              </div>
            );
          })}

          {showNoResults && (
            <div className="px-4 py-3 text-sm text-muted-foreground">
              <div>No places found</div>
              <button
                type="button"
                onClick={onSubmitSearch}
                className="mt-1 text-primary hover:underline"
              >
                Search all for &lsquo;{debounced}&rsquo; ↵
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
