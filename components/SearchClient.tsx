"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { PlacesList } from "@/components/PlacesList"
import { Chip } from "@/components/ui/Chip"
import type { Place } from "@/lib/types"
import { Search, X } from "lucide-react"
import { useDebouncedValue } from "@/components/useDebouncedValue"

type Props = {
  places?: Place[]
  isLoading?: boolean
  error?: string | null
}

const CAT_MAP: Record<string, string> = {
  food: "Food & drinks",
  important: "Important places",
  exam: "Popular exam places",
  public: "Public facilities",
  classroom: "Classroom",
}

function useAllPlaces() {
  const [data, setData] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/places?limit=all', { cache: 'no-store' })
        const json = await res.json()
        const arr: Place[] = Array.isArray(json) ? json : (json?.places ?? json?.records ?? [])
        if (alive) setData(arr ?? [])
      } catch (e) {
        if (alive) setErr((e as Error).message)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [])

  return { data, isLoading: loading, error: err }
}

function useQuerySync() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setParam = useCallback((key: string, value?: string) => {
    const sp = new URLSearchParams(searchParams?.toString())
    if (!value) sp.delete(key)
    else sp.set(key, value)
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false })
  }, [router, pathname, searchParams])

  const get = (k: string) => searchParams?.get(k) ?? undefined
  return { get, set: setParam }
}

