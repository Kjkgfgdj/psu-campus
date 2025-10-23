'use client';

import Link from "next/link";

export function NavMenuUI() {
  return (
    <nav className="flex items-center gap-6">
      <Link 
        href="/search" 
        className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600/65"
      >
        Search
      </Link>
    </nav>
  );
}

export default NavMenuUI;
