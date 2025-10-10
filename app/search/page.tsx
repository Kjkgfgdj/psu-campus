import SearchClient from "@/components/SearchClient"
import { listAllPlaces } from "@/lib/airtable"
import type { Place } from "@/lib/types"

export default async function SearchPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const places = (await listAllPlaces()) as unknown as Place[]
  return <SearchClient places={places} />
}

export const dynamic = "force-dynamic"
