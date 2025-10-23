"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import CategoryChip, { toCatSlug } from "@/components/CategoryChip"
import type { Place } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { YouTubeEmbed } from "@/components/YouTubeEmbed"
import { Play, X, AlertCircle } from "lucide-react"

type PlacesListProps = {
  places: Place[]
  isLoading?: boolean
  error?: string | null
  emptyMessage?: string
}

function PlaceSkeleton() {
  return (
    <Card className="animate-pulse rounded-2xl border-slate-200">
      <CardHeader>
        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
        <div className="flex gap-2 mt-2">
          <div className="h-5 bg-slate-200 rounded w-16"></div>
          <div className="h-5 bg-slate-200 rounded w-12"></div>
          <div className="h-5 bg-slate-200 rounded w-20"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
        </div>
      </CardContent>
    </Card>
  )
}

function PlaceCard({ place }: { place: Place }) {
  const [showVideo, setShowVideo] = useState(false)

  const videoUrl = place.videoUrl ?? ""
  const hasVideo = videoUrl.trim() !== ""
  
  const deepLinkUrl = `/buildings/${place.building}?floor=${place.floor}${place.slug ? `&slug=${place.slug}` : ""}`;

  return (
    <Link href={deepLinkUrl} className="block group">
      <Card className="card transition-all hover:shadow-lg cursor-pointer border border-slate-200 hover:border-green-600 bg-white group-hover:scale-[1.02] rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="card-title clamp-2 text-lg font-semibold text-slate-900 group-hover:text-green-600">
            {place.name}
          </CardTitle>
        
        <div className="wrap-row mt-2">
          {place.building && (
            <Badge variant="secondary" className="text-xs rounded-full">
              Building {place.building}
            </Badge>
          )}
          {place.floor && (
            <Badge variant="outline" className="text-xs rounded-full">
              Floor {place.floor}
            </Badge>
          )}
          {place.category && (() => {
            const slug = toCatSlug(String(place.category))
            return slug ? <CategoryChip slug={slug} size="sm" className="!px-3 !py-1" /> : null
          })()}
          {place.slug && (
            <span className="slug-badge text-xs">
              {place.slug}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {place.description && (
          <p className="text-sm text-slate-600 leading-relaxed clamp-3">
            {place.description}
          </p>
        )}

        {hasVideo && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-900">Video</span>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowVideo(!showVideo);
                }}
                className="h-8 px-3 text-xs rounded-full"
              >
                {showVideo ? (
                  <>
                    <X className="h-3 w-3 mr-1" />
                    Hide video
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 mr-1" />
                    Show video
                  </>
                )}
              </Button>
            </div>

            {showVideo && (
              <div className="mt-3">
                <YouTubeEmbed
                  url={videoUrl}
                  title={`Video for ${place.name}`}
                  className="rounded-xl overflow-hidden"
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
    </Link>
  )
}

export function PlacesList({ places, isLoading, error, emptyMessage }: PlacesListProps) {
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50/50 rounded-2xl">
        <CardContent className="flex items-center gap-3 p-6">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900">Error loading places</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <PlaceSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (places.length === 0) {
    return (
      <Card className="bg-slate-50 rounded-2xl border-slate-200">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="rounded-full bg-slate-200 p-3 mb-4">
            <AlertCircle className="h-6 w-6 text-slate-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2 text-slate-900">No places found</h3>
          <p className="text-slate-600">
            {emptyMessage ?? "Try adjusting your search filters or search terms."}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  )
}
