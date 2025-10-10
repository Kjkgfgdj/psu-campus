'use client';

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import NavCategoryMenu from "@/components/nav/NavCategoryMenu";

export function NavMenuUI() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavCategoryMenu
          label="Popular exam places"
          slug="exam"
          pillClasses="ring-cyan-200 bg-cyan-100 text-slate-900"
        />
        <NavCategoryMenu
          label="Food & drinks"
          slug="food"
          pillClasses="ring-green-700 bg-green-700 text-white"
        />
        <NavCategoryMenu
          label="Public facilities"
          slug="public"
          pillClasses="ring-blue-700 bg-blue-700 text-white"
        />
        <NavCategoryMenu
          label="Important places"
          slug="important"
          pillClasses="ring-red-600 bg-red-600 text-white"
        />
        <NavCategoryMenu
          label="Classroom"
          slug="classroom"
          pillClasses="ring-amber-400 bg-amber-400 text-black"
        />
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
