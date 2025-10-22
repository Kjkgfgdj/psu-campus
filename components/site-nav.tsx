import Link from "next/link";
import NavMenuUI from "@/components/NavMenuUI.client";
import { Building2 } from "lucide-react";

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container mx-auto flex max-w-[1120px] items-center justify-between px-4 py-3.5">
        <Link 
          href="/" 
          className="flex items-center gap-2.5 text-slate-900 hover:text-green-600 transition-colors group"
        >
          <div className="bg-green-600 p-2 rounded-xl group-hover:bg-green-700 transition-colors">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">PSU Campus</span>
        </Link>
        <NavMenuUI />
      </div>
    </header>
  );
}
