import Link from "next/link";
import { CategoryMenu } from "@/components/nav/CategoryMenu";
import { Building2, Search } from "lucide-react";

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Premium gradient background with glass effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl"></div>
      
      {/* Animated gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 animate-pulse"></div>
      
      <div className="relative container mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-4">
        {/* Premium Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-3 group"
        >
          <div className="relative">
            {/* Multi-layer glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition duration-500"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-md opacity-30 group-hover:opacity-70 transition duration-500"></div>
            
            <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-green-600 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-green-600/40">
              <Building2 className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight leading-tight text-white group-hover:text-green-400 transition-colors">
              PSU Campus
            </span>
            <span className="text-[11px] text-green-400 font-bold tracking-widest uppercase">
              NAVIGATOR
            </span>
          </div>
        </Link>

        {/* Category Menu */}
        <div className="flex-1 flex items-center justify-center">
          <CategoryMenu />
        </div>

        {/* Premium Search Button */}
        <Link
          href="/search"
          className="group relative flex items-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:shadow-2xl hover:shadow-green-600/50 hover:scale-105"
        >
          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
          
          <Search className="relative h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
          <span className="relative">Search</span>
          <svg className="relative h-3 w-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      {/* Bottom gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-600/30 to-transparent"></div>
    </header>
  );
}
