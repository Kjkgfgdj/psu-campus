"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SearchFilters, type Filters } from "@/components/SearchFilters"
import { PlacesList } from "@/components/PlacesList"
import CategoryChip, { toCatSlug, type CatSlug } from "@/components/CategoryChip"
import type { Place } from "@/lib/types"

const VALID = new Set(["food", "important", "exam", "public", "classroom"])
function normalizeCat(v?: string | null): "all" | CatSlug {
  if (!v) return "all"
  const m = v.toLowerCase()
  if (m === "exams") return "exam"
  return (VALID.has(m) ? (m as CatSlug) : "all")
}

export default function SearchClient({ initialParams }: { initialParams?: Record<string, string | undefined> }) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  // Source of truth: URL params (read every render)
  const cat = normalizeCat(sp.get("cat") ?? initialParams?.cat)
  const building = sp.get("building") ?? initialParams?.building ?? "__all__"
  const floor = sp.get("floor") ?? initialParams?.floor ?? "__all__"
  const q = sp.get("q") ?? initialParams?.q ?? ""

  // Local data state
  const [places, setPlaces] = useState<Place[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Helper to update a single URL param without stacking conflicting filters
  const setParam = (key: string, value?: string) => {
    const next = new URLSearchParams(sp)
    if (!value || value === "__all__" || value === "all") next.delete(key)
    else next.set(key, value)
    const qs = next.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const onFiltersChange = (next: Filters) => {
    setParam("building", next.building)
    setParam("floor", next.floor)
    setParam("q", next.q)
  }

  // Fetch places whenever URL-derived filters change
  useEffect(() => {
    const ctrl = new AbortController()
    setIsLoading(true)
    setError(null)

    const fetchPlaces = async () => {
      try {
        const params = new URLSearchParams()
        if (building !== "__all__") params.set("building", building)
        if (floor !== "__all__") params.set("floor", floor)
        if (q.trim()) params.set("q", q.trim())

        const base = params.toString()
        const url = `/api/places${base ? `?${base}&limit=all` : "?limit=all"}`
        const res = await fetch(url, { signal: ctrl.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setPlaces(Array.isArray(data) ? data as Place[] : (data?.places ?? []))
      } catch (e) {
        if ((e as Error).name === "AbortError") return
        setError((e as Error).message)
        setPlaces([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlaces()
    return () => ctrl.abort()
  }, [building, floor, q])

  const filtered: Place[] = useMemo(() => {
    if (cat === "all") return places
    return places.filter((p) => toCatSlug(String(p.category)) === cat)
  }, [places, cat])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Search Places</h1>
        <p className="text-muted-foreground">Find places on campus with instant search and filtering</p>
      </div>

      <SearchFilters
        value={{ building, floor, q }}
        onChange={onFiltersChange}
        loading={isLoading}
        onClear={() => onFiltersChange({ building: "__all__", floor: "__all__", q: "" })}
      />

      <div className="flex flex-wrap items-center gap-3">
        <a
          href="/search"
          className={`inline-flex items-center rounded-full ring-1 transition hover:opacity-95 focus:outline-none focus:ring-2 px-4 py-2 ${cat === "all" ? 'bg-gray-900 text-white ring-gray-900' : 'bg-white text-gray-700 ring-gray-200'}`}
          aria-label="All categories"
        >
          All categories
        </a>
        {(["food","important","exam","public","classroom"] as CatSlug[]).map((slug) => (
          <CategoryChip key={slug} slug={slug} href={{ pathname: "/search", query: { cat: slug } }} />
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {isLoading ? "Searching..." : `${filtered.length} place${filtered.length !== 1 ? "s" : ""} found`}
          </h2>
        </div>

        <PlacesList places={filtered} isLoading={isLoading} error={error} emptyMessage="No results for this filter." />
      </div>
    </div>
  )
}


