import type { GeoPoint, NoiseReading } from "../types";

/**
 * geo.admin.ch noise data via WMS GetFeatureInfo.
 *
 * The BAFU noise layers (ch.bafu.laerm-strassenlaerm_tag, ch.bafu.laerm-bahnlaerm_tag)
 * are raster layers without a GeoTable, so the REST MapServer/identify endpoint
 * returns "No GeoTable". WMS GetFeatureInfo works for these raster layers.
 */

const WMS_URL = "https://wms.geo.admin.ch/";

const ROAD_LAYER = "ch.bafu.laerm-strassenlaerm_tag";
const RAIL_LAYER = "ch.bafu.laerm-bahnlaerm_tag";

async function getFeatureInfo(
  layer: string,
  point: GeoPoint,
): Promise<number | null> {
  const delta = 0.0005;
  // WMS 1.3.0 + EPSG:4326: BBOX order is lat_min,lon_min,lat_max,lon_max
  const bbox = [
    point.lat - delta,
    point.lon - delta,
    point.lat + delta,
    point.lon + delta,
  ].join(",");

  const params = new URLSearchParams({
    SERVICE: "WMS",
    VERSION: "1.3.0",
    REQUEST: "GetFeatureInfo",
    LAYERS: layer,
    QUERY_LAYERS: layer,
    CRS: "EPSG:4326",
    BBOX: bbox,
    WIDTH: "101",
    HEIGHT: "101",
    I: "50",
    J: "50",
    INFO_FORMAT: "application/json",
  });

  const res = await fetch(`${WMS_URL}?${params.toString()}`);
  if (!res.ok) return null;

  const data = await res.json();

  // Response can be GeoJSON FeatureCollection or a plain object.
  const features = data?.features ?? [];
  if (features.length === 0) return null;

  const props = features[0]?.properties ?? {};

  // Scan all properties for a numeric dB value (20–100 range).
  for (const val of Object.values(props)) {
    const n = typeof val === "number" ? val : parseFloat(String(val));
    if (!Number.isNaN(n) && n >= 20 && n <= 100) return Math.round(n);
  }
  return null;
}

export async function fetchNoise(point: GeoPoint): Promise<NoiseReading> {
  const [road, rail] = await Promise.allSettled([
    getFeatureInfo(ROAD_LAYER, point),
    getFeatureInfo(RAIL_LAYER, point),
  ]);
  return {
    roadDb: road.status === "fulfilled" ? road.value : null,
    railDb: rail.status === "fulfilled" ? rail.value : null,
  };
}
