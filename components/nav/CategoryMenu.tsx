'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { usePlaces, Place } from '@/lib/usePlaces'
import { normalizeCategory, CATEGORY_LABEL, CATEGORY_SLUGS } from '@/lib/categories'

type CatKey = 'exam' | 'food' | 'public' | 'important' | 'classroom'

const CATS: { key: CatKey; label: string; labelUpper: string; href: string }[] = [
  { key: 'exam', label: 'Popular exam places', labelUpper: 'POPULAR EXAM PLACES', href: '/search?cat=exam' },
  { key: 'food', label: 'Food & drinks', labelUpper: 'FOOD & DRINKS', href: '/search?cat=food' },
  { key: 'public', label: 'Public facilities', labelUpper: 'PUBLIC FACILITIES', href: '/search?cat=public' },
  { key: 'important', label: 'Important places', labelUpper: 'IMPORTANT PLACES', href: '/search?cat=important' },
  { key: 'classroom', label: 'Classroom', labelUpper: 'CLASSROOM', href: '/search?cat=classroom' },
]

export function CategoryMenu() {
  const { data: places } = usePlaces()
  const [openMenu, setOpenMenu] = useState<CatKey | null>(null)

  // Group places by category
  const placesByCategory = useMemo(() => {
    if (!places) return {}
    const grouped: Record<string, Place[]> = {}
    for (const place of places) {
      const cat = normalizeCategory(place.category)
      const key = CATEGORY_SLUGS.find((slug) => CATEGORY_LABEL[slug] === cat)
      if (key) {
        if (!grouped[key]) grouped[key] = []
        grouped[key].push(place)
      }
    }
    return grouped
  }, [places])

  return (
    <nav className="flex items-center gap-3">
      {CATS.map((cat) => {
        const isOpen = openMenu === cat.key
        const categoryPlaces = placesByCategory[cat.key] || []
        const count = categoryPlaces.length

        return (
          <div
            key={cat.key}
            className="relative"
            onMouseEnter={() => setOpenMenu(cat.key)}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 hover:text-slate-900"
            >
              {cat.label}
              <svg
                className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <div className="absolute left-0 top-full z-50 pt-2 w-80">
                <div className="rounded-xl border border-slate-200 bg-white shadow-lg">
                  {/* Category header */}
                  <div className="border-b border-slate-100 px-4 py-3">
                    <h3 className="text-xs font-bold text-green-700 uppercase tracking-wide">{cat.labelUpper}</h3>
                  </div>

                  {/* Places list */}
                  <div className="max-h-96 overflow-y-auto py-2">
                    {categoryPlaces.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-slate-500">No places found</div>
                    ) : (
                      categoryPlaces.map((place) => (
                        <Link
                          key={place.id || place.slug}
                          href={`/buildings/${place.building}?floor=${place.floor}&highlight=${place.slug}`}
                          className="block px-4 py-3 transition-colors hover:bg-slate-50"
                        >
                          <div className="mb-2 font-medium text-slate-900">{place.name}</div>
                          <div className="flex flex-wrap gap-1.5">
                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              Bldg {place.building}
                            </span>
                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                              Floor {place.floor}
                            </span>
                            <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/20">
                              {normalizeCategory(place.category)}
                            </span>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>

                  {/* See all link */}
                  {count > 0 && (
                    <div className="border-t border-slate-100 px-4 py-3 text-center">
                      <Link
                        href={cat.href}
                        className="text-sm font-medium text-green-700 transition-colors hover:text-green-800"
                      >
                        See all {count > 2 ? count : ''} →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}

