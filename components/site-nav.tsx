import Link from "next/link";
import { CategoryMenu } from "@/components/nav/CategoryMenu";
import { Building2, Search } from "lucide-react";

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 shadow-sm">
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600"></div>
      
      <div className="container mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        {/* Logo with premium styling */}
        <Link 
          href="/" 
          className="flex items-center gap-3 text-slate-900 hover:text-green-600 transition-all duration-300 group"
        >
          <div className="relative">
            {/* Glow effect on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-green-600 to-emerald-600 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-600/20">
              <Building2 className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight leading-tight">PSU Campus</span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">NAVIGATOR</span>
          </div>
        </Link>

        {/* Category Menu */}
        <div className="flex-1 flex items-center justify-center">
          <CategoryMenu />
        </div>

        {/* Premium Search Button */}
        <Link
          href="/search"
          className="group relative flex items-center gap-2 overflow-hidden rounded-xl border border-slate-200/60 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-300 hover:border-green-600/50 hover:text-green-600 hover:shadow-lg hover:shadow-green-600/10"
        >
          {/* Hover gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <Search className="relative h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
          <span className="relative">Search...</span>
        </Link>
      </div>
    </header>
  );
}
