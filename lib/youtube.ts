/**
 * Normalizes YouTube URLs to standard watch format
 * Converts:
 * - youtube.com/shorts/VIDEO_ID → youtube.com/watch?v=VIDEO_ID
 * - youtu.be/VIDEO_ID → youtube.com/watch?v=VIDEO_ID
 * Removes query parameters like ?feature=share
 */
export function normalizeYouTubeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return url
  }

  const cleanUrl = url.trim()
  
  // Extract video ID from any YouTube format
  const videoId = extractYouTubeId(cleanUrl)
  
  // If we found a video ID, return standard watch URL
  if (videoId) {
    return `https://www.youtube.com/watch?v=${videoId}`
  }
  
  // If not a YouTube URL or no ID found, return original
  return cleanUrl
}

/**
 * Extracts YouTube video ID from various YouTube URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - And more variations
 */
export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null
  }

  // Remove any whitespace
  const cleanUrl = url.trim()

  // Regular expressions for different YouTube URL formats
  const patterns = [
    // Standard watch URLs: youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/(?:[^\/]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    // Shorts URLs: youtube.com/shorts/VIDEO_ID
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    // Embed URLs: youtube.com/embed/VIDEO_ID
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  // If no pattern matches, check if the string itself is a valid YouTube ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    return cleanUrl
  }

  return null
}

/**
 * Validates if a string is a valid YouTube video ID
 */
export function isValidYouTubeId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{11}$/.test(id)
}

/**
 * Creates a YouTube embed URL from a video ID
 */
export function createYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`
}

/**
 * Creates a YouTube thumbnail URL from a video ID
 */
export function createYouTubeThumbnailUrl(videoId: string, quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'medium'): string {
  const qualityMap = {
    default: 'default.jpg',
    medium: 'mqdefault.jpg', 
    high: 'hqdefault.jpg',
    standard: 'sddefault.jpg',
    maxres: 'maxresdefault.jpg'
  }
  
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}`
}
