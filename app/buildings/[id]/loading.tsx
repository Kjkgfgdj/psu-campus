import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function BuildingLoading() {
  return (
    <div className="py-8">
      <Container>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </Container>
    </div>
  );
}

