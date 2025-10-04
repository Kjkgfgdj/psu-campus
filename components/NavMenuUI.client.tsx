'use client';

interface Place {
  id: string;
  name?: string;
  building?: number | string;
  floor?: number | string;
  category?: string;
  slug?: string;
}
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface NavMenuUIProps {
  examItems: Place[];
  foodItems: Place[];
}

const EMPTY_EXAM_TEXT = "No exam rooms found yet. Add classroom rows in Airtable (e.g. “E-140”) and they’ll appear here.";
const EMPTY_FOOD_TEXT = "No food spots yet. Add rows in Airtable to see them here.";

function renderList(items: Place[], kind: "exam" | "food") {
  const hasItems = items.length > 0;
  const seeAllHref = kind === "exam" ? "/search?cat=exam" : "/search?cat=food";
  const seeAllLabel = "See all →";

  return (
    <div className="w-[320px] max-h-[60vh] overflow-auto p-3">
      <p className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {kind === "exam" ? "Popular exam places" : "Food & drinks"}
      </p>
      <ul className="mt-2 space-y-2">
        {hasItems
          ? items.map((place) => (
              <li key={place.id}>
                <Link
                  href={
                    kind === "exam"
                      ? `/buildings/${place.building ?? ""}?floor=${place.floor ?? ""}&cat=exam${place.slug ? `&slug=${place.slug}` : ""}`
                      : `/buildings/${place.building ?? ""}?floor=${place.floor ?? ""}&cat=food${place.slug ? `&slug=${place.slug}` : ""}`
                  }
                  className="block rounded-md px-2 py-2 transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  aria-label={`${place.name}, building ${place.building}, floor ${place.floor}`}
                >
                  <div className="text-sm font-medium">{place.name}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    {place.building !== undefined && place.building !== null && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">Bldg {place.building}</span>
                    )}
                    {place.floor !== undefined && place.floor !== null && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">Floor {place.floor}</span>
                    )}
                    {place.category && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">
                        {place.category}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))
          : (
              <li>
                <div className="rounded-md border border-dashed bg-muted/30 px-3 py-6 text-center text-xs text-muted-foreground">
                  {kind === "exam" ? EMPTY_EXAM_TEXT : EMPTY_FOOD_TEXT}
                </div>
              </li>
            )}
      </ul>
      <div className="mt-3 border-t pt-3 text-right">
        <Link href={seeAllHref} className="text-sm font-medium text-primary underline-offset-2 hover:underline">
          {seeAllLabel}
        </Link>
      </div>
    </div>
  );
}

export function NavMenuUI({ examItems, foodItems }: NavMenuUIProps) {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ring-1 ring-[#9FE6FF]/60 bg-[#D9F0FF] text-[#003A57]">
              Popular exam places
            </span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>{renderList(examItems, "exam")}</NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium bg-[#2AFD32] text-white">
              Food & drinks
            </span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>{renderList(foodItems, "food")}</NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/search">Search</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/about">About</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default NavMenuUI;
