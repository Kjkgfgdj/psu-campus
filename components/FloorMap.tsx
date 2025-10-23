"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LABELS } from "@/lib/labels";
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

      r.setAttribute("role", "button");
      r.setAttribute("tabindex", "0");
      r.setAttribute("aria-label", label);
      r.setAttribute("title", label);
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[960px]">
          <DialogHeader>
            <DialogTitle>{selection?.label ?? "Location"}</DialogTitle>
          </DialogHeader>
          {msg && <p className="text-red-600">{msg}</p>}
          {videoUrl && <YouTubeEmbed url={videoUrl} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

