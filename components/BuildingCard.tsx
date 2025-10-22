import Link from "next/link";
import { Card } from "@/components/ui/card";

type Props = { 
  building: string; 
  href: string;
};

export default function BuildingCard({ building, href }: Props) {
  return (
    <Link href={href} className="block group">
      <Card className="rounded-2xl shadow-lg hover:shadow-2xl border-2 border-amber-100 hover:border-amber-300 transition-all duration-300 p-8 bg-gradient-to-br from-white to-amber-50/30 group-hover:scale-105">
        <div className="flex items-center justify-center h-24">
          <h3 className="text-2xl font-bold text-amber-900 group-hover:text-amber-700 transition-colors">
            Building {building}
          </h3>
        </div>
      </Card>
    </Link>
  );
}