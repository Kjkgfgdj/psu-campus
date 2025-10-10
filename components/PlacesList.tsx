"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import CategoryChip, { toCatSlug } from "@/components/CategoryChip"
import { Button } from "@/components/ui/button"
import { YouTubeEmbed } from "@/components/YouTubeEmbed"
import { Play, X, AlertCircle } from "lucide-react"

interface Place {
  id: string
  name: string
  building: number
  floor: number
  category: string
  description: string
  videoUrl: string
  x: number
  y: number
  slug: string
}

interface PlacesListProps {
  places: Place[]
  isLoading: boolean
  error: string | null
  emptyMessage?: string
}

function PlaceSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-6 bg-muted rounded w-3/4"></div>
        <div className="flex gap-2 mt-2">
          <div className="h-5 bg-muted rounded w-16"></div>
          <div className="h-5 bg-muted rounded w-12"></div>
          <div className="h-5 bg-muted rounded w-20"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
      </CardContent>
    </Card>
  )
}

function PlaceCard({ place }: { place: Place }) {
  const [showVideo, setShowVideo] = useState(false)

  const hasVideo = place.videoUrl && place.videoUrl.trim() !== ""
  
  const deepLinkUrl = `/buildings/${place.building}?floor=${place.floor}${place.slug ? `&slug=${place.slug}` : ""}`;

  const FOOD_CATEGORIES = ["Food & drinks", "Food", "Cafe", "Café", "Restaurant"]

  return (
    <Link href={deepLinkUrl} className="block">
      <Card className="transition-shadow hover:shadow-md cursor-pointer">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">
            {place.name}
          </CardTitle>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {place.building && (
            <Badge variant="secondary" className="text-xs">
              Building {place.building}
            </Badge>
          )}
          {place.floor && (
            <Badge variant="outline" className="text-xs">
              Floor {place.floor}
            </Badge>
          )}
          {place.category && (() => {
            const slug = toCatSlug(place.category)
            return slug ? <CategoryChip slug={slug} size="sm" className="!px-3 !py-1" /> : null
          })()}
          {place.slug && (
            <Badge variant="secondary" className="text-xs font-mono">
              {place.slug}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {place.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {place.description}
          </p>
        )}

        {hasVideo && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Video</span>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowVideo(!showVideo);
                }}
                className="h-8 px-3 text-xs"
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
                  url={place.videoUrl}
                  title={`Video for ${place.name}`}
                  className="rounded-md"
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
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="flex items-center gap-3 p-6">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div>
            <h3 className="font-semibold text-destructive">Error loading places</h3>
            <p className="text-sm text-destructive/80 mt-1">{error}</p>
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
      <Card className="bg-muted/30">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <AlertCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No places found</h3>
          <p className="text-muted-foreground">
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
