import Link from "next/link";
import { MapPin, Building2, Search, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="container mx-auto max-w-[1120px] px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="bg-green-600 p-2 rounded-xl">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">PSU Campus</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Interactive campus maps for Prince Sultan University. 
              Navigate buildings 101–105 with ease and find any room, office, or facility.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold text-slate-900 mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
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
                  className="text-slate-600 hover:text-green-600 transition-colors text-sm hover:pl-1 transition-all"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Info */}
          <div>
            <h3 className="text-base font-semibold text-slate-900 mb-4">Contact</h3>
            <ul className="space-y-2.5 text-sm">
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
        <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} PSU Campus. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link 
              href="/about" 
              className="text-slate-600 hover:text-green-600 transition-colors text-sm"
            >
              Privacy
            </Link>
            <Link 
              href="/about" 
              className="text-slate-600 hover:text-green-600 transition-colors text-sm"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
