'use client';
import Link from "next/link";
import { CategoryMenu } from "@/components/nav/CategoryMenu";
import { Building2, Search, Menu, X } from "lucide-react";
import { useState } from "react";

export default function SiteNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Premium gradient background with glass effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl"></div>
      
      {/* Animated gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 animate-pulse"></div>
      
      <div className="relative container mx-auto flex max-w-7xl items-center justify-between gap-4 md:gap-8 px-4 md:px-6 py-4">
        {/* Premium Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2 md:gap-3 group flex-shrink-0"
        >
          <div className="relative">
            {/* Multi-layer glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition duration-500"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-md opacity-30 group-hover:opacity-70 transition duration-500"></div>
            
            <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-green-600 p-2 md:p-3 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-green-600/40">
              <Building2 className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-base md:text-xl font-bold tracking-tight leading-tight text-white group-hover:text-green-400 transition-colors">
              PSU Campus
            </span>
            <span className="text-[10px] md:text-[11px] text-green-400 font-bold tracking-widest uppercase">
              NAVIGATOR
            </span>
          </div>
        </Link>

        {/* Desktop Category Menu - Hidden on mobile */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <CategoryMenu />
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Premium Search Button - Icon only on mobile, full on desktop */}
          <Link
            href="/search"
            className="group relative flex items-center gap-2.5 overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-3 py-2 md:px-6 md:py-3 text-sm font-bold text-white transition-all duration-300 hover:shadow-2xl hover:shadow-green-600/50 hover:scale-105"
          >
            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
            
            <Search className="relative h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
            <span className="relative hidden md:inline">Search</span>
            <svg className="relative h-3 w-3 group-hover:translate-x-1 transition-transform hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Mobile Menu Button - Only visible on mobile/tablet */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden group relative flex items-center justify-center overflow-hidden rounded-xl bg-white/10 p-2.5 text-white transition-all duration-300 hover:bg-white/20 hover:scale-105"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden relative border-t border-white/10">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/98 to-slate-800/98 backdrop-blur-xl"></div>
          <div className="relative container mx-auto max-w-7xl px-4 py-6">
            <nav className="flex flex-col gap-3">
              <Link
                href="/search?cat=exam"
                onClick={() => setMobileMenuOpen(false)}
                className="group relative flex items-center justify-between rounded-xl bg-white/5 px-4 py-3.5 text-sm font-semibold text-slate-200 transition-all hover:bg-green-600/20 hover:text-white"
              >
                <span>Popular exam places</span>
                <svg className="h-4 w-4 text-green-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              
              <Link
                href="/search?cat=food"
                onClick={() => setMobileMenuOpen(false)}
                className="group relative flex items-center justify-between rounded-xl bg-white/5 px-4 py-3.5 text-sm font-semibold text-slate-200 transition-all hover:bg-green-600/20 hover:text-white"
              >
                <span>Food & drinks</span>
                <svg className="h-4 w-4 text-green-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              
              <Link
                href="/search?cat=public"
                onClick={() => setMobileMenuOpen(false)}
                className="group relative flex items-center justify-between rounded-xl bg-white/5 px-4 py-3.5 text-sm font-semibold text-slate-200 transition-all hover:bg-green-600/20 hover:text-white"
              >
                <span>Public facilities</span>
                <svg className="h-4 w-4 text-green-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              
              <Link
                href="/search?cat=important"
                onClick={() => setMobileMenuOpen(false)}
                className="group relative flex items-center justify-between rounded-xl bg-white/5 px-4 py-3.5 text-sm font-semibold text-slate-200 transition-all hover:bg-green-600/20 hover:text-white"
              >
                <span>Important places</span>
                <svg className="h-4 w-4 text-green-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              
              <Link
                href="/search?cat=classroom"
                onClick={() => setMobileMenuOpen(false)}
                className="group relative flex items-center justify-between rounded-xl bg-white/5 px-4 py-3.5 text-sm font-semibold text-slate-200 transition-all hover:bg-green-600/20 hover:text-white"
              >
                <span>Classroom</span>
                <svg className="h-4 w-4 text-green-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <div className="mt-2 pt-4 border-t border-white/10">
                <Link
                  href="/buildings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="group relative flex items-center justify-between rounded-xl bg-gradient-to-r from-green-600/20 to-emerald-600/20 px-4 py-3.5 text-sm font-semibold text-green-400 transition-all hover:from-green-600/30 hover:to-emerald-600/30"
                >
                  <span>All Buildings</span>
                  <Building2 className="h-4 w-4" />
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
      
      {/* Bottom gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-600/30 to-transparent"></div>
    </header>
  );
}
