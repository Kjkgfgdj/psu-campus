import { LABELS } from "./labels";
import type { Place } from "./types";

/**
 * Get the zone ID and label for a place
 * This searches through the LABELS to find which zone this place belongs to
 */
export function getZoneForPlace(place: Place): { zoneId: string; label: string } | null {
  if (!place) return null;

  const building = String(place.building);
  const floor = String(place.floor);
  const placeSlug = place.slug?.toLowerCase() || "";
  const placeName = place.name?.toLowerCase() || "";
  const placeId = place.id?.toLowerCase() || "";

  // Try to find a zone that contains this place
  for (const [zoneId, label] of Object.entries(LABELS)) {
    // Check if this zone is for the correct building and floor
    if (!zoneId.includes(`-${building}-`) || !zoneId.includes(`-${floor}-`)) {
      continue;
    }

    // Check if the label mentions this place
    const normalizedLabel = label.toLowerCase();
    
    if (
      (placeSlug && normalizedLabel.includes(placeSlug)) ||
      (placeName && normalizedLabel.includes(placeName)) ||
      (placeId && normalizedLabel.includes(placeId))
    ) {
      return { zoneId, label };
    }
  }

  // If no specific zone found, create a fallback
  // Use the place name as the label
  const fallbackZoneId = `z-${building}-${floor}-${placeSlug || placeId || 'unknown'}`;
  const fallbackLabel = place.name || place.description || "Location";
  
  return { zoneId: fallbackZoneId, label: fallbackLabel };
}

