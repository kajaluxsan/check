import type { GeoPoint } from "../types";

/**
 * Build WMS GetMap URLs for BAFU noise layers.
 *
 * The noise layers are raster-only — neither REST identify nor WMS
 * GetFeatureInfo return dB values. Instead we show the official noise map
 * as a visual overlay (WMS GetMap image).
 */

const WMS_BASE = "https://wms.geo.admin.ch/";

export const ROAD_LAYER = "ch.bafu.laerm-strassenlaerm_tag";
export const RAIL_LAYER = "ch.bafu.laerm-bahnlaerm_tag";

/**
 * Returns a WMS GetMap image URL for a noise layer centered on a point.
 * The image can be displayed directly in an <img> tag.
 */
export function getNoiseMapUrl(
  layer: string,
  center: GeoPoint,
  widthPx = 480,
  heightPx = 300,
  radiusM = 600,
): string {
  // Convert radius in meters to approximate degrees.
  const dLat = radiusM / 111_320;
  const dLon = radiusM / (111_320 * Math.cos((center.lat * Math.PI) / 180));

  // WMS 1.3.0 + EPSG:4326: BBOX = lat_min,lon_min,lat_max,lon_max
  const bbox = [
    center.lat - dLat,
    center.lon - dLon,
    center.lat + dLat,
    center.lon + dLon,
  ].join(",");

  const params = new URLSearchParams({
    SERVICE: "WMS",
    VERSION: "1.3.0",
    REQUEST: "GetMap",
    LAYERS: `ch.swisstopo.pixelkarte-grau,${layer}`,
    CRS: "EPSG:4326",
    BBOX: bbox,
    WIDTH: widthPx.toString(),
    HEIGHT: heightPx.toString(),
    FORMAT: "image/png",
  });

  return `${WMS_BASE}?${params.toString()}`;
}

/**
 * WMTS tile URL template for overlaying noise on a Leaflet map.
 */
export function getNoiseTileUrl(layer: string): string {
  return `https://wmts.geo.admin.ch/1.0.0/${layer}/default/current/3857/{z}/{x}/{y}.png`;
}

/**
 * Noise legend — official BAFU dB ranges and their corresponding colors.
 */
export const NOISE_LEGEND: { min: number; max: number; color: string; label: string }[] = [
  { min: 0,  max: 45, color: "#1a9641", label: "< 45 dB — Sehr ruhig" },
  { min: 45, max: 50, color: "#a6d96a", label: "45–50 dB — Ruhig" },
  { min: 50, max: 55, color: "#ffffbf", label: "50–55 dB — Normal" },
  { min: 55, max: 60, color: "#fdae61", label: "55–60 dB — Mässig" },
  { min: 60, max: 65, color: "#f46d43", label: "60–65 dB — Laut" },
  { min: 65, max: 70, color: "#d73027", label: "65–70 dB — Sehr laut" },
  { min: 70, max: 999, color: "#a50026", label: "> 70 dB — Extrem" },
];
