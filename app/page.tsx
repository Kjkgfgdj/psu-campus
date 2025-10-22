import AutocompleteSearch from "@/components/AutocompleteSearch";
import HomeCampusMap from "@/components/HomeCampusMap";

export const revalidate = 60;

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Search Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-8 text-6xl font-bold font-[family-name:var(--font-playfair)] bg-gradient-to-r from-amber-800 via-orange-700 to-amber-900 bg-clip-text text-transparent drop-shadow-sm">
            PSU Campus Navigator
          </h1>
          <p className="mb-6 text-lg text-slate-600 max-w-2xl mx-auto">
            Discover and navigate Prince Sultan University with ease
          </p>
          <div className="mx-auto max-w-xl">
            <AutocompleteSearch />
          </div>
          
        </div>

        {/* Campus Map Section */}
        <div className="mt-16">
          <HomeCampusMap />
        </div>
      </div>
    </div>
  );
}