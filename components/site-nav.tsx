import Link from "next/link";
import NavMenuUI from "@/components/NavMenuUI.client";
import { Building2 } from "lucide-react";

export default function SiteNav() {
  return (
    <header className="bg-[#5C4033] sticky top-0 z-50 border-b border-black/10 shadow-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-white hover:text-amber-100 transition-colors">
          <div className="bg-amber-100 p-1.5 rounded-lg">
            <Building2 className="h-5 w-5 text-amber-800" />
          </div>
          <span className="text-lg font-bold tracking-tight">PSU Campus</span>
        </Link>
        <NavMenuUI />
      </div>
    </header>
  );
}


