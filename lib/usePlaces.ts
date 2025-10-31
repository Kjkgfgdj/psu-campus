'use client'
import { useEffect, useState } from 'react'

export type Place = {
  id?: string
  name: string
  building: number | string
  floor: number | string
  category: string
  slug: string
  description?: string
  code?: string
  videoUrl?: string
  categorySlug?: string
}

// Cache with timestamp for auto-refresh
const cache: { data?: Place[]; timestamp?: number; initialLoadTime?: number } = {}
const INITIAL_REFRESH_INTERVAL = 5 * 1000 // 5 seconds for first 30 seconds
const INITIAL_PERIOD_DURATION = 30 * 1000 // 30 seconds
const NORMAL_REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutes after initial period

export function usePlaces() {
  const [data, setData] = useState<Place[] | null>(cache.data ?? null)
  const [loading, setLoading] = useState(!cache.data)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Track when the cache was first initialized
    if (!cache.initialLoadTime) {
      cache.initialLoadTime = Date.now()
    }

    // Fetch fresh data
    const fetchPlaces = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/places?limit=all', { cache: 'no-store' })
        const json = await res.json()
        const arr = Array.isArray(json) ? json : json?.places || []
        cache.data = arr as Place[]
        cache.timestamp = Date.now()
        setData(cache.data)
        setError(null)
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load places')
      } finally {
        setLoading(false)
      }
    }

    // Initial fetch
    fetchPlaces()

    let initialInterval: NodeJS.Timeout | null = null
    let normalInterval: NodeJS.Timeout | null = null

    // Determine if we're still in the initial 30-second period
    const timeElapsed = Date.now() - (cache.initialLoadTime || Date.now())
    const inInitialPeriod = timeElapsed < INITIAL_PERIOD_DURATION

    if (inInitialPeriod) {
      // Refresh every 5 seconds for the first 30 seconds
      initialInterval = setInterval(() => {
        fetchPlaces()
      }, INITIAL_REFRESH_INTERVAL)

      // After 30 seconds, switch to slower refresh rate
      const timeUntilNormalMode = INITIAL_PERIOD_DURATION - timeElapsed
      const switchTimeout = setTimeout(() => {
        if (initialInterval) clearInterval(initialInterval)
        
        // Start normal 5-minute refresh cycle
        normalInterval = setInterval(() => {
          fetchPlaces()
        }, NORMAL_REFRESH_INTERVAL)
      }, timeUntilNormalMode)

      return () => {
        clearTimeout(switchTimeout)
        if (initialInterval) clearInterval(initialInterval)
        if (normalInterval) clearInterval(normalInterval)
      }
    } else {
      // We're past the initial period, use normal refresh rate
      normalInterval = setInterval(() => {
        fetchPlaces()
      }, NORMAL_REFRESH_INTERVAL)

      return () => {
        if (normalInterval) clearInterval(normalInterval)
      }
    }
  }, [])

  return { data, loading, error }
}

