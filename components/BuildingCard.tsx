import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Building2, MapPin } from "lucide-react";

type Props = { 
  building: string; 
  href: string;
};

export default function BuildingCard({ building, href }: Props) {
  return (
    <Link href={href} className="block group">
      <div className="relative">
        <Card className="relative card rounded-3xl shadow-lg hover:shadow-2xl border-2 border-slate-200 hover:border-green-500 transition-all duration-500 p-10 bg-white group-hover:scale-105 overflow-hidden">
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/0 via-emerald-50/0 to-green-50/0 group-hover:from-green-50/50 group-hover:via-emerald-50/30 group-hover:to-green-50/50 transition-all duration-500"></div>
          
          <div className="relative flex flex-col items-center text-center space-y-5">
            {/* Icon with premium styling */}
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-green-100 to-emerald-100 p-5 rounded-2xl group-hover:bg-gradient-to-br group-hover:from-green-600 group-hover:to-emerald-600 transition-all duration-500 group-hover:scale-110 shadow-lg">
                <Building2 className="h-10 w-10 text-green-600 group-hover:text-white transition-colors duration-500" />
              </div>
            </div>
            
            <div>
              <h3 className="card-title text-3xl font-bold text-slate-900 group-hover:text-green-600 transition-colors mb-3">
                Building {building}
              </h3>
              <div className="inline-flex items-center justify-center gap-2 text-slate-600 text-sm font-medium bg-slate-50 group-hover:bg-green-50 group-hover:text-green-700 px-4 py-2 rounded-full transition-all duration-300">
                <MapPin className="h-4 w-4" />
                View floor maps
                <svg className="h-3 w-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Link>
  );
}
