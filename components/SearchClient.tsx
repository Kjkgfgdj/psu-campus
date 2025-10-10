"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { PlacesList } from "@/components/PlacesList"
import type { Place } from "@/lib/types"

export default function SearchClient({ places }: { places: Place[] }) {
  const sp = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [q, setQ] = useState(sp.get('q') ?? '')
  const [building, setBuilding] = useState<number | null>(sp.get('building') ? Number(sp.get('building')) : null)
  const [floor, setFloor] = useState<string | null>(sp.get('floor'))
  const cat = (sp.get('cat') ?? 'all').toLowerCase()

  useEffect(() => {
    const params = new URLSearchParams(sp.toString())
    if (q) params.set('q', q); else params.delete('q')
    if (building !== null) params.set('building', String(building)); else params.delete('building')
    if (floor) params.set('floor', String(floor)); else params.delete('floor')
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, building, floor])

  const buildingOptions = useMemo(
    () => Array.from(new Set(places.map(p => p.building))).sort((a,b) => a - b),
    [places]
  )
  const floorOptions = useMemo(
    () => Array.from(new Set(places.map(p => String(p.floor)))).sort((a,b) => a.localeCompare(b)),
    [places]
  )

  const filtered = useMemo(() => {
    const qNorm = q.trim().toLowerCase()
    return places.filter(p => {
      if (cat !== 'all' && (p as any).categorySlug !== cat) return false
      if (building !== null && p.building !== building) return false
      if (floor && String(p.floor).toLowerCase() !== floor.toLowerCase()) return false
      if (qNorm && !p.name.toLowerCase().includes(qNorm)) return false
      return true
    })
  }, [places, cat, building, floor, q])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Search Places</h1>
        <p className="text-muted-foreground">Find places on campus with instant search and filtering</p>
      </div>

      <div className="space-y-4 p-4 border rounded-lg bg-card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="search-query" className="text-sm font-medium">Search</label>
            <input id="search-query" type="text" placeholder="Search places..." value={q} onChange={(e) => setQ(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Building</label>
            <select value={building === null ? 'all' : String(building)} onChange={(e) => { const v = e.target.value; setBuilding(v === 'all' ? null : Number(v)); setFloor(null); }} className="w-full border rounded px-3 py-2">
              <option value="all">All buildings</option>
              {buildingOptions.map((b) => (
                <option key={b} value={String(b)}>{`Building ${b}`}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Floor</label>
            <select value={floor ?? 'all'} onChange={(e) => setFloor(e.target.value === 'all' ? null : e.target.value)} className="w-full border rounded px-3 py-2">
              <option value="all">All floors</option>
              {floorOptions.map((f) => (
                <option key={f} value={f}>{`Floor ${f}`}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <button onClick={() => { setQ(''); setBuilding(null); setFloor(null); }} className="text-sm underline">Clear filters</button>
        </div>
      </div>

      <PlacesList places={filtered} emptyMessage="No results for this filter." />
    </div>
  )
}


