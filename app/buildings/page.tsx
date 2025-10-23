import Link from "next/link";
import BuildingCard from "@/components/BuildingCard";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export default function BuildingsPage() {
  return (
    <div className="py-12">
      <Container>
        <div className="space-y-12">
          <PageHeader
            title="Campus Buildings"
            subtitle="Explore interactive floor maps for all PSU campus buildings"
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <BuildingCard building="101" href="/buildings/101" />
            <BuildingCard building="104" href="/buildings/104" />
            <BuildingCard building="105" href="/buildings/105" />
          </div>
        </div>
      </Container>
    </div>
  );
}
