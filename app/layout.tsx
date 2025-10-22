// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import SiteNav from "@/components/site-nav";
import Footer from "@/components/footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const playfair = Playfair_Display({ 
  variable: "--font-playfair", 
  subsets: ["latin"],
  weight: ["400", "700"],
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.psu-campus.com"),
  title: {
    default: "PSU Campus — Interactive Maps",
    template: "%s · PSU Campus",
  },
  description:
    "Interactive campus maps for Prince Sultan University (buildings 101–105, floors & wayfinding).",
  openGraph: {
    type: "website",
    url: "https://www.psu-campus.com",
    siteName: "PSU Campus",
    title: "PSU Campus — Interactive Maps",
    description:
      "Find rooms, offices, and facilities across PSU buildings with interactive maps.",
    images: [{ url: "/og-psu-campus.png", width: 1200, height: 630, alt: "PSU Campus Maps" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PSU Campus — Interactive Maps",
    description:
      "Find rooms, offices, and facilities across PSU buildings with interactive maps.",
    images: ["/og-psu-campus.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${inter.variable} antialiased min-h-screen bg-slate-50 text-slate-900 flex flex-col`}>
        <SiteNav />
        <main className="flex-grow w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}