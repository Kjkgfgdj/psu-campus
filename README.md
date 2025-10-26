# PSU Campus — Interactive Map & Directory (Next.js)

An interactive campus navigation web app for **Prince Sultan University** with:
- **Building pages** (photos, videos, and rich details)
- **Multi‑floor overlays** (switch floors and see rooms/places)
- **Fast search** with categories, filters, and autocomplete
- **Embeds** for key locations (YouTube/Vimeo or local video)

> Tech: **Next.js**, **React**, **TypeScript**, **Node.js**, **Airtable API**, **PostCSS/CSS**

---

##  Features
- **Interactive map** with building polygons/markers and floor switching
- **Directory** of places (departments, labs, services, cafeterias, parking)
- **Fuzzy search + filters** (category, building, floor, tags)
- **Media‑rich place pages** (images, video, opening hours, directions)
- **Mobile‑first UI** with responsive layout

---

##  Architecture
- **Next.js App Router** (server components where helpful)
- **Data source**: Airtable (Buildings / Floors / Places) or JSON fallback
- **API routes** (e.g., `/api/places`, `/api/search`) to serve normalized data
- **Client components** for map + search UI
- **Styling**: PostCSS/CSS modules (no framework lock‑in)

