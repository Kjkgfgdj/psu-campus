import SearchClient from "@/components/SearchClient"

export default function SearchPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  return <SearchClient initialParams={searchParams} />
}

export const dynamic = "force-dynamic"
