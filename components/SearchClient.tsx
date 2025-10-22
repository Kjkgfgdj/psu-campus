"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { PlacesList } from "@/components/PlacesList"
import type { Place } from "@/lib/types"

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
    <div className="space-y-6">
      <div className="rounded-2xl border-2 border-amber-200 bg-white shadow-xl p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <div className="text-sm font-semibold text-amber-900 mb-2">Search</div>
            <input
              value={qParam}
              onChange={(e) => set('q', e.target.value || undefined)}
              className="w-full rounded-xl border-2 border-amber-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400 transition-all"
              placeholder="Search places..."
            />
          </div>

          <div>
            <div className="text-sm font-semibold text-amber-900 mb-2">Building</div>
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
              className="w-full rounded-xl border-2 border-amber-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400 transition-all bg-white"
            >
              <option value="">All buildings</option>
              {buildingOptions.map(b => (
                <option key={b} value={String(b)}>{`Building ${b}`}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="text-sm font-semibold text-amber-900 mb-2">Floor</div>
            <select
              value={selectedFloor === null ? '' : String(selectedFloor)}
              onChange={(e) => {
                const v = e.target.value
                const n = v === '' ? null : Number(v)
                setSelectedFloor(n)
                set('floor', v || undefined)
              }}
              className="w-full rounded-xl border-2 border-amber-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400 transition-all bg-white"
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

      <div className="flex flex-wrap gap-3">
        <Chip active={!catParam} label="All categories" onClick={() => { set('cat', undefined); set('building', undefined); set('floor', undefined); }} />
        <Chip active={catParam === 'food'} label="Food & drinks" color="green" onClick={() => { set('cat', 'food'); set('building', undefined); set('floor', undefined); }} />
        <Chip active={catParam === 'important'} label="Important places" color="red" onClick={() => { set('cat', 'important'); set('building', undefined); set('floor', undefined); }} />
        <Chip active={catParam === 'exam'} label="Popular exam places" color="sky" onClick={() => { set('cat', 'exam'); set('building', undefined); set('floor', undefined); }} />
        <Chip active={catParam === 'public'} label="Public facilities" color="blue" onClick={() => { set('cat', 'public'); set('building', undefined); set('floor', undefined); }} />
        <Chip active={catParam === 'classroom'} label="Classroom" color="amber" onClick={() => { set('cat', 'classroom'); set('building', undefined); set('floor', undefined); }} />
      </div>

      <PlacesList places={filtered} isLoading={isLoading ?? loadingFetch} error={error ?? errorFetch} emptyMessage="No results for this filter." />
    </div>
  )
}

function Chip({ active, label, onClick, color = 'neutral' }: { active?: boolean; label: string; onClick: () => void; color?: 'green' | 'red' | 'sky' | 'blue' | 'amber' | 'neutral' }) {
  const colorMap: Record<string, string> = {
    green: 'bg-amber-100 text-amber-900 shadow-md font-medium',
    red: 'bg-amber-100 text-amber-900 shadow-md font-medium',
    sky: 'bg-amber-100 text-amber-900 shadow-md font-medium',
    blue: 'bg-amber-100 text-amber-900 shadow-md font-medium',
    amber: 'bg-amber-100 text-amber-900 shadow-md font-medium',
    neutral: 'bg-amber-100 text-amber-900 shadow-md font-medium',
  }
  const inactive = 'bg-white text-slate-700 hover:bg-amber-50 border-2 border-amber-200'
  return (
    <button type="button" onClick={onClick} className={`rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105 ${active ? colorMap[color] : inactive}`}>
      {label}
    </button>
  )
}


