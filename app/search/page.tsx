"use client"

import React, { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, usePathname } from "next/navigation"
import { SearchFilters, type Filters } from "@/components/SearchFilters"
import { PlacesList } from "@/components/PlacesList"
import { useDebouncedValue } from "@/components/useDebouncedValue"

const ALL = "__all__"

const same = (a: Filters, b: Filters) =>
  a.building === b.building && a.floor === b.floor && a.category === b.category && a.q === b.q

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
    const params = new URLSearchParams(window.location.search)
    const next: Filters = {
      building: params.get("building") ?? ALL,
      floor: params.get("floor") ?? ALL,
      category: params.get("category") ?? ALL,
      q: params.get("q") ?? "",
    }
    setFilters(prev => (same(prev, next) ? prev : next))
  }, [])
  
  // State → URL writer effect (skip first render and only write if the URL actually changes)
  useEffect(() => {
    if (!hydrated.current) return

    const params = new URLSearchParams()
    if (filters.building !== ALL) params.set("building", filters.building)
    if (filters.floor !== ALL) params.set("floor", filters.floor)
    if (filters.category !== ALL) params.set("category", filters.category)
    if (filters.q.trim()) params.set("q", filters.q.trim())

    const newSearch = params.toString()
    const currentSearch = window.location.search.slice(1)
    if (newSearch !== currentSearch) {
      router.replace(`${pathname}${newSearch ? `?${newSearch}` : ""}`, { scroll: false })
    }
  }, [filters, pathname, router])
  
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
  }
  
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
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {isLoading ? "Searching..." : `${places.length} place${places.length !== 1 ? "s" : ""} found`}
          </h2>
        </div>
        
        <PlacesList
          places={places}
          isLoading={isLoading}
          error={error}
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
