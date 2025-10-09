import AutocompleteSearch from "@/components/AutocompleteSearch";
import HomeCampusMap from "@/components/HomeCampusMap";

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

        {/* Campus Map Section */}
        <div className="mt-16">
          <HomeCampusMap />
        </div>
      </div>
    </div>
  );
}