import type { GeoPoint, NoiseReading } from "../types";

const IDENTIFY_URL = "https://api3.geo.admin.ch/rest/services/all/MapServer/identify";
const CATALOG_URL = "https://api3.geo.admin.ch/rest/services/all/MapServer";

// Cache discovered layer IDs so we only look them up once.
let roadLayerId: string | null | undefined;
let railLayerId: string | null | undefined;

async function discoverNoiseLayers(): Promise<{
  road: string | null;
  rail: string | null;
}> {
  if (roadLayerId !== undefined && railLayerId !== undefined) {
    return { road: roadLayerId, rail: railLayerId };
  }
  try {
    const res = await fetch(CATALOG_URL);
    if (!res.ok) throw new Error(`catalog ${res.status}`);
    const data = (await res.json()) as {
      layers: { layerBodId: string }[];
    };
    const ids = (data.layers ?? []).map((l) => l.layerBodId);

    // Find the first layer matching road noise (Strassenlärm Tag)
    roadLayerId =
      ids.find((id) => /laerm.*strassen.*tag/i.test(id)) ?? null;
    railLayerId =
      ids.find((id) => /laerm.*(bahn|eisenbahn).*tag/i.test(id)) ?? null;

    console.log("[checkmiete] noise layers:", { roadLayerId, railLayerId });
  } catch {
    roadLayerId = null;
    railLayerId = null;
  }
  return { road: roadLayerId, rail: railLayerId };
}

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

  // Try known field names, then fall back to any numeric value in dB range.
  for (const key of Object.keys(attrs)) {
    const val = attrs[key];
    const n = typeof val === "number" ? val : parseFloat(String(val));
    if (!Number.isNaN(n) && n >= 20 && n <= 100) return n;
  }
  return null;
}

export async function fetchNoise(point: GeoPoint): Promise<NoiseReading> {
  const layers = await discoverNoiseLayers();

  const [road, rail] = await Promise.allSettled([
    layers.road ? identifyLayer(layers.road, point) : Promise.resolve(null),
    layers.rail ? identifyLayer(layers.rail, point) : Promise.resolve(null),
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
