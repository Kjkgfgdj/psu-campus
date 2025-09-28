import Link from "next/link";
import NavMenuUI from "@/components/NavMenuUI.client";
import { getFoodAndDrinks, getPopularExamPlaces } from "@/lib/airtable";

export default async function SiteNav() {
  const [examItems, foodItems] = await Promise.all([
    getPopularExamPlaces().catch(() => []),
    getFoodAndDrinks().catch(() => []),
  ]);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
          PSU Campus
        </Link>
        <NavMenuUI examItems={examItems} foodItems={foodItems} />
      </div>
    </header>
  );
}


