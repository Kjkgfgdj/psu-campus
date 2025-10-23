import Link from "next/link";
import { CategoryMenu } from "@/components/nav/CategoryMenu";
import { Building2, Search } from "lucide-react";

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3.5">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2.5 text-slate-900 hover:text-green-600 transition-colors group"
        >
          <div className="bg-green-600 p-2 rounded-xl group-hover:bg-green-700 transition-colors">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">PSU Campus</span>
        </Link>

        {/* Category Menu */}
        <div className="flex-1 flex items-center justify-center">
          <CategoryMenu />
        </div>

        {/* Search Button */}
        <Link
          href="/search"
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:border-green-600 hover:text-green-600 hover:shadow-sm"
        >
          <Search className="h-4 w-4" />
          <span>Search...</span>
        </Link>
      </div>
    </header>
  );
}
