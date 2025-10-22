'use client';

import Link from 'next/link';
import type { Place } from '@/lib/types';
import { useEffect, useState } from 'react';
import { toCatSlug } from '@/components/CategoryChip';
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

// Use shared Place type for consistency

type Props = {
  label: string; // e.g. "Public facilities"
  slug: 'exam' | 'food' | 'public' | 'important' | 'classroom';
  pillClasses: string; // bg/text/ring classes
};

/**
 * Generic navbar category pill with hover/focus dropdown.
 * Matches the existing NavigationMenu look & behavior.
 */
export default function NavCategoryMenu({ label, slug, pillClasses }: Props) {
  const [items, setItems] = useState<Place[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/places?limit=all`, { cache: 'no-store' });
        if (!res.ok) return;
        const json = await res.json();
        const all: Place[] = Array.isArray(json) ? json : (json?.places ?? []);

        const filtered = all.filter((p) => {
          const s = toCatSlug(String(p.category ?? ''));
          return s === slug;
        });

        const top = filtered.slice(0, 8);
        if (alive) setItems(top);
      } catch {
        // ignore
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  const seeAllHref = { pathname: '/search', query: { cat: slug } } as const;

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
        <span className={[
          'inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium',
          pillClasses,
        ].join(' ')}>
          {label}
        </span>
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="w-[320px] max-h-[60vh] overflow-auto p-3">
          <p className="px-2 text-xs font-semibold uppercase tracking-wide text-amber-700">
            {label}
          </p>
          <ul className="mt-2 space-y-2">
            {items.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/buildings/${p.building ?? ''}?floor=${p.floor ?? ''}&cat=${slug}${p.slug ? `&slug=${p.slug}` : ''}`}
                  className="block rounded-md px-2 py-2 transition hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
                  aria-label={`${p.name}, building ${p.building}, floor ${p.floor}`}
                >
                  <div className="text-sm font-medium text-amber-950">{p.name}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-amber-700">
                    {p.building !== undefined && p.building !== null && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">Bldg {p.building}</span>
                    )}
                    {p.floor !== undefined && p.floor !== null && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">Floor {p.floor}</span>
                    )}
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">{label}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t border-amber-200 pt-3 text-right">
            <Link href={seeAllHref} className="text-sm font-medium text-amber-800 underline-offset-2 hover:text-amber-900 hover:underline">
              See all →
            </Link>
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}


