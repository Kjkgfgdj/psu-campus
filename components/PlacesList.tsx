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
    <Card className="animate-pulse rounded-3xl border-2 border-slate-200 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <CardHeader className="p-0">
          <div className="h-7 bg-slate-300/60 rounded-lg w-3/4 mb-4"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-slate-300/60 rounded-lg w-20"></div>
            <div className="h-6 bg-slate-300/60 rounded-lg w-16"></div>
            <div className="h-6 bg-slate-300/60 rounded-lg w-24"></div>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <div className="space-y-3">
            <div className="h-4 bg-slate-300/60 rounded-lg w-full"></div>
            <div className="h-4 bg-slate-300/60 rounded-lg w-4/5"></div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

function PlaceCard({ place }: { place: Place }) {
  const [showVideo, setShowVideo] = useState(false)

  const videoUrl = place.videoUrl ?? ""
  const hasVideo = videoUrl.trim() !== ""
  
  const deepLinkUrl = `/buildings/${place.building}?floor=${place.floor}${place.slug ? `&slug=${place.slug}` : ""}`;

  return (
    <div className="group">
      <div className="relative">
        {/* Glow on hover */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur opacity-0 group-hover:opacity-25 transition duration-500"></div>
        
        <Link href={deepLinkUrl} className="block">
          <Card className="relative card transition-all duration-500 hover:shadow-2xl cursor-pointer border-2 border-slate-200 hover:border-green-500 bg-white group-hover:scale-[1.03] rounded-3xl overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/0 via-emerald-50/0 to-green-50/0 group-hover:from-green-50/30 group-hover:via-emerald-50/20 group-hover:to-green-50/30 transition-all duration-500"></div>
            
            <CardHeader className="relative pb-4">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="card-title clamp-2 text-xl font-bold text-slate-900 group-hover:text-green-700 transition-colors leading-tight flex-1">
                  {place.name}
                </CardTitle>
                <svg className="h-5 w-5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-green-600 group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            
              <div className="wrap-row mt-3">
                {place.building && (
                  <Badge variant="secondary" className="text-xs font-semibold rounded-lg px-3 py-1.5 bg-green-50 text-green-700 border border-green-200">
                    Building {place.building}
                  </Badge>
                )}
                {place.floor !== undefined && (
                  <Badge variant="outline" className="text-xs font-semibold rounded-lg px-3 py-1.5 border-blue-200 bg-blue-50 text-blue-700">
                    Floor {place.floor === 0 ? 'G' : place.floor}
                  </Badge>
                )}
                {place.category && (() => {
                  const slug = toCatSlug(String(place.category))
                  return slug ? <CategoryChip slug={slug} size="sm" className="!px-3 !py-1.5 !font-semibold" /> : null
                })()}
              </div>
            </CardHeader>

            <CardContent className="relative space-y-4">
              {place.description && (
                <p className="text-sm text-slate-600 leading-relaxed clamp-2">
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
      </div>
    </div>
  )
}

export function PlacesList({ places, isLoading, error, emptyMessage }: PlacesListProps) {
  if (error) {
    return (
      <div className="relative">
        <div className="absolute -inset-0.5 bg-red-600/20 rounded-3xl blur"></div>
        <Card className="relative border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl shadow-xl">
          <CardContent className="flex items-center gap-4 p-8">
            <div className="bg-red-100 p-3 rounded-2xl">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-red-900 text-lg">Error loading places</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
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
      <div className="relative">
        <div className="absolute -inset-0.5 bg-slate-300/20 rounded-3xl blur"></div>
        <Card className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl border-2 border-slate-200 shadow-xl">
          <CardContent className="flex flex-col items-center justify-center p-16 text-center">
            <div className="relative mb-6">
              <div className="absolute -inset-2 bg-slate-300/30 rounded-full blur-lg"></div>
              <div className="relative rounded-full bg-white p-5 shadow-lg ring-2 ring-slate-200">
                <AlertCircle className="h-10 w-10 text-slate-400" />
              </div>
            </div>
            <h3 className="font-bold text-2xl mb-3 text-slate-900">No places found</h3>
            <p className="text-slate-600 text-lg max-w-md">
              {emptyMessage ?? "Try adjusting your search filters or search terms."}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  )
}
