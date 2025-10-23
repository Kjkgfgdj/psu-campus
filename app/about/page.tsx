import { MapPin, Building2, Navigation } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export default function AboutPage() {
  return (
    <div className="py-12">
      <Container className="max-w-4xl">
        <div className="space-y-12">
          {/* Header */}
          <PageHeader
            title="About PSU Campus Navigator"
            subtitle="Your comprehensive guide to Prince Sultan University"
            centered
          />

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-green-100 p-4 rounded-2xl">
                  <MapPin className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">
                    Interactive Maps
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    Navigate through buildings 101–105 with our detailed, interactive floor maps.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-green-100 p-4 rounded-2xl">
                  <Building2 className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">
                    Full Coverage
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    Explore all facilities including exam halls, dining areas, libraries, and offices.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-green-100 p-4 rounded-2xl">
                  <Navigation className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">
                    Easy Navigation
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    Use our powerful search and filtering tools to quickly locate any place on campus.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center">
            <p className="text-lg text-slate-700 leading-relaxed">
              Built with care for the PSU community to make campus navigation simple and accessible for everyone.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
