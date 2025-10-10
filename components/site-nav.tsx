import Link from "next/link";
import NavMenuUI from "@/components/NavMenuUI.client";

export default function SiteNav() {
  return (
    <header className="bg-page sticky top-0 z-50 border-b border-black/5">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
          PSU Campus
        </Link>
        <NavMenuUI />
      </div>
    </header>
  );
}


