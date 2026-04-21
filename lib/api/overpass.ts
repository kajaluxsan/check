import type { GeoPoint, Poi, PoiCategory } from "../types";

/**
 * Query the Overpass API for POIs around a point using an Overpass QL query.
 * Categories map to OSM tags. We bundle all categories in a single request
 * to minimise round-trips.
 */

const CATEGORY_QUERY: Record<PoiCategory, string> = {
  parking:     '["amenity"="parking"]',
  supermarket: '["shop"="supermarket"]',
  school:      '["amenity"~"^(school|kindergarten)$"]',
  pharmacy:    '["amenity"="pharmacy"]',
  doctor:      '["amenity"~"^(doctors|clinic|hospital)$"]',
  restaurant:  '["amenity"~"^(restaurant|cafe|fast_food)$"]',
  station:     '["railway"="station"]',
};

export async function fetchPois(
  center: GeoPoint,
  radiusM: number,
  categories: PoiCategory[] = Object.keys(CATEGORY_QUERY) as PoiCategory[],
): Promise<Poi[]> {
  const parts = categories
    .map((cat) => {
      const filter = CATEGORY_QUERY[cat];
      return `nwr${filter}(around:${radiusM},${center.lat},${center.lon});`;
    })
    .join("\n");

  const limit = radiusM > 5000 ? 200 : 500;
  const query = `[out:json][timeout:30];(${parts});out center ${limit};`;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "data=" + encodeURIComponent(query),
  });

  if (!res.ok) throw new Error(`Overpass ${res.status}`);
  const data = (await res.json()) as OverpassResponse;

  return (data.elements ?? [])
    .map((el) => toPoi(el, center))
    .filter((p): p is Poi => p !== null);
}

function toPoi(el: OverpassElement, center: GeoPoint): Poi | null {
  const lat = el.lat ?? el.center?.lat;
  const lon = el.lon ?? el.center?.lon;
  if (lat == null || lon == null) return null;

  const tags = el.tags ?? {};
  const category = classify(tags);
  if (!category) return null;

  const name =
    tags.name ??
    tags["name:de"] ??
    tags.brand ??
    tags.operator ??
    defaultName(category);

  return {
    id: `${el.type}/${el.id}`,
    lat,
    lon,
    name,
    category,
    distanceM: Math.round(haversine(center, { lat, lon })),
  };
}

function classify(tags: Record<string, string>): PoiCategory | null {
  if (tags.amenity === "parking") return "parking";
  if (tags.shop === "supermarket") return "supermarket";
  if (tags.amenity === "school" || tags.amenity === "kindergarten") return "school";
  if (tags.amenity === "pharmacy") return "pharmacy";
  if (["doctors", "clinic", "hospital"].includes(tags.amenity ?? "")) return "doctor";
  if (["restaurant", "cafe", "fast_food"].includes(tags.amenity ?? "")) return "restaurant";
  if (tags.railway === "station") return "station";
  return null;
}

function defaultName(cat: PoiCategory): string {
  const defaults: Record<PoiCategory, string> = {
    parking: "Parkplatz",
    supermarket: "Supermarkt",
    school: "Schule",
    pharmacy: "Apotheke",
    doctor: "Arzt",
    restaurant: "Restaurant",
    station: "Bahnhof",
  };
  return defaults[cat];
}

export function haversine(a: GeoPoint, b: GeoPoint): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
}
