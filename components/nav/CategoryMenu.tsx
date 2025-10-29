'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { usePlaces, Place } from '@/lib/usePlaces'
import { normalizeCategory, CATEGORY_LABEL, CATEGORY_SLUGS, badgeClasses } from '@/lib/categories'
import { cn } from '@/lib/utils'

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
              className="relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-300 transition-all duration-300 hover:bg-white/10 hover:text-white hover:shadow-lg hover:shadow-green-600/20 group overflow-hidden"
            >
              {/* Hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <span className="relative">{cat.label}</span>
              <svg
                className={`relative h-4 w-4 transition-all duration-300 ${isOpen ? 'rotate-180 text-green-400' : 'group-hover:text-green-400'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <div className="absolute left-0 top-full z-50 pt-2 w-80">
                <div className="rounded-2xl border-2 border-slate-200 bg-white shadow-2xl ring-1 ring-black/5 backdrop-blur-xl overflow-hidden">
                  {/* Category header */}
                  <div className="border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50 px-5 py-4 rounded-t-2xl">
                    <h3 className="text-xs font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent uppercase tracking-wider">{cat.labelUpper}</h3>
                  </div>

                  {/* Places list */}
                  <div className="max-h-96 overflow-y-auto overflow-x-hidden">
                    {categoryPlaces.length === 0 ? (
                      <div className="px-5 py-8 text-center text-sm text-slate-500">No places found</div>
                    ) : (
                      categoryPlaces.map((place, index) => {
                        const isFirst = index === 0;
                        const isLast = index === categoryPlaces.length - 1;
                        
                        return (
                          <Link
                            key={place.id || place.slug}
                            href={`/buildings/${place.building}?floor=${place.floor}&slug=${place.slug}&autoOpen=true`}
                            onClick={() => setOpenMenu(null)}
                            className={cn(
                              "group relative block px-5 py-4 transition-all duration-200 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50",
                              isFirst && "rounded-t-2xl",
                              isLast && "rounded-b-2xl"
                            )}
                          >
                            {/* Green accent bar on hover */}
                            <div className={cn(
                              "absolute left-1 top-2 bottom-2 w-1 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            )}></div>
                            
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-slate-900 group-hover:text-green-700 transition-colors mb-2">
                                  {place.name}
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  <span className="inline-flex items-center rounded-lg bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
                                    Bldg {place.building}
                                  </span>
                                  <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
                                    Floor {place.floor}
                                  </span>
                                  <span className={cn(
                                    "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
                                    badgeClasses(place.category)
                                  )}>
                                    {normalizeCategory(place.category)}
                                  </span>
                                </div>
                              </div>
                              <svg className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-green-600 group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </Link>
                        );
                      })
                    )}
                  </div>

                  {/* See all link */}
                  {count > 0 && (
                    <div className="border-t border-slate-200 bg-gradient-to-r from-slate-50 to-green-50/30 px-5 py-4 rounded-b-2xl">
                      <Link
                        href={cat.href}
                        className="group inline-flex items-center gap-2 text-sm font-bold text-green-700 hover:text-green-800 transition-all w-full justify-center"
                      >
                        See all {count > 2 ? count : ''} results
                        <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
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

