import { MapPin, Building2, Navigation } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-[family-name:var(--font-playfair)] bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent mb-4 leading-tight pb-2">
          About PSU Campus Navigator
        </h1>
        <p className="text-lg text-slate-600">
          Your comprehensive guide to Prince Sultan University
        </p>
      </div>

      <div className="bg-white rounded-2xl border-2 border-amber-200 p-8 shadow-xl space-y-6">
        <div className="flex items-start gap-4">
          <div className="bg-amber-100 p-3 rounded-lg">
            <MapPin className="h-6 w-6 text-amber-700" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-amber-900 mb-2">Interactive Campus Maps</h2>
            <p className="text-slate-700 leading-relaxed">
              Navigate through buildings 101–105 with our detailed, interactive floor maps. 
              Find any classroom, office, or facility with ease.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-amber-100 p-3 rounded-lg">
            <Building2 className="h-6 w-6 text-amber-700" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-amber-900 mb-2">Comprehensive Coverage</h2>
            <p className="text-slate-700 leading-relaxed">
              Explore detailed information about all facilities, including exam halls, 
              dining areas, libraries, and important administrative offices.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-amber-100 p-3 rounded-lg">
            <Navigation className="h-6 w-6 text-amber-700" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-amber-900 mb-2">Easy Navigation</h2>
            <p className="text-slate-700 leading-relaxed">
              Use our powerful search and filtering tools to quickly locate any place on campus. 
              Perfect for new students and visitors alike.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 p-6 text-center">
        <p className="text-slate-700">
          Built with ❤️ for the PSU community
        </p>
      </div>
    </div>
  );
}


