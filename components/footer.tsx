import Link from "next/link";
import { MapPin, Building2, Search, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-200 bg-gradient-to-br from-slate-50 via-white to-green-50/20 mt-auto">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-600/20 to-transparent"></div>
      
      <div className="container mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-2.5 rounded-xl shadow-lg shadow-green-600/20">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">PSU Campus</h3>
                <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Navigator</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
              Interactive campus maps for Prince Sultan University. 
              Navigate buildings 101–105 with ease and find any room, office, or facility.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-5">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-slate-600 hover:text-green-600 transition-colors flex items-center gap-2 text-sm group"
                >
                  <MapPin className="h-4 w-4 group-hover:text-green-600" />
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/search" 
                  className="text-slate-600 hover:text-green-600 transition-colors flex items-center gap-2 text-sm group"
                >
                  <Search className="h-4 w-4 group-hover:text-green-600" />
                  Search
                </Link>
              </li>
              <li>
                <Link 
                  href="/buildings" 
                  className="text-slate-600 hover:text-green-600 transition-colors flex items-center gap-2 text-sm group"
                >
                  <Building2 className="h-4 w-4 group-hover:text-green-600" />
                  Buildings
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-slate-600 hover:text-green-600 transition-all text-sm hover:pl-1"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Info */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-5">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="text-slate-600 flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                info@psu-campus.com
              </li>
              <li className="text-slate-600">
                Prince Sultan University
              </li>
              <li className="text-slate-600">
                Riyadh, Saudi Arabia
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200/60 pt-8 mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <p className="text-slate-600 text-sm">
              © {new Date().getFullYear()} PSU Campus Navigator
            </p>
            <span className="hidden md:block text-slate-300">•</span>
            <p className="text-slate-500 text-sm">
              Made with <span className="text-red-500">♥</span> for PSU
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link 
              href="/about" 
              className="text-slate-600 hover:text-green-600 transition-all text-sm font-medium hover:translate-x-0.5 inline-block"
            >
              Privacy
            </Link>
            <Link 
              href="/about" 
              className="text-slate-600 hover:text-green-600 transition-all text-sm font-medium hover:translate-x-0.5 inline-block"
            >
              Terms
            </Link>
            <a 
              href="https://github.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-green-600 transition-all text-sm font-medium hover:scale-110 inline-block"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
