/**
 * Component to display formatted text with better handling of:
 * - Bullet points
 * - Newlines
 * - Structured lists
 */

import { parseLabel, type ParsedLabel } from "@/lib/label-parser";
import { cn } from "@/lib/utils";

type FormattedTextProps = {
  text: string;
  className?: string;
  /** Whether to show as compact (single line with truncation) */
  compact?: boolean;
  /** Max lines to show when compact */
  maxLines?: number;
};

/**
 * Displays text with better formatting for structured content
 * Automatically detects and formats bullet lists and multi-line content
 */
export function FormattedText({ 
  text, 
  className = "", 
  compact = false,
  maxLines = 2 
}: FormattedTextProps) {
  if (!text || typeof text !== 'string') {
    return null;
  }

  // If it's simple text without newlines or bullets, just display it
  const hasStructure = text.includes('\n') || text.includes('•') || text.includes('—');
  
  if (!hasStructure || compact) {
    // Simple text display with optional line clamping
    return (
      <p className={cn(
        "text-sm text-slate-600 leading-relaxed",
        compact && `line-clamp-${maxLines}`,
        className
      )}>
        {text}
      </p>
    );
  }

  // Parse structured text
  const parsed = parseLabel(text);
  
  // If no items, it's just simple text
  if (parsed.items.length === 0) {
    return (
      <div className={cn("text-sm text-slate-600 leading-relaxed", className)}>
        <div className="font-medium text-slate-700">{parsed.header}</div>
        {parsed.subtitle && (
          <div className="text-slate-600 mt-1">{parsed.subtitle}</div>
        )}
      </div>
    );
  }

  // Full structured display
  return (
    <div className={cn("space-y-2", className)}>
      <div className="text-sm">
        <div className="font-medium text-slate-700">{parsed.header}</div>
        {parsed.subtitle && (
          <div className="text-slate-600 mt-0.5 text-xs">{parsed.subtitle}</div>
        )}
      </div>
      
      <ul className="space-y-1 pl-1">
        {parsed.items.slice(0, 3).map((item, i) => (
          <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
            <span className="text-slate-400 mt-0.5 flex-shrink-0">•</span>
            <span className="line-clamp-1">{item}</span>
          </li>
        ))}
        {parsed.items.length > 3 && (
          <li className="text-xs text-slate-500 italic pl-3">
            +{parsed.items.length - 3} more...
          </li>
        )}
      </ul>
    </div>
  );
}

