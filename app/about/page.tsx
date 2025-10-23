import { MapPin, Building2, Navigation } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/20">
      <Container className="max-w-5xl">
        <div className="py-20 space-y-16">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-2">
              ✨ About Our Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
              About PSU Campus
              <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Navigator
              </span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              Your comprehensive guide to Prince Sultan University
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-5 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-10 w-10 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                      Interactive Maps
                    </h2>
                    <p className="text-slate-600 leading-relaxed">
                      Navigate through buildings 101–105 with our detailed, interactive floor maps.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-5 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="h-10 w-10 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                      Full Coverage
                    </h2>
                    <p className="text-slate-600 leading-relaxed">
                      Explore all facilities including exam halls, dining areas, libraries, and offices.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-5 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Navigation className="h-10 w-10 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">
                      Easy Navigation
                    </h2>
                    <p className="text-slate-600 leading-relaxed">
                      Use our powerful search and filtering tools to quickly locate any place on campus.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-20"></div>
            <div className="relative rounded-3xl border border-green-200 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 p-12 text-center shadow-xl">
              <p className="text-2xl font-medium text-slate-800 leading-relaxed">
                Built with care for the PSU community to make campus navigation
                <span className="block mt-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-bold">
                  simple and accessible for everyone
                </span>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
