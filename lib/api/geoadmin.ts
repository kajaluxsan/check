import type { GeoPoint, NoiseReading } from "../types";

const IDENTIFY_URL = "https://api3.geo.admin.ch/rest/services/all/MapServer/identify";

async function identifyLayer(
  layer: string,
  point: GeoPoint,
): Promise<number | null> {
  const delta = 0.001;
  const bbox = [
    point.lon - delta,
    point.lat - delta,
    point.lon + delta,
    point.lat + delta,
  ].join(",");

  const params = new URLSearchParams({
    geometry: `${point.lon},${point.lat}`,
    geometryType: "esriGeometryPoint",
    imageDisplay: "100,100,96",
    mapExtent: bbox,
    tolerance: "10",
    layers: `all:${layer}`,
    sr: "4326",
    lang: "de",
    returnGeometry: "false",
  });

  const res = await fetch(`${IDENTIFY_URL}?${params.toString()}`);
  if (!res.ok) return null;
  const data = (await res.json()) as IdentifyResponse;
  const first = data.results?.[0];
  if (!first) return null;

  const attrs = first.attributes ?? {};

  // Try known field names first.
  for (const key of DB_FIELDS) {
    const raw = attrs[key];
    if (typeof raw === "number" && raw >= 20 && raw <= 100) return raw;
    if (typeof raw === "string") {
      const n = parseFloat(raw);
      if (!Number.isNaN(n) && n >= 20 && n <= 100) return n;
    }
  }

  // Fallback: scan all attributes for a plausible dB reading.
  for (const [, val] of Object.entries(attrs)) {
    if (typeof val === "number" && val >= 20 && val <= 100) return val;
  }
  return null;
}

const DB_FIELDS = [
  "lre_t", "lre_n",       // Lden tag / nacht
  "lr_tag", "lr_nacht",
  "laerm_db",
  "db", "value",
  "noise_db",
];

export async function fetchNoise(point: GeoPoint): Promise<NoiseReading> {
  const [road, rail] = await Promise.allSettled([
    identifyLayer("ch.bafu.laerm-strassenlaerm_tag", point),
    identifyLayer("ch.bafu.laerm-bahnlaerm_tag", point),
  ]);
  return {
    roadDb: road.status === "fulfilled" ? road.value : null,
    railDb: rail.status === "fulfilled" ? rail.value : null,
  };
}

interface IdentifyResponse {
  results?: Array<{
    attributes?: Record<string, unknown>;
  }>;
}
