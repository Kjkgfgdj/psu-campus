// lib/types.ts
export type CategorySlug = 'food' | 'important' | 'exam' | 'public' | 'classroom';

export type Place = {
  id: string;
  name: string;
  slug: string;
  category: string | CategorySlug;
  building: number;
  floor: number;
  description?: string; // optional to match Airtable
  code?: string;        // optional tag like "1-a01" if present
  videoUrl?: string;    // optional video url when available
};


