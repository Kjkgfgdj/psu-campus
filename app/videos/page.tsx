import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Video } from "lucide-react";

export default function VideosPage() {
  return (
    <div className="py-12">
      <Container>
        <div className="space-y-12">
          <PageHeader
            title="Campus Videos"
            subtitle="Explore video tours and guides for PSU campus facilities"
            centered
          />
          
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-slate-100 p-6 rounded-2xl">
                <Video className="h-12 w-12 text-slate-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  Videos Coming Soon
                </h2>
                <p className="text-slate-600 max-w-md mx-auto">
                  We're working on creating comprehensive video guides for all campus buildings and facilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
