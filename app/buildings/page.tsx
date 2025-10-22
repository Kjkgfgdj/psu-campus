import Link from "next/link";
import BuildingCard from "@/components/BuildingCard";
import { Building2 } from "lucide-react";

export default function BuildingsPage() {
  return (
    <div className="space-y-8 py-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Building2 className="h-10 w-10 text-amber-700" />
          <h1 className="text-4xl font-bold font-[family-name:var(--font-playfair)] bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent">
            Campus Buildings
          </h1>
        </div>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Explore interactive floor maps for all PSU campus buildings
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
        <BuildingCard building="101" href="/buildings/101" />
        <BuildingCard building="104" href="/buildings/104" />
        <BuildingCard building="105" href="/buildings/105" />
      </div>
    </div>
  );
}


