import AutocompleteSearch from "@/components/AutocompleteSearch";
import HomeCampusMap from "@/components/HomeCampusMap";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const revalidate = 60;

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-emerald-50/20 to-slate-50">
      {/* Unified Hero Section - Everything in One Beautiful Flow */}
      <div className="relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-green-50/50 to-emerald-50/40"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxNmEzNGEiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6bTAtOHYyaDJ2LTJoLTJ6bTQgNHYyaDJ2LTJoLTJ6bS00IDB2Mmgy di0yaC0yem0tNCA0djJoMnYtMmgtMnptOCAwdjJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>
        
        <Container>
          <div className="relative py-16 md:py-24 space-y-16">
            {/* Title + Search + Stats - All Together */}
            <div className="max-w-5xl mx-auto text-center space-y-12">
              {/* Title */}
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <h1 className="text-6xl md:text-8xl font-bold text-slate-900 tracking-tight leading-[1.05]">
                  PSU Campus
                  <span className="block bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 bg-clip-text text-transparent">
                    Navigator
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
                  Discover and navigate Prince Sultan University with ease. 
                  <span className="block mt-2">Interactive maps for buildings, classrooms, and facilities.</span>
                </p>
              </div>

              {/* Floating Search Bar */}
              <div className="mx-auto max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-lg opacity-20"></div>
                  <div className="relative backdrop-blur-xl bg-white/80 rounded-2xl shadow-2xl ring-1 ring-slate-200/50 p-2">
                    <AutocompleteSearch />
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 animate-in fade-in duration-1000 delay-500">
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">5</div>
                  <div className="text-sm text-slate-600 mt-2 font-medium">Buildings</div>
                </div>
                <div className="text-center border-x border-slate-200">
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">100+</div>
                  <div className="text-sm text-slate-600 mt-2 font-medium">Locations</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">3D</div>
                  <div className="text-sm text-slate-600 mt-2 font-medium">Maps</div>
                </div>
              </div>
            </div>

            {/* Interactive Campus Map - Integrated into Hero */}
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-1000 delay-700 pt-32">
              {/* Section Label */}
              <div className="flex items-center justify-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-green-700 px-5 py-2.5 rounded-full text-sm font-bold shadow-lg ring-1 ring-green-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Interactive Campus Map
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
              </div>

              {/* Map Card */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative bg-white rounded-3xl shadow-2xl ring-2 ring-slate-200/50 overflow-hidden">
                  <div className="p-8 md:p-12">
                    <HomeCampusMap />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
