'use client';

import { useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import NavCategoryMenu from "@/components/nav/NavCategoryMenu";

export function NavMenuUI() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      startTransition(() => {
        router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      });
    }
  };

  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavCategoryMenu
          label="Popular exam places"
          slug="exam"
          pillClasses="bg-amber-100 text-amber-900"
        />
        <NavCategoryMenu
          label="Food & drinks"
          slug="food"
          pillClasses="bg-amber-100 text-amber-900"
        />
        <NavCategoryMenu
          label="Public facilities"
          slug="public"
          pillClasses="bg-amber-100 text-amber-900"
        />
        <NavCategoryMenu
          label="Important places"
          slug="important"
          pillClasses="bg-amber-100 text-amber-900"
        />
        <NavCategoryMenu
          label="Classroom"
          slug="classroom"
          pillClasses="bg-amber-100 text-amber-900"
        />
        <NavigationMenuItem>
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-amber-700" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="h-9 w-48 rounded-full bg-amber-50 pl-9 pr-4 text-sm text-amber-900 placeholder-amber-600 outline-none focus:bg-white focus:ring-2 focus:ring-amber-400 transition-all"
              />
            </div>
          </form>
        </NavigationMenuItem>
        
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default NavMenuUI;
