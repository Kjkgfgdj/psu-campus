// lib/types.ts
export type CategorySlug = 'food' | 'important' | 'exam' | 'public' | 'classroom';

export type Place = {
  id: string;
  name: string;
  building: number; // 101, 104, 105...
  floor: string | number; // "G", 0, 1, 2...
  category: string;        // display label
  categorySlug?: string;   // normalized slug; optional if derived client-side
  slug?: string;
  description?: string;
  code?: string;
  videoUrl?: string;
};


