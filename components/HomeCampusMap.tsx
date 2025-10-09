"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const ROUTES: Record<string, string> = {
  "b-101": "/buildings/101",
  "b-104": "/buildings/104",
  "b-105": "/buildings/105",
};

const LABELS: Record<string, string> = {
  "b-101": "Building 101",
  "b-104": "Building 104",
  "b-105": "Building 105",
};

export default function HomeCampusMap() {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/maps/home/home-overlay.svg", { cache: "no-store" });
        if (!res.ok) return; // silently fail until files are added
        const svgText = await res.text();
        if (cancelled || !overlayRef.current) return;

        // Inject SVG inline so paths are interactive
        overlayRef.current.innerHTML = svgText;

        const svg = overlayRef.current.querySelector("svg");
        if (!svg) return;

        // Remove any full-canvas blocking rects
        svg.querySelectorAll("rect").forEach((r) => {
          const w = r.getAttribute("width");
          const h = r.getAttribute("height");
          if ((w === "1200" || w === "100%") && (h === "800" || h === "100%")) r.remove();
        });

        // Ensure viewBox is correct
        if (svg.getAttribute("viewBox") !== "0 0 1200 800") {
          svg.setAttribute("viewBox", "0 0 1200 800");
        }

        // Make the building shapes interactive & accessible
        svg.querySelectorAll<SVGPathElement>('[id^="b-"]').forEach((p) => {
          const id = (p as SVGPathElement).id;
          const label = LABELS[id] ?? id;

          // Reliable hit-testing
          if (!p.getAttribute("fill")) p.setAttribute("fill", "#D9D9D9");
          p.setAttribute("fill-opacity", "0.08");
          (p as unknown as HTMLElement).style.cursor = "pointer";

          // A11y
          p.setAttribute("role", "button");
          p.setAttribute("tabindex", "0");
          p.setAttribute("aria-label", label);
          if (!p.querySelector("title")) {
            const t = document.createElementNS("http://www.w3.org/2000/svg", "title");
            t.textContent = label; // shows native tooltip on hover
            p.appendChild(t);
          }

          // Click / keyboard -> route
          const go = () => { const to = ROUTES[id]; if (to) router.push(to); };
          p.addEventListener("click", go);
          p.addEventListener("keydown", (e: unknown) => {
            const ke = e as KeyboardEvent;
            if (ke.key === "Enter" || ke.key === " ") { ke.preventDefault(); go(); }
          });
        });

        // Hover/focus styles
        const style = document.createElement("style");
        style.textContent = `
          :where(#b-101,#b-104,#b-105){ transition: fill 120ms ease; outline: none; }
          #b-101:hover, #b-101:focus { fill: rgba(34,197,94,.28); }   /* green  */
          #b-104:hover, #b-104:focus { fill: rgba(59,130,246,.28); }  /* blue   */
          #b-105:hover, #b-105:focus { fill: rgba(234,179,8,.32); }   /* amber  */
        `;
        svg.appendChild(style);
      } catch {
        // ignore until assets are present
      }
    })();

    return () => { cancelled = true; };
  }, [router]);

  return (
    // Rounded wrapper clips the overlay too
    <div className="relative mx-auto max-w-6xl rounded-xl overflow-hidden shadow-sm">
      <img
        src="/maps/home/home_page.webp"
        alt="PSU campus overview"
        className="w-full h-auto select-none"
        draggable={false}
      />
      <div ref={overlayRef} className="absolute inset-0 pointer-events-auto" style={{ zIndex: 1 }} />
    </div>
  );
}


