import SearchClient from "@/components/SearchClient"

export default function Page({ searchParams }: { searchParams: { cat?: string; building?: string; floor?: string } }) {
  return <SearchClient />
}

export const dynamic = "force-dynamic"
