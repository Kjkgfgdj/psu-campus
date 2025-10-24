/**
 * Utility to parse and structure labels for better display
 */

export type ParsedLabel = {
  header: string;
  subtitle?: string;
  items: string[];
};

/**
 * Parse a label string into structured parts for display
 * 
 * Handles formats like:
 * - "Third Floor — North wing\n• Item 1\n• Item 2"
 * - "E130–E136 — Classrooms + 1 Faculty Office"
 * - "Simple Label"
 */
export function parseLabel(rawLabel: string): ParsedLabel {
  // Handle empty or missing labels
  if (!rawLabel || typeof rawLabel !== 'string') {
    return { header: 'Location', items: [] };
  }

  // Split by newlines to separate header from items
  const lines = rawLabel.split('\n').map(line => line.trim()).filter(Boolean);
  
  if (lines.length === 0) {
    return { header: 'Location', items: [] };
  }

  // First line is typically the header (may contain — separator)
  const firstLine = lines[0];
  let header = firstLine;
  let subtitle: string | undefined;
  
  // Check if header contains — separator (common pattern: "Room — Description")
  if (firstLine.includes('—')) {
    const parts = firstLine.split('—').map(p => p.trim());
    header = parts[0];
    subtitle = parts.slice(1).join(' — ');
  }

  // Remaining lines are items (often start with • but not always)
  const items = lines.slice(1).map(line => {
    // Remove leading bullet points and clean up
    return line.replace(/^[•·∙◦▪▫-]\s*/, '').trim();
  }).filter(Boolean);

  return {
    header,
    subtitle,
    items,
  };
}

/**
 * Get a short preview of a label for tooltips/aria-labels
 */
export function getLabelPreview(rawLabel: string, maxLength = 100): string {
  const parsed = parseLabel(rawLabel);
  const full = parsed.subtitle 
    ? `${parsed.header} — ${parsed.subtitle}`
    : parsed.header;
  
  if (full.length <= maxLength) return full;
  return full.substring(0, maxLength - 3) + '...';
}

