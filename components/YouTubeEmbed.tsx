"use client"

import { extractYouTubeId } from "@/lib/youtube"

interface YouTubeEmbedProps {
  url: string
  title?: string
  className?: string
}

export function YouTubeEmbed({ url, title = "YouTube video", className = "" }: YouTubeEmbedProps) {
  const videoId = extractYouTubeId(url)

  if (!videoId) {
    return (
      <div className={`aspect-video bg-muted rounded-md flex items-center justify-center text-muted-foreground ${className}`}>
        <p>Invalid YouTube URL</p>
      </div>
    )
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`

  return (
    <div className={`aspect-video ${className}`}>
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        className="w-full h-full rounded-md"
      />
    </div>
  )
}
