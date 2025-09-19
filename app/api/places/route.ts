import { NextRequest, NextResponse } from "next/server"

// Airtable configuration
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const AIRTABLE_TABLE_PLACES = process.env.AIRTABLE_TABLE_PLACES

interface AirtableRecord {
  id: string
  fields: {
    name?: string
    building?: number
    floor?: number
    category?: string
    description?: string
    videoUrl?: string
    x?: number
    y?: number
    slug?: string
  }
  createdTime: string
}

interface AirtableResponse {
  records: AirtableRecord[]
  offset?: string
}

interface Place {
  id: string
  name: string
  building: number
  floor: number
  category: string
  description: string
  videoUrl: string
  x: number
  y: number
  slug: string
}

export async function GET(request: NextRequest) {
  try {
    // Check for required environment variables
    if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_PLACES) {
      return NextResponse.json(
        { 
          error: "Missing Airtable configuration. Please set AIRTABLE_TOKEN, AIRTABLE_BASE_ID, and AIRTABLE_TABLE_PLACES environment variables." 
        },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    
    // Extract search parameters
    const building = searchParams.get("building")
    const floor = searchParams.get("floor") 
    const category = searchParams.get("category")
    const q = searchParams.get("q") // search query
    const offset = searchParams.get("offset")

    // Build Airtable filter formula
    const filters: string[] = []
    
    if (building && building !== "__all__") {
      filters.push(`{building} = ${Number(building)}`)
    }
    
    if (floor && floor !== "__all__") {
      filters.push(`{floor} = ${Number(floor)}`)
    }
    
    if (category && category !== "__all__") {
      // Escape quotes in category
      const escapedCategory = category.replace(/"/g, '""')
      filters.push(`{category} = "${escapedCategory}"`)
    }
    
    if (q && q.trim()) {
      // Escape quotes in search query
      const escapedQuery = q.trim().replace(/"/g, '""')
      filters.push(`OR(
        SEARCH("${escapedQuery}", {name}),
        SEARCH("${escapedQuery}", {description}),
        SEARCH("${escapedQuery}", {slug})
      )`)
    }

    // Construct the filter formula
    let filterFormula = ""
    if (filters.length > 0) {
      filterFormula = filters.length === 1 ? filters[0] : `AND(${filters.join(", ")})`
    }

    // Build Airtable API URL
    const airtableUrl = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_PLACES}`)
    
    if (filterFormula) {
      airtableUrl.searchParams.set("filterByFormula", filterFormula)
    }
    
    if (offset) {
      airtableUrl.searchParams.set("offset", offset)
    }
    
    // Set page size and sort
    airtableUrl.searchParams.set("pageSize", "100")
    airtableUrl.searchParams.set("sort[0][field]", "name")
    airtableUrl.searchParams.set("sort[0][direction]", "asc")

    // Make request to Airtable
    const response = await fetch(airtableUrl.toString(), {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          { error: "Invalid Airtable token" },
          { status: 401 }
        )
      }
      
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Airtable base or table not found" },
          { status: 404 }
        )
      }

      const errorText = await response.text()
      return NextResponse.json(
        { error: `Airtable API error: ${errorText}` },
        { status: response.status }
      )
    }

    const data: AirtableResponse = await response.json()

    // Map Airtable records to client Place type
    const places: Place[] = data.records.map((record) => ({
      id: record.id,
      name: record.fields.name || "",
      building: Number(record.fields.building) || 0,
      floor: Number(record.fields.floor) || 0,
      category: record.fields.category || "",
      description: record.fields.description || "",
      videoUrl: record.fields.videoUrl || "",
      x: Number(record.fields.x) || 0,
      y: Number(record.fields.y) || 0,
      slug: record.fields.slug || "",
    }))

    return NextResponse.json({
      places,
      offset: data.offset,
    })

  } catch (error) {
    console.error("Places API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
