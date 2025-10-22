import { Container } from "@/components/ui/Container";
import { Skeleton, SkeletonList } from "@/components/ui/Skeleton";

export default function SearchLoading() {
  return (
    <div className="py-8">
      <Container>
        <div className="space-y-6">
          <Skeleton className="h-12 w-full rounded-full" />
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
          <SkeletonList count={6} />
        </div>
      </Container>
    </div>
  );
}

