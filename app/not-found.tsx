import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { AlertCircle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="py-24">
      <Container>
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-red-100 p-6 rounded-2xl">
              <AlertCircle className="h-16 w-16 text-red-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-3">
                Page Not Found
              </h1>
              <p className="text-lg text-slate-600">
                Sorry, we couldn't find the page you're looking for.
              </p>
            </div>
          </div>
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </Container>
    </div>
  );
}

