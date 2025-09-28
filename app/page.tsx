import AutocompleteSearch from "@/components/AutocompleteSearch";
import BuildingCard from "@/components/BuildingCard";

export const revalidate = 60;

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Search Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-6 text-4xl font-bold">PSU Campus Navigator</h1>
          <div className="mx-auto max-w-xl">
            <AutocompleteSearch />
          </div>
        </div>

        {/* Quick Buildings Section */}
        <div className="mt-16">
          <h2 className="mb-6 text-center text-2xl font-semibold">Quick Buildings</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <BuildingCard building="105" href="/buildings/105?floor=0" />
            <BuildingCard building="101" href="/buildings/101?floor=0" />
            <BuildingCard building="104" href="/buildings/104?floor=0" />
          </div>
        </div>
      </div>
    </div>
  );
}