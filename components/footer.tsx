import Link from "next/link";
import { MapPin, Building2, Search, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#5C4033] text-white mt-auto">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-amber-100 p-1.5 rounded-lg">
                <Building2 className="h-5 w-5 text-amber-800" />
              </div>
              <h3 className="text-lg font-bold">PSU Campus</h3>
            </div>
            <p className="text-amber-100 text-sm leading-relaxed">
              Interactive campus maps for Prince Sultan University. 
              Navigate buildings 101–105 with ease and find any room, office, or facility.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-amber-100 hover:text-white transition-colors flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-amber-100 hover:text-white transition-colors flex items-center gap-2 text-sm">
                  <Search className="h-4 w-4" />
                  Search
                </Link>
              </li>
              <li>
                <Link href="/buildings" className="text-amber-100 hover:text-white transition-colors flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4" />
                  Buildings
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-amber-100 hover:text-white transition-colors flex items-center gap-2 text-sm">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-amber-100 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                info@psu-campus.com
              </li>
              <li className="text-amber-100">
                Prince Sultan University
              </li>
              <li className="text-amber-100">
                Riyadh, Saudi Arabia
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-amber-700/30 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-amber-100 text-sm">
            © {new Date().getFullYear()} PSU Campus. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link 
              href="/about" 
              className="text-amber-100 hover:text-white transition-colors text-sm"
            >
              Privacy
            </Link>
            <Link 
              href="/about" 
              className="text-amber-100 hover:text-white transition-colors text-sm"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

