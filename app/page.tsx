"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import BuildingCard from "@/components/BuildingCard";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Search Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">PSU Campus Navigator</h1>
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <Input
              type="text"
              placeholder="Search for a classroom, office, or facility..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-lg py-6 px-4"
            />
          </form>
        </div>

        {/* Quick Buildings Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">Quick Buildings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BuildingCard building="105" href="/buildings/105?floor=0" />
            <BuildingCard building="101" href="/buildings/101?floor=0" />
            <BuildingCard building="104" href="/buildings/104?floor=0" />
          </div>
        </div>
      </div>
    </div>
  );
}