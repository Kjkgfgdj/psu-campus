"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { PlacesList } from "@/components/PlacesList"
import { Chip } from "@/components/ui/Chip"
import type { Place } from "@/lib/types"
import { Search } from "lucide-react"

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
  const qParam = (get('q') ?? '').trim()
  const catParam = (get('cat') ?? '').toLowerCase()
  const buildingParam = get('building') ?? ''
  const floorParam = get('floor') ?? ''

  const activeCategoryLabel = CAT_MAP[catParam] ?? ''
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(
    buildingParam ? (Number.isFinite(Number(buildingParam)) ? Number(buildingParam) : null) : null,
  )
  const [selectedFloor, setSelectedFloor] = useState<number | null>(
    floorParam !== '' ? (Number.isFinite(Number(floorParam)) ? Number(floorParam) : null) : null,
  )

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

    // 4) Name-only q
    if (qParam) {
      const q = qParam.toLowerCase()
      next = next.filter(p => (p.name ?? '').toLowerCase().includes(q))
    }

    return next
  }, [items, catParam, selectedBuilding, selectedFloor, qParam, toSlug])

  return (
    <div className="py-8">
      {/* Sticky Search Bar */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm -mx-4 px-4 py-4 mb-8">
        <div className="container mx-auto max-w-[1120px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              value={qParam}
              onChange={(e) => set('q', e.target.value || undefined)}
              className="w-full rounded-full border border-slate-200 pl-12 pr-4 text-base shadow-sm transition-all focus:outline-none"
              style={{
                height: '52px',
                outline: qParam ? '2px solid color-mix(in oklab, #16A34A 60%, white)' : undefined
              }}
              placeholder="Search places..."
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-[1120px] px-4">
        <div className="space-y-6">
          {/* Filters Panel */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-900 mb-2 block">Building</label>
                <select
                  value={selectedBuilding === null ? '' : String(selectedBuilding)}
                  onChange={(e) => {
                    const v = e.target.value
                    const n = v === '' ? null : Number(v)
                    setSelectedBuilding(n)
                    set('building', v || undefined)
                    // reset floor when building changes
                    setSelectedFloor(null)
                    set('floor', undefined)
                  }}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600 transition-all bg-white"
                >
                  <option value="">All buildings</option>
                  {buildingOptions.map(b => (
                    <option key={b} value={String(b)}>{`Building ${b}`}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-900 mb-2 block">Floor</label>
                <select
                  value={selectedFloor === null ? '' : String(selectedFloor)}
                  onChange={(e) => {
                    const v = e.target.value
                    const n = v === '' ? null : Number(v)
                    setSelectedFloor(n)
                    set('floor', v || undefined)
                  }}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600 transition-all bg-white"
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

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2">
            <Chip active={!catParam} label="All categories" onClick={() => { set('cat', undefined); set('building', undefined); set('floor', undefined); }} />
            <Chip active={catParam === 'food'} label="Food & drinks" onClick={() => { set('cat', 'food'); set('building', undefined); set('floor', undefined); }} />
            <Chip active={catParam === 'important'} label="Important places" onClick={() => { set('cat', 'important'); set('building', undefined); set('floor', undefined); }} />
            <Chip active={catParam === 'exam'} label="Popular exam places" onClick={() => { set('cat', 'exam'); set('building', undefined); set('floor', undefined); }} />
            <Chip active={catParam === 'public'} label="Public facilities" onClick={() => { set('cat', 'public'); set('building', undefined); set('floor', undefined); }} />
            <Chip active={catParam === 'classroom'} label="Classroom" onClick={() => { set('cat', 'classroom'); set('building', undefined); set('floor', undefined); }} />
          </div>

          {/* Results */}
          <PlacesList places={filtered} isLoading={isLoading ?? loadingFetch} error={error ?? errorFetch} emptyMessage="No results for this filter." />
        </div>
      </div>
    </div>
  )
}
