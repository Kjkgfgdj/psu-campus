"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

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

// These would ideally come from your data source or be configurable
const BUILDINGS = [
  { value: "105", label: "Building 105" },
  { value: "110", label: "Building 110" },
  { value: "115", label: "Building 115" },
  { value: "120", label: "Building 120" },
  { value: "125", label: "Building 125" },
]

const FLOORS = [
  { value: "0", label: "Ground Floor" },
  { value: "1", label: "1st Floor" }, 
  { value: "2", label: "2nd Floor" },
  { value: "3", label: "3rd Floor" },
  { value: "4", label: "4th Floor" },
  { value: "5", label: "5th Floor" },
  { value: "-1", label: "Basement" },
]

const CATEGORIES = [
  "Important places",
  "Classroom",
  "Laboratory", 
  "Office",
  "Study Space",
  "Recreation",
  "Dining",
  "Services",
  "Restroom",
  "Other"
]

export function SearchFilters({
  value,
  onChange,
  loading = false,
  onClear,
}: SearchFiltersProps) {
  const hasActiveFilters = value.building !== "__all__" || value.floor !== "__all__" || value.category !== "__all__" || value.q.trim() !== ""

  const handleBuildingChange = (building: string) => {
    onChange({ ...value, building })
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
              {FLOORS.map((floor) => (
                <SelectItem key={floor.value} value={floor.value}>
                  {floor.label}
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
              {CATEGORIES.map((categoryName) => (
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
