import Link from "next/link";
import NavMenuUI from "@/components/NavMenuUI.client";
import { listPlaces } from "@/lib/airtable";

const FOOD_CATEGORIES = ["Food & drinks", "Food", "Cafe", "Café", "Restaurant"];

export default async function SiteNav() {
  const places = await listPlaces();

  const examItems = places
    .filter((p) => p.category === "Popular exam places")
    .slice(0, 8);

  const foodItems = places
    .filter((p) => (p.category ? FOOD_CATEGORIES.includes(p.category) : false))
    .slice(0, 8);

  return (
    <header className="bg-page sticky top-0 z-50 border-b border-black/5">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
          PSU Campus
        </Link>
        <NavMenuUI examItems={examItems} foodItems={foodItems} />
      </div>
    </header>
  );
}


