import Link from "next/link";
import AutocompleteSearch from "@/components/AutocompleteSearch";
import HomeCampusMap from "@/components/HomeCampusMap";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Chip } from "@/components/ui/Chip";

export const revalidate = 60;

export default function Home() {
  return (
    <div className="py-12 space-y-16">
      {/* Hero Section */}
      <Container>
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <PageHeader
            title="PSU Campus Navigator"
            subtitle="Discover and navigate Prince Sultan University with ease. Search buildings, classrooms, and facilities across campus."
            centered
          />
          
          {/* Large Search Bar */}
          <div className="mx-auto max-w-2xl">
            <AutocompleteSearch />
          </div>

          {/* Category Chips */}
          <div className="pt-4 flex flex-wrap justify-center gap-2">
            <Link href="/search">
              <Chip label="All Places" />
            </Link>
            <Link href="/search?cat=food">
              <Chip label="Food & Drinks" />
            </Link>
            <Link href="/search?cat=important">
              <Chip label="Important Places" />
            </Link>
            <Link href="/search?cat=exam">
              <Chip label="Exam Halls" />
            </Link>
            <Link href="/search?cat=public">
              <Chip label="Public Facilities" />
            </Link>
          </div>
        </div>
      </Container>

      {/* Campus Map Section */}
      <Container>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Campus Overview
            </h2>
            <p className="text-slate-600">
              Interactive map showing all PSU buildings and facilities
            </p>
          </div>
          <HomeCampusMap />
        </div>
      </Container>
    </div>
  );
}
