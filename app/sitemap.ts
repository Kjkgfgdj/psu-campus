import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.psu-campus.com'
  
  // Building pages
  const buildings = [101, 104, 105]
  const buildingPages = buildings.flatMap(building => {
    // Ground floor + additional floors for each building
    const floors = building === 104 ? [0, 1, 2, 3] : [0, 1, 2]
    return floors.map(floor => ({
      url: `${baseUrl}/buildings/${building}?floor=${floor}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  })

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...buildingPages,
  ]
}

