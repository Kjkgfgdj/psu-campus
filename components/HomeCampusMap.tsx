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
    let tip: HTMLDivElement | null = null;

    (async () => {
      try {
        const res = await fetch("/maps/home/home-overlay.svg", { cache: "no-store" });
        if (!res.ok) return;
        const svgText = await res.text();
        if (cancelled || !overlayRef.current) return;

        overlayRef.current.innerHTML = svgText;

        const svg = overlayRef.current.querySelector("svg");
        if (!svg) return;

        // Make SVG fill the container and be clickable
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.position = "absolute";
        svg.style.top = "0";
        svg.style.left = "0";
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

        // Tooltip
        tip = document.createElement("div");
        tip.style.position = "fixed";
        tip.style.padding = "4px 8px";
        tip.style.borderRadius = "6px";
        tip.style.fontSize = "12px";
        tip.style.background = "rgba(0,0,0,.8)";
        tip.style.color = "#fff";
        tip.style.pointerEvents = "none";
        tip.style.zIndex = "50";
        tip.style.transform = "translate(-50%, -150%)";
        tip.style.display = "none";
        document.body.appendChild(tip);
        const show = (t: string) => { if (!tip) return; tip.textContent = t; tip.style.display = "block"; };
        const hide = () => { if (!tip) return; tip.style.display = "none"; };
        const move = (e: MouseEvent) => { if (!tip) return; tip.style.left = `${e.clientX}px`; tip.style.top = `${e.clientY}px`; };

        // Remove blocking rects
        svg.querySelectorAll("rect").forEach((r) => {
          const w = r.getAttribute("width");
          const h = r.getAttribute("height");
          if ((w === "1200" || w === "100%") && (h === "800" || h === "100%")) r.remove();
        });

        // Ensure viewBox
        if (svg.getAttribute("viewBox") !== "0 0 1200 800") {
          svg.setAttribute("viewBox", "0 0 1200 800");
        }

        // Make building shapes interactive
        svg.querySelectorAll<SVGPathElement>('[id^="b-"]').forEach((p) => {
          const id = p.id;
          const label = LABELS[id] ?? id;

          if (!p.getAttribute("fill")) p.setAttribute("fill", "#D9D9D9");
          if (!p.getAttribute("fill-opacity")) p.setAttribute("fill-opacity", "0.08");
          p.style.cursor = "pointer";

          // A11y
          p.setAttribute("role", "button");
          p.setAttribute("tabindex", "0");
          p.setAttribute("aria-label", label);
          if (!p.querySelector("title")) {
            const t = document.createElementNS("http://www.w3.org/2000/svg", "title");
            t.textContent = label;
            p.appendChild(t);
          }

          p.addEventListener("mouseenter", () => show(label));
          p.addEventListener("mouseleave", hide);
          p.addEventListener("mousemove", move);
          p.addEventListener("focus", () => show(label));
          p.addEventListener("blur", hide);

          const go = () => { const to = ROUTES[id]; if (to) router.push(to); };
          p.addEventListener("click", go);
          p.addEventListener("keydown", (e: unknown) => {
            const ke = e as KeyboardEvent;
            if (ke.key === "Enter" || ke.key === " ") { ke.preventDefault(); go(); }
          });
        });

        // Neutral hover tint (subtle green accent)
        const style = document.createElement("style");
        style.textContent = `
          :where(#b-101,#b-104,#b-105){ transition: fill 120ms ease, stroke 120ms ease; }
          :where(#b-101,#b-104,#b-105):hover{ 
            fill: rgba(22,163,74,.12); 
            stroke: rgba(22,163,74,.55); 
            stroke-width: 2;
          }
        `;
        svg.appendChild(style);
      } catch {
        // ignore
      }
    })();

    return () => {
      cancelled = true;
      if (tip) { tip.remove(); tip = null; }
    };
  }, [router]);

  return (
    <div className="card relative mx-auto max-w-6xl overflow-hidden">
      {/* Base image */}
      <img
        src="/maps/home/home_page.webp"
        alt="PSU campus overview"
        className="w-full h-auto select-none block"
        draggable={false}
      />
      {/* SVG overlay - positioned absolutely on top with higher z-index */}
      <div 
        ref={overlayRef} 
        className="absolute inset-0 pointer-events-auto"
        style={{ zIndex: 10 }}
      />
    </div>
  );
}
