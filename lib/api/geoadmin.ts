import type { GeoPoint, NoiseReading } from "../types";

/**
 * geo.admin.ch MapServer Identify endpoint.
 *
 * We query the BAFU noise layers (road: ch.bafu.laerm-strassenlaerm_tag,
 * rail: ch.bafu.laerm-bahnlaerm_tag) for a given WGS84 point. The service
 * returns a feature (if any) whose attribute `laerm_db` contains the Lden
 * value in decibels.
 *
 * Documentation: https://api3.geo.admin.ch/services/sdiservices.html#identify-features
 */

const IDENTIFY_URL = "https://api3.geo.admin.ch/rest/services/all/MapServer/identify";

async function identifyLayer(
  layer: string,
  point: GeoPoint,
): Promise<number | null> {
  // MapServer identify expects an imageDisplay, mapExtent and tolerance.
  // We fake a 1x1 map with a small bbox around the point.
  const delta = 0.0005;
  const bbox = [
    point.lon - delta,
    point.lat - delta,
    point.lon + delta,
    point.lat + delta,
  ].join(",");

  const params = new URLSearchParams({
    geometry: `${point.lon},${point.lat}`,
    geometryType: "esriGeometryPoint",
    geometryFormat: "geojson",
    imageDisplay: "1,1,96",
    mapExtent: bbox,
    tolerance: "5",
    layers: `all:${layer}`,
    sr: "4326",
    lang: "de",
  });

  const res = await fetch(`${IDENTIFY_URL}?${params.toString()}`);
  if (!res.ok) return null;
  const data = (await res.json()) as IdentifyResponse;
  const first = data.results?.[0];
  if (!first) return null;

  const attrs = first.attributes ?? {};
  // Different layers use different field names; try common ones.
  const candidates = ["laerm_db", "lr_db", "db", "value", "noise_db"];
  for (const key of candidates) {
    const raw = attrs[key];
    if (typeof raw === "number") return raw;
    if (typeof raw === "string" && !Number.isNaN(parseFloat(raw))) {
      return parseFloat(raw);
    }
  }
  return null;
}

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
