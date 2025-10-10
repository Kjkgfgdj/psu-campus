"use client"

import React, { useState, useEffect, useRef, Suspense, useMemo, useCallback, startTransition } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { SearchFilters, type Filters } from "@/components/SearchFilters"
import { PlacesList } from "@/components/PlacesList"
import { useDebouncedValue } from "@/components/useDebouncedValue"
import CategoryChip from "@/components/CategoryChip"
import {
  CATEGORY,
  type CategoryFilter,
  categoryFromQuery,
  categoryToQuery,
  matchCategory,
} from "@/lib/categories"

const ALL = "__all__"

const same = (a: Filters, b: Filters) =>
  a.building === b.building && a.floor === b.floor && a.category === b.category && a.q === b.q

const VALID_CAT_PARAMS = new Set(["all", "public", "exam", "food", "classroom", "important"])
const ALIASES: Record<string, string> = { exams: "exam" }

function buildUrl(pathname: string, params: URLSearchParams, patch: Record<string, string | null>) {
  const next = new URLSearchParams(params)
  for (const [key, value] of Object.entries(patch)) {
    if (value === null) next.delete(key)
    else next.set(key, value)
  }
  const qs = next.toString()
  return qs ? `${pathname}?${qs}` : pathname
}

interface Place {
  id: string
  name: string
  building: number
  floor: number
  category: string
  description: string
  videoUrl: string
  x: number
  y: number
  slug: string
}

interface ApiResponse {
  places: Place[]
  offset?: string
  error?: string
}

function SearchPageContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const raw = searchParams.get("cat") ?? searchParams.get("category") ?? "all"
  const cat = VALID_CAT_PARAMS.has(raw) ? raw : (ALIASES[raw] ?? "all")
  const selectedCategory = categoryFromQuery(cat)
  const normalizedRef = useRef(false)
  const didInitFromUrl = useRef(false)

  // Local state for filters
  const [filters, setFilters] = useState<Filters>({
    building: ALL,
    floor: ALL,
    category: ALL,
    q: "",
  })

  // State for search results
  const [places, setPlaces] = useState<Place[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounced filters for API calls
  const debouncedFilters = useDebouncedValue(filters, 250)

  useEffect(() => {
    if (didInitFromUrl.current) return

    const params = searchParams
    const nextFilters: Filters = {
      building: params.get("building") ?? ALL,
      floor: params.get("floor") ?? ALL,
      category: params.get("category") ?? ALL,
      q: params.get("q") ?? "",
    }

    setFilters((prev) => (same(prev, nextFilters) ? prev : nextFilters))

    if (!normalizedRef.current) {
      normalizedRef.current = true
      if (searchParams.get("category")) {
        const cleaned = buildUrl(pathname, params, { category: null, cat: cat })
        router.replace(cleaned, { scroll: false })
      } else if (!VALID_CAT_PARAMS.has(cat)) {
        const cleaned = buildUrl(pathname, params, { cat: null })
        router.replace(cleaned, { scroll: false })
      }
    }

    didInitFromUrl.current = true
  }, [pathname, cat, router, searchParams])

  // Synchronize filters (excluding category chips) to the URL
  useEffect(() => {
    if (!didInitFromUrl.current) return

    const patch: Record<string, string | null> = {
      building: filters.building !== ALL ? filters.building : null,
      floor: filters.floor !== ALL ? filters.floor : null,
      category: null,
      q: filters.q.trim() ? filters.q.trim() : null,
    }

    const nextUrl = buildUrl(pathname, searchParams, patch)
    const currentUrl = buildUrl(pathname, searchParams, {})
    if (nextUrl !== currentUrl) {
      router.replace(nextUrl, { scroll: false })
    }
  }, [filters, pathname, router, searchParams])

  // Fetch places from API based on debounced filters
  useEffect(() => {
    const ctrl = new AbortController()
    setIsLoading(true)
    setError(null)

    const fetchPlaces = async () => {
      try {
        const params = new URLSearchParams()
        if (debouncedFilters.building !== ALL) params.set("building", debouncedFilters.building)
        if (debouncedFilters.floor !== ALL) params.set("floor", debouncedFilters.floor)
        if (debouncedFilters.category !== ALL) params.set("category", debouncedFilters.category)
        if (debouncedFilters.q.trim()) params.set("q", debouncedFilters.q.trim())

        const baseParams = params.toString()
        const url = `/api/places${baseParams ? `?${baseParams}&limit=all` : "?limit=all"}`

        const response = await fetch(url, {
          signal: ctrl.signal,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
          throw new Error(errorData.error || `HTTP ${response.status}`)
        }

        const data = (await response.json()) as ApiResponse | Place[]

        if (Array.isArray(data)) {
          setPlaces(data)
        } else {
          if (data.error) {
            throw new Error(data.error)
          }

          setPlaces(data.places || [])
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return
        }

        setError(err instanceof Error ? err.message : "Failed to fetch places")
        setPlaces([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlaces()

    return () => {
      ctrl.abort()
    }
  }, [debouncedFilters])

  const handleClearFilters = () => {
    setFilters({ building: ALL, floor: ALL, category: ALL, q: "" })
    onChangeCategory(CATEGORY.ALL)
  }

  const onChangeCategory = useCallback(
    (next: CategoryFilter) => {
      const nextValue = categoryToQuery(next)
      const sp = new URLSearchParams(searchParams)
      if (nextValue === "all") sp.delete("cat")
      else sp.set("cat", nextValue)
      sp.delete("category")
      const target = sp.toString() ? `${pathname}?${sp.toString()}` : pathname
      startTransition(() => router.replace(target, { scroll: false }))
    },
    [pathname, router, searchParams],
  )

  const filteredPlaces = useMemo(
    () => places.filter((place) => matchCategory(selectedCategory, place.category)),
    [places, selectedCategory],
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Search Places</h1>
        <p className="text-muted-foreground">
          Find places on campus with instant search and filtering
        </p>
      </div>

      <SearchFilters
        value={filters}
        onChange={setFilters}
        loading={isLoading}
        onClear={handleClearFilters}
      />

      <div className="flex flex-wrap items-center gap-3">
        {[
          { slug: "food" as const },
          { slug: "important" as const },
          { slug: "exam" as const },
          { slug: "public" as const },
          { slug: "classroom" as const },
        ].map(({ slug }) => (
          <CategoryChip key={slug} slug={slug} href={{ pathname: "/search", query: { cat: slug } }} />
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {isLoading
              ? "Searching..."
              : `${filteredPlaces.length} place${filteredPlaces.length !== 1 ? "s" : ""} found`}
          </h2>
        </div>

        <PlacesList
          places={filteredPlaces}
          isLoading={isLoading}
          error={error}
          emptyMessage="No results for this filter."
        />
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  )
}
