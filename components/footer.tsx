import Link from "next/link";
import { MapPin, Building2, Search, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-green-950"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxNmEzNGEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6bTAtOHYyaDJ2LTJoLTJ6bTQgNHYyaDJ2LTJoLTJ6bS00IDB2Mmgy di0yaC0yem0tNCA0djJoMnYtMmgtMnptOCAwdjJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600"></div>
      
      <div className="relative container mx-auto max-w-7xl px-6 py-20">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Section - Larger */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-50"></div>
                <div className="relative bg-gradient-to-br from-green-600 to-emerald-600 p-3.5 rounded-2xl shadow-xl">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white leading-tight">PSU Campus</h3>
                <p className="text-xs text-green-400 font-bold tracking-widest uppercase">Navigator</p>
              </div>
            </div>
            <p className="text-slate-300 text-base leading-relaxed max-w-md">
              Interactive campus navigation for Prince Sultan University. 
              Find any classroom, office, or facility across buildings 101–105 with our premium interactive maps.
            </p>
            
            {/* Social/Links */}
            <div className="flex gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="group relative">
                <div className="absolute -inset-2 bg-green-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition"></div>
                <div className="relative p-3 bg-slate-800 rounded-xl border border-slate-700 hover:border-green-500 hover:bg-slate-700 transition-all">
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
              <div className="h-1 w-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"></div>
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/" 
                  className="group text-slate-300 hover:text-green-400 transition-all flex items-center gap-3 text-sm"
                >
                  <MapPin className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:translate-x-1 transition-transform">Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/search" 
                  className="group text-slate-300 hover:text-green-400 transition-all flex items-center gap-3 text-sm"
                >
                  <Search className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:translate-x-1 transition-transform">Search</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/buildings" 
                  className="group text-slate-300 hover:text-green-400 transition-all flex items-center gap-3 text-sm"
                >
                  <Building2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:translate-x-1 transition-transform">Buildings</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="group text-slate-300 hover:text-green-400 transition-all flex items-center gap-3 text-sm"
                >
                  <span className="group-hover:translate-x-1 transition-transform">About</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
              <div className="h-1 w-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"></div>
              Contact
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-slate-300">
                <Mail className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>info@psu-campus.com</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <svg className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-medium text-white">Prince Sultan University</div>
                  <div className="text-slate-400 text-xs mt-0.5">Riyadh, Saudi Arabia</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Premium Design */}
        <div className="border-t border-slate-700/50 pt-10 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <p className="text-slate-400 text-sm">
                © {new Date().getFullYear()} PSU Campus Navigator
              </p>
              <span className="hidden md:block text-slate-600">•</span>
              <p className="text-slate-500 text-sm flex items-center gap-1.5">
                Made with <span className="text-red-500 animate-pulse">♥</span> for PSU
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Link 
                href="/about" 
                className="text-slate-400 hover:text-green-400 transition-all text-sm font-medium group"
              >
                <span className="group-hover:translate-x-0.5 inline-block transition-transform">Privacy</span>
              </Link>
              <Link 
                href="/about" 
                className="text-slate-400 hover:text-green-400 transition-all text-sm font-medium group"
              >
                <span className="group-hover:translate-x-0.5 inline-block transition-transform">Terms</span>
              </Link>
              <a 
                href="https://github.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-green-400 transition-all text-sm font-medium group"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
