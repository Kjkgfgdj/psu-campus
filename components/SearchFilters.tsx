"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { BUILDING_FLOORS, FLOOR_LABEL } from "@/lib/floors"
import { CANONICAL_CATEGORIES } from "@/lib/categories"

export type Filters = { 
  building: string
  floor: string
  category: string
  q: string
}

export interface SearchFiltersProps {
  value: Filters
  onChange: (next: Filters) => void
  loading?: boolean
  onClear?: () => void
}

const BUILDINGS = Object.keys(BUILDING_FLOORS)
  .map((value) => ({ value, label: `Building ${value}` }))
  .sort((a, b) => Number(a.value) - Number(b.value))

function getFloorsForBuilding(building: string) {
  if (building && building !== "__all__" && BUILDING_FLOORS[Number(building)]) {
    return BUILDING_FLOORS[Number(building)]
  }
  const union = new Set<number>()
  Object.values(BUILDING_FLOORS).forEach((floors) => floors.forEach((floor) => union.add(floor)))
  return Array.from(union).sort((a, b) => a - b)
}

export function SearchFilters({
  value,
  onChange,
  loading = false,
  onClear,
}: SearchFiltersProps) {
  const hasActiveFilters = value.building !== "__all__" || value.floor !== "__all__" || value.category !== "__all__" || value.q.trim() !== ""

  const floorOptions = getFloorsForBuilding(value.building)

  const handleBuildingChange = (building: string) => {
    const nextFloors = getFloorsForBuilding(building)
    const nextFloor = building === "__all__" ? "__all__" : nextFloors.map(String).includes(value.floor) ? value.floor : "__all__"
    onChange({ ...value, building, floor: nextFloor })
  }

  const handleFloorChange = (floor: string) => {
    onChange({ ...value, floor })
  }

  const handleCategoryChange = (category: string) => {
    onChange({ ...value, category })
  }

  const handleQueryChange = (q: string) => {
    onChange({ ...value, q })
  }

  const handleClear = () => {
    if (onClear) {
      onClear()
    } else {
      onChange({ building: "__all__", floor: "__all__", category: "__all__", q: "" })
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Search Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="h-8 px-2 text-xs"
            disabled={loading}
          >
            <X className="h-3 w-3 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Query */}
        <div className="space-y-2">
          <label htmlFor="search-query" className="text-sm font-medium">Search</label>
          <Input
            id="search-query"
            type="text"
            placeholder="Search places..."
            value={value.q}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="w-full"
            disabled={loading}
          />
        </div>

        {/* Building Filter */}
        <div className="space-y-2">
          <label htmlFor="building-select" className="text-sm font-medium">Building</label>
          <Select value={value.building} onValueChange={handleBuildingChange} disabled={loading}>
            <SelectTrigger id="building-select">
              <SelectValue placeholder="All buildings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All buildings</SelectItem>
              {BUILDINGS.map((building) => (
                <SelectItem key={building.value} value={building.value}>
                  {building.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Floor Filter */}
        <div className="space-y-2">
          <label htmlFor="floor-select" className="text-sm font-medium">Floor</label>
          <Select value={value.floor} onValueChange={handleFloorChange} disabled={loading}>
            <SelectTrigger id="floor-select">
              <SelectValue placeholder="All floors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All floors</SelectItem>
              {floorOptions.map((floor) => (
                <SelectItem key={floor} value={String(floor)}>
                  Floor {FLOOR_LABEL[floor] ?? String(floor)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label htmlFor="category-select" className="text-sm font-medium">Category</label>
          <Select value={value.category} onValueChange={handleCategoryChange} disabled={loading}>
            <SelectTrigger id="category-select">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All categories</SelectItem>
              {CANONICAL_CATEGORIES.map((categoryName) => (
                <SelectItem key={categoryName} value={categoryName}>
                  {categoryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
