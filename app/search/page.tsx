"use client"

import React, { useState, useEffect, useRef, Suspense, useMemo, useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { SearchFilters, type Filters } from "@/components/SearchFilters"
import { PlacesList } from "@/components/PlacesList"
import { useDebouncedValue } from "@/components/useDebouncedValue"
import { CategoryChips } from "@/components/CategoryChips"
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

const allowedCatParams = new Set(["exam", "food", "public", "all", null])

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
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>(CATEGORY.ALL)
  const normalizedRef = useRef(false)
  
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
  
  // Hydration tracking
  const hydrated = useRef(false)
  useEffect(() => { 
    hydrated.current = true 
  }, [])
  
  // On mount only, read window.location.search and initialize filters
  useEffect(() => {
    const params = searchParams
    const nextFilters: Filters = {
      building: params.get("building") ?? ALL,
      floor: params.get("floor") ?? ALL,
      category: params.get("category") ?? ALL,
      q: params.get("q") ?? "",
    }
    const catParam = params.get("cat")
    const nextCategory = categoryFromQuery(catParam)

    setFilters((prev) => (same(prev, nextFilters) ? prev : nextFilters))
    setCategoryFilter((prev) => (prev === nextCategory ? prev : nextCategory))

    if (!normalizedRef.current) {
      normalizedRef.current = true
      if (!allowedCatParams.has(catParam) && nextCategory !== CATEGORY.ALL) {
        const normalized = buildUrl(pathname, params, { cat: categoryToQuery(nextCategory) })
        router.replace(normalized, { scroll: false })
      }
    }
  }, [pathname, router, searchParams])
  
  // State → URL writer effect (skip first render and only write if the URL actually changes)
  useEffect(() => {
    if (!hydrated.current) return

    const currentCatParam = searchParams.get("cat")
    const desiredCatParam = categoryToQuery(categoryFilter)
    const shouldUpdateCat = desiredCatParam === "all" ? currentCatParam !== null : currentCatParam !== desiredCatParam

    const shouldUpdateFilters =
      filters.building !== ALL || filters.floor !== ALL || filters.category !== ALL || filters.q.trim() !== ""

    if (!shouldUpdateCat && !shouldUpdateFilters && searchParams.size === 0) {
      return
    }

    const currentParams = searchParams
    const patch: Record<string, string | null> = {
      building: filters.building !== ALL ? filters.building : null,
      floor: filters.floor !== ALL ? filters.floor : null,
      category: filters.category !== ALL ? filters.category : null,
      q: filters.q.trim() ? filters.q.trim() : null,
      cat: desiredCatParam === "all" ? null : desiredCatParam,
    }

    const nextUrl = buildUrl(pathname, currentParams, patch)
    const currentUrl = buildUrl(pathname, currentParams, {})
    if (nextUrl !== currentUrl) {
      router.replace(nextUrl, { scroll: false })
    }
  }, [filters, categoryFilter, pathname, router, searchParams])
  
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
        
        const url = `/api/places${params.toString() ? `?${params.toString()}` : ""}`
        
        const response = await fetch(url, {
          signal: ctrl.signal,
        })
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
          throw new Error(errorData.error || `HTTP ${response.status}`)
        }
        
        const data: ApiResponse = await response.json()
        
        if (data.error) {
          throw new Error(data.error)
        }
        
        setPlaces(data.places || [])
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          // Request was aborted, don't update state
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
  
  // Clear filters handler
  const handleClearFilters = () => {
    setFilters({ building: ALL, floor: ALL, category: ALL, q: "" })
    setCategoryFilter(CATEGORY.ALL)
  }

  const handleCategoryChange = useCallback((next: CategoryFilter) => {
    if (next !== categoryFilter) {
      setCategoryFilter(next)
    }
  }, [categoryFilter])

  const filteredPlaces = useMemo(
    () => places.filter((place) => matchCategory(categoryFilter, place.category)),
    [places, categoryFilter],
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

      <CategoryChips selected={categoryFilter} onChange={handleCategoryChange} />

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
