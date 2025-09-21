import Link from "next/link";
import { Card } from "@/components/ui/card";

type Props = { 
  building: string; 
  href: string;
};

export default function BuildingCard({ building, href }: Props) {
  return (
    <Link href={href} className="block">
      <Card className="rounded-2xl shadow-sm hover:ring-2 hover:ring-primary transition-all duration-200 p-8">
        <div className="flex items-center justify-center h-24">
          <h3 className="text-2xl font-semibold text-gray-900">
            Building {building}
          </h3>
        </div>
      </Card>
    </Link>
  );
}