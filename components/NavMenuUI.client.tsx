'use client';

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, MapPin, Building2, Video } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

export function NavMenuUI() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link 
            href="/search" 
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-green-600 transition-colors rounded-lg hover:bg-slate-50"
          >
            Search
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger 
            className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-700 hover:text-green-600 transition-colors rounded-lg hover:bg-slate-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            Explore
            <ChevronDown className="h-4 w-4" />
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-64 p-2">
              <Link
                href="/buildings"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
              >
                <Building2 className="h-5 w-5 text-slate-400 group-hover:text-green-600" />
                <div>
                  <div className="text-sm font-medium text-slate-900">Buildings</div>
                  <div className="text-xs text-slate-500">Interactive floor maps</div>
                </div>
              </Link>
              <Link
                href="/search?cat=food"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
              >
                <MapPin className="h-5 w-5 text-slate-400 group-hover:text-green-600" />
                <div>
                  <div className="text-sm font-medium text-slate-900">Food & Drinks</div>
                  <div className="text-xs text-slate-500">Cafes and dining</div>
                </div>
              </Link>
              <Link
                href="/search?cat=exam"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
              >
                <MapPin className="h-5 w-5 text-slate-400 group-hover:text-green-600" />
                <div>
                  <div className="text-sm font-medium text-slate-900">Exam Halls</div>
                  <div className="text-xs text-slate-500">Popular exam locations</div>
                </div>
              </Link>
              <Link
                href="/videos"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
              >
                <Video className="h-5 w-5 text-slate-400 group-hover:text-green-600" />
                <div>
                  <div className="text-sm font-medium text-slate-900">Videos</div>
                  <div className="text-xs text-slate-500">Campus tours</div>
                </div>
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
              >
                <MapPin className="h-5 w-5 text-slate-400 group-hover:text-green-600" />
                <div>
                  <div className="text-sm font-medium text-slate-900">About</div>
                  <div className="text-xs text-slate-500">Learn more</div>
                </div>
              </Link>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default NavMenuUI;
