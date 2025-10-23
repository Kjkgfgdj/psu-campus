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
      <Card className="card rounded-2xl shadow-sm hover:shadow-lg border border-slate-200 hover:border-green-600 transition-all duration-300 p-8 bg-white group-hover:scale-[1.02]">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-green-100 p-4 rounded-2xl group-hover:bg-green-600 transition-colors">
            <Building2 className="h-8 w-8 text-green-600 group-hover:text-white transition-colors" />
          </div>
          <div>
            <h3 className="card-title text-2xl font-bold text-slate-900 group-hover:text-green-600 transition-colors">
              Building {building}
            </h3>
            <p className="text-slate-600 text-sm mt-2 flex items-center justify-center gap-1">
              <MapPin className="h-4 w-4" />
              View floor maps
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