export default function SearchClient({ places, isLoading, error }: Props) {
  const { data: fetchedPlaces, isLoading: loadingFetch, error: errorFetch } = useAllPlaces()
  const items = useMemo<Place[]>(() => places ?? fetchedPlaces ?? [], [places, fetchedPlaces])
  const safePlaces = useMemo<Place[]>(
    () => (Array.isArray(places) ? places : (Array.isArray(fetchedPlaces) ? fetchedPlaces : [])),
    [places, fetchedPlaces],
  )

  const { get, set } = useQuerySync()

  // URL-driven values
  const urlQParam = (get('q') ?? '').trim()
  const catParam = (get('cat') ?? '').toLowerCase()
  const buildingParam = get('building') ?? ''
  const floorParam = get('floor') ?? ''

  const activeCategoryLabel = CAT_MAP[catParam] ?? ''
  
  // Local state for instant typing
  const [searchQuery, setSearchQuery] = useState(urlQParam)
  
  // Debounce the search query to prevent lag while typing
  const debouncedQuery = useDebouncedValue(searchQuery, 400)
  
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(
    buildingParam ? (Number.isFinite(Number(buildingParam)) ? Number(buildingParam) : null) : null,
  )
  const [selectedFloor, setSelectedFloor] = useState<number | null>(
    floorParam !== '' ? (Number.isFinite(Number(floorParam)) ? Number(floorParam) : null) : null,
  )

  // Sync debounced query to URL
  useEffect(() => {
    set('q', debouncedQuery || undefined)
  }, [debouncedQuery, set])

  // Sync URL changes back to local state (e.g., browser back/forward)
  useEffect(() => {
    setSearchQuery(urlQParam)
  }, [urlQParam])

  // Keep local controlled state in sync with URL when it changes externally
  useEffect(() => {
    const b = buildingParam ? Number(buildingParam) : NaN
    setSelectedBuilding(Number.isFinite(b) ? b : null)
  }, [buildingParam])

  useEffect(() => {
    const f = floorParam !== '' ? Number(floorParam) : NaN
    setSelectedFloor(Number.isFinite(f) ? f : null)
  }, [floorParam])

  // Helper to compute place slug from either slug or label
  const toSlug = useCallback((p: Place): string => {
    const raw = String((p as any).category ?? '').toLowerCase()
    if (raw in CAT_MAP) return raw
    for (const [slug, label] of Object.entries(CAT_MAP)) {
      if (String((p as any).category ?? '').toLowerCase() === label.toLowerCase()) return slug
    }
    return ''
  }, [])

  const buildingOptions = useMemo(() => {
    if (!safePlaces.length) return [] as number[]
    const uniq = Array.from(
      new Set(
        safePlaces
          .map((p) => Number((p as any)?.building))
          .filter((n) => Number.isFinite(n) && n > 0),
      ),
    ) as number[]
    return uniq.sort((a, b) => a - b)
  }, [safePlaces])

  const floorOptions = useMemo(() => {
    if (!safePlaces.length) return [] as string[]
    const uniqNums = Array.from(
      new Set(
        safePlaces
          .map((p) => Number((p as any)?.floor))
          .filter((n) => Number.isFinite(n)),
      ),
    ) as number[]
    uniqNums.sort((a, b) => a - b)
    return uniqNums.map((n) => String(n))
  }, [safePlaces])

  const filtered = useMemo(() => {
    let next = items

    // 1) Category by slug
    if (catParam) {
      next = next.filter((p) => toSlug(p) === catParam)
    }

    // 2) Building
    if (selectedBuilding !== null && Number.isFinite(selectedBuilding)) {
      next = next.filter(p => Number(p.building) === selectedBuilding)
    }

    // 3) Floor (0 means G)
    if (selectedFloor !== null && Number.isFinite(selectedFloor)) {
      next = next.filter(p => Number(p.floor) === selectedFloor)
    }

    // 4) Name-only q (use debounced query for smooth filtering)
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase()
      next = next.filter(p => (p.name ?? '').toLowerCase().includes(q))
    }

    return next
  }, [items, catParam, selectedBuilding, selectedFloor, debouncedQuery, toSlug])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Premium Search Header */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-lg">
        <div className="container mx-auto max-w-7xl px-6 py-6">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-lg opacity-20"></div>
            
            <div className="relative flex items-center gap-3 bg-white rounded-2xl shadow-xl ring-2 ring-slate-200/50 px-6 py-4">
              <Search className="h-6 w-6 text-green-600" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-lg font-medium text-slate-900 placeholder-slate-500 focus:outline-none bg-transparent"
                placeholder="Search places..."
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4 text-slate-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="space-y-8">
          {/* Filters Panel - Premium Design */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600/10 to-emerald-600/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            
            <div className="relative rounded-3xl border-2 border-slate-200 bg-white shadow-lg p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    Building
                  </label>
                  <select
                    value={selectedBuilding === null ? '' : String(selectedBuilding)}
                    onChange={(e) => {
                      const v = e.target.value
                      const n = v === '' ? null : Number(v)
                      setSelectedBuilding(n)
                      set('building', v || undefined)
                      setSelectedFloor(null)
                      set('floor', undefined)
                    }}
                    className="w-full rounded-xl border-2 border-slate-200 px-5 py-3.5 text-base font-medium focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all bg-white hover:border-green-300 shadow-sm"
                  >
                    <option value="">All buildings</option>
                    {buildingOptions.map(b => (
                      <option key={b} value={String(b)}>{`Building ${b}`}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    Floor
                  </label>
                  <select
                    value={selectedFloor === null ? '' : String(selectedFloor)}
                    onChange={(e) => {
                      const v = e.target.value
                      const n = v === '' ? null : Number(v)
                      setSelectedFloor(n)
                      set('floor', v || undefined)
                    }}
                    className="w-full rounded-xl border-2 border-slate-200 px-5 py-3.5 text-base font-medium focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-600 transition-all bg-white hover:border-green-300 shadow-sm"
                  >
                    <option value="">All floors</option>
                    {floorOptions.map(v => {
                      const label = v === '0' ? 'Floor G' : `Floor ${v}`
                      return (
                        <option key={v} value={v}>{label}</option>
                      )
                    })}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Category Pills - Modern Design */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold text-slate-700">Categories:</span>
            <Chip active={!catParam} label="All categories" onClick={() => { set('cat', undefined); set('building', undefined); set('floor', undefined); }} />
            <Chip active={catParam === 'food'} label="Food & drinks" onClick={() => { set('cat', 'food'); set('building', undefined); set('floor', undefined); }} />
            <Chip active={catParam === 'important'} label="Important places" onClick={() => { set('cat', 'important'); set('building', undefined); set('floor', undefined); }} />
            <Chip active={catParam === 'exam'} label="Popular exam places" onClick={() => { set('cat', 'exam'); set('building', undefined); set('floor', undefined); }} />
            <Chip active={catParam === 'public'} label="Public facilities" onClick={() => { set('cat', 'public'); set('building', undefined); set('floor', undefined); }} />
            <Chip active={catParam === 'classroom'} label="Classroom" onClick={() => { set('cat', 'classroom'); set('building', undefined); set('floor', undefined); }} />
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {filtered.length} {filtered.length === 1 ? 'Place' : 'Places'} Found
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {catParam ? `Showing ${CAT_MAP[catParam] || 'all'} locations` : 'Showing all campus locations'}
              </p>
            </div>
          </div>

          {/* Results */}
          <PlacesList places={filtered} isLoading={isLoading ?? loadingFetch} error={error ?? errorFetch} emptyMessage="No results for this filter." />
        </div>
      </div>
    </div>
  )
}
