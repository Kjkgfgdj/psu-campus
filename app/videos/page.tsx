import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Video } from "lucide-react";

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
      <Container>
        <div className="py-20 space-y-16">
          {/* Header */}
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              Video Tours
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
              Campus Videos
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Explore video tours and guides for PSU campus facilities
            </p>
          </div>
          
          {/* Coming Soon Card */}
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-xl opacity-20"></div>
              
              <div className="relative rounded-3xl border-2 border-slate-200 bg-white p-16 text-center shadow-2xl">
                <div className="flex flex-col items-center space-y-6">
                  {/* Icon */}
                  <div className="relative">
                    <div className="absolute -inset-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-blue-100 to-cyan-100 p-8 rounded-3xl">
                      <Video className="h-16 w-16 text-blue-600" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-slate-900">
                      Videos Coming Soon
                    </h2>
                    <p className="text-lg text-slate-600 max-w-md mx-auto leading-relaxed">
                      We&apos;re working on creating comprehensive video guides for all campus buildings and facilities.
                    </p>
                    
                    {/* Progress indicator */}
                    <div className="pt-6">
                      <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                        In Development
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
