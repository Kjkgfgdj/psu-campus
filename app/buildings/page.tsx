import Link from "next/link";
import BuildingCard from "@/components/BuildingCard";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export default function BuildingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Container>
        <div className="py-20 space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              All Campus Buildings
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
              Campus Buildings
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Explore interactive floor maps and discover locations across all PSU campus buildings
            </p>
          </div>

          {/* Buildings Grid with Modern Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="group">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                <BuildingCard building="101" href="/buildings/101" />
              </div>
            </div>
            <div className="group">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                <BuildingCard building="104" href="/buildings/104" />
              </div>
            </div>
            <div className="group">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                <BuildingCard building="105" href="/buildings/105" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
