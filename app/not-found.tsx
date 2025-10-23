import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { AlertCircle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/20 flex items-center justify-center py-24">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600/30 to-orange-600/30 rounded-3xl blur-2xl"></div>
            
            <div className="relative bg-white rounded-3xl shadow-2xl ring-2 ring-slate-200/50 p-16">
              <div className="text-center space-y-10">
                {/* Icon */}
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    <div className="absolute -inset-3 bg-red-600/20 rounded-full blur-2xl animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-red-100 to-orange-100 p-8 rounded-3xl shadow-xl">
                      <AlertCircle className="h-20 w-20 text-red-600" />
                    </div>
                  </div>
                  
                  {/* Text */}
                  <div className="space-y-4">
                    <h1 className="text-6xl font-bold text-slate-900 tracking-tight">
                      404
                    </h1>
                    <h2 className="text-3xl font-bold text-slate-900">
                      Page Not Found
                    </h2>
                    <p className="text-xl text-slate-600 max-w-md mx-auto leading-relaxed">
                      Sorry, we couldn&apos;t find the page you&apos;re looking for.
                    </p>
                  </div>
                </div>
                
                {/* CTA Button */}
                <div className="pt-4">
                  <Link
                    href="/"
                    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-4 text-white font-bold shadow-xl shadow-green-600/30 hover:shadow-2xl hover:shadow-green-600/40 transition-all duration-300 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Home className="relative h-5 w-5" />
                    <span className="relative">Back to Home</span>
                    <svg className="relative h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

