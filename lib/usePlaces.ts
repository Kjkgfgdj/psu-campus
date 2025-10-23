'use client'
import { useEffect, useState } from 'react'

export type Place = {
  id?: string
  name: string
  building: number | string
  floor: number | string
  category: string
  slug: string
}

// simple in-memory cache so we fetch /api/places once
const cache: { data?: Place[] } = {}

export function usePlaces() {
  const [data, setData] = useState<Place[] | null>(cache.data ?? null)
  const [loading, setLoading] = useState(!cache.data)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (cache.data) return
    ;(async () => {
      try {
        const res = await fetch('/api/places?limit=all', { cache: 'no-store' })
        const json = await res.json()
        const arr = Array.isArray(json) ? json : json?.places || []
        cache.data = arr as Place[]
        setData(cache.data)
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load places')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return { data, loading, error }
}

