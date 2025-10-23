"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Building2, MapPin, ArrowRight } from "lucide-react";
import { transitionNavigate } from "@/lib/view-transitions";

type Props = { 
  building: string; 
  href: string;
};

export default function BuildingCard({ building, href }: Props) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    transitionNavigate(() => {
      router.push(href);
    });
  };

  return (
    <Link 
      href={href} 
      onClick={handleClick}
      className="block group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-500/30 rounded-3xl"
      aria-label={`View floor maps for Building ${building}`}
    >
      <div className="relative">
        <Card className="relative card rounded-3xl border-2 border-slate-200 hover:border-green-500 transition-all duration-500 p-10 bg-white group-hover:scale-[1.02] group-active:scale-[0.98] overflow-hidden">
          {/* Material Design 3 state layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/0 via-emerald-50/0 to-green-50/0 group-hover:from-green-50/50 group-hover:via-emerald-50/30 group-hover:to-green-50/50 transition-all duration-500" aria-hidden="true"></div>
          
          <div className="relative flex flex-col items-center text-center space-y-5">
            {/* Fluent 2 inspired icon container */}
            <div className="relative">
              {/* Glow effect on hover */}
              <div className="absolute -inset-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" aria-hidden="true"></div>
              
              {/* Icon surface */}
              <div 
                className="relative bg-gradient-to-br from-green-100 to-emerald-100 p-5 rounded-2xl group-hover:bg-gradient-to-br group-hover:from-green-600 group-hover:to-emerald-600 transition-all duration-500 group-hover:scale-110 shadow-lg"
                aria-hidden="true"
              >
                <Building2 className="h-10 w-10 text-green-600 group-hover:text-white transition-colors duration-500" aria-hidden="true" />
              </div>
            </div>
            
            <div>
              <h3 className="card-title text-3xl font-bold text-slate-900 group-hover:text-green-600 transition-colors mb-3">
                Building {building}
              </h3>
              
              {/* Material Design 3 chip button */}
              <div className="inline-flex items-center justify-center gap-2 text-slate-600 text-sm font-semibold bg-slate-50 group-hover:bg-green-50 group-hover:text-green-700 px-4 py-2.5 rounded-full transition-all duration-300 shadow-sm group-hover:shadow-md">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                <span>View floor maps</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Link>
  );
}
