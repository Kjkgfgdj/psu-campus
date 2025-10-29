"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LABELS } from "@/lib/labels";
import { parseLabel, getLabelPreview } from "@/lib/label-parser";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as YouTubeEmbedModule from "@/components/YouTubeEmbed";
import type { ReactElement } from "react";

type YouTubeEmbedComponent = (props: {
  url: string;
  title?: string;
  className?: string;
}) => ReactElement;

const embedModule = YouTubeEmbedModule as {
  YouTubeEmbed?: YouTubeEmbedComponent;
  default?: YouTubeEmbedComponent;
};

const YouTubeEmbed: YouTubeEmbedComponent =
  embedModule.YouTubeEmbed ??
  embedModule.default ??
  (() => <p className="text-sm text-muted-foreground">Video unavailable.</p>);

type Props = { building: string; floor: string | number };
type Selection = { zoneId: string; label: string };

export default function FloorMap({ building, floor }: Props) {
  const objRef = useRef<HTMLObjectElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const baseSrcBase = `/maps/${building}/${building}_${floor}-base`;
  const overlayUrl = `/maps/${building}/${building}_${floor}-overlay.svg?v=${building}-${floor}`;

  useEffect(() => () => cleanupRef.current?.(), []);

  const onOverlayLoad = useCallback(() => {
    cleanupRef.current?.();

    const doc = objRef.current?.contentDocument;
    if (!doc) return;

    const rects = Array.from(doc.querySelectorAll<SVGRectElement>("rect[id^='hitbox']"));

    const handleActivate = (el: SVGRectElement) => {
      const group = el.closest("g[id^='z-']") as SVGGElement | null;
      const zoneId = group?.id || el.id;
      const label = LABELS[zoneId] ?? zoneId;

      setSelection({ zoneId, label });
      setVideoUrl(null);
      setMsg(null);
      setOpen(true);

      const qs = new URLSearchParams({ building: String(building), zoneId });
      fetch(`/api/places/video?${qs.toString()}`)
        .then((r) => r.json())
        .then((d) => {
          if (!d?.videoUrl) setMsg("No video found for this location.");
          else setVideoUrl(d.videoUrl);
        })
        .catch(() => setMsg("Failed to load video."));
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      handleActivate(e.currentTarget as unknown as SVGRectElement);
    };

    rects.forEach((r) => {
      const group = r.closest("g[id^='z-']") as SVGGElement | null;
      const zoneId = group?.id || r.id;
      const label = LABELS[zoneId] ?? zoneId;
      const labelPreview = getLabelPreview(label);

      r.setAttribute("role", "button");
      r.setAttribute("tabindex", "0");
      r.setAttribute("aria-label", labelPreview);
      r.setAttribute("title", labelPreview);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (r.style as any).cursor = "pointer";

      const onClick = () => handleActivate(r);
      r.addEventListener("click", onClick);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      r.addEventListener("keydown", onKey as any);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(r as any).__cleanup = () => {
        r.removeEventListener("click", onClick);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        r.removeEventListener("keydown", onKey as any);
      };
    });

    cleanupRef.current = () => {
      rects.forEach((r) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(r as any).__cleanup?.();
      });
      cleanupRef.current = null;
    };
  }, [building]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 1100,
        marginInline: "auto",
        borderRadius: 12,
        overflow: "hidden",
        background: "#f5f5f5",
        aspectRatio: "1200 / 800",
      }}
    >
      <img
        key={baseSrcBase}
        src={`${baseSrcBase}.webp`}
        onError={(e) => {
          const el = e.currentTarget as HTMLImageElement & { dataset: { fallback?: string } };
          if (!el.dataset.fallback) {
            el.dataset.fallback = "1";
            el.src = `${baseSrcBase}.png`;
          }
        }}
        alt={`Building ${building} — Floor ${floor}`}
        className="absolute inset-0 w-full h-full object-contain"
      />

      <object
        ref={objRef}
        key={overlayUrl}
        type="image/svg+xml"
        data={overlayUrl}
        onLoad={onOverlayLoad}
        aria-label={`Overlay for building ${building} floor ${floor}`}
        className="absolute inset-0 w-full h-full"
      />

      <Dialog open={open} onOpenChange={setOpen} modal={true}>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] p-0 gap-0 border-0 bg-white flex flex-col overflow-hidden">
          {/* Premium Header with Gradient - Fixed */}
          <div className="relative flex-shrink-0 overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-green-600 px-10 py-8">
            {/* Decorative pattern overlay */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)]"></div>
            </div>
            
            <DialogHeader className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-white/90 uppercase tracking-wider">Location Video</span>
              </div>
              
              {(() => {
                const rawLabel = selection?.label ?? "Location";
                const parsed = parseLabel(rawLabel);
                
                // Parse items for ALL buildings uniformly
                let displayItems = parsed.items;
                
                // If no bullet items found, try other formats
                if (displayItems.length === 0) {
                  const text = parsed.subtitle || parsed.header;
                  
                  // Check for semicolon-separated items
                  if (text.includes(';')) {
                    displayItems = text.split(';').map(item => item.trim()).filter(Boolean);
                  } 
                  // Check for plus-separated items
                  else if (text.includes('+')) {
                    displayItems = text.split('+').map(item => item.trim()).filter(Boolean);
                  }
                  // If there's a subtitle, show it as an item
                  else if (parsed.subtitle) {
                    displayItems = [parsed.subtitle];
                  }
                }
                
                return (
                  <div className="space-y-3">
                    {/* Unified structure for ALL buildings */}
                    <DialogTitle className="text-white drop-shadow-lg text-3xl leading-tight">
                      Available Places
                    </DialogTitle>
                    
                    {displayItems.length > 0 && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-2 max-h-[200px] overflow-y-auto overscroll-contain">
                        <ul className="space-y-2">
                          {displayItems.map((item, i) => (
                            <li 
                              key={i}
                              className="flex items-start gap-2 text-white/95 text-sm leading-relaxed"
                            >
                              <span className="text-white/60 mt-1 flex-shrink-0">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })()}
            </DialogHeader>
          </div>

          {/* Video Content - Scrollable */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-8">
            {msg && (
              <div className="flex items-center gap-3 bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                <div className="bg-red-100 p-3 rounded-xl">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-700 font-medium">{msg}</p>
              </div>
            )}
            {videoUrl && (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-3xl blur-xl opacity-50"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-2 ring-slate-200/50">
                  <YouTubeEmbed url={videoUrl} />
                </div>
              </div>
            )}
            {!msg && !videoUrl && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative mb-6">
                  <div className="absolute -inset-3 bg-green-600/20 rounded-full blur-2xl animate-pulse"></div>
                  <div className="relative bg-green-100 p-6 rounded-full">
                    <svg className="w-12 h-12 text-green-600 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-slate-600 font-medium">Loading video...</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

