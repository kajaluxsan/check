import type { GeoPoint } from "../types";

/**
 * Query the GWR (Gebäude- und Wohnungsregister) via geo.admin.ch MapServer.
 * Returns building data for the nearest building at a given coordinate.
 */

const IDENTIFY_URL = "https://api3.geo.admin.ch/rest/services/all/MapServer/identify";
const GWR_LAYER = "ch.bfs.gebaeude_wohnungs_register";

export interface GwrBuilding {
  egid: string;
  buildingYear?: number;
  buildingCategory?: string;
  heatingType?: string;
  heatingSource?: string;
  floors?: number;
  dwellings?: number;
  area?: number;
  status?: string;
}

const HEATING_TYPE: Record<string, string> = {
  "7100": "Einzelofenheizung",
  "7101": "Etagenheizung",
  "7102": "Zentralheizung",
  "7103": "Fernwärme",
  "7104": "Wärmepumpe",
  "7109": "Andere",
};

const HEATING_SOURCE: Record<string, string> = {
  "7200": "Luft",
  "7201": "Erdwärme",
  "7202": "Wasser",
  "7210": "Öl",
  "7211": "Gas",
  "7212": "Holz",
  "7213": "Elektrizität",
  "7214": "Sonne",
  "7215": "Fernwärme",
  "7219": "Andere",
};

const BUILDING_CATEGORY: Record<string, string> = {
  "1010": "Provisorische Unterkunft",
  "1020": "Einfamilienhaus",
  "1021": "Einfamilienhaus (freistehend)",
  "1025": "Doppeleinfamilienhaus",
  "1030": "Mehrfamilienhaus",
  "1040": "Wohn- und Geschäftshaus",
  "1060": "Gebäude mit teilweiser Wohnnutzung",
  "1080": "Gebäude ohne Wohnnutzung",
};

export async function fetchGwrBuilding(
  point: GeoPoint,
): Promise<GwrBuilding | null> {
  const delta = 0.0003;
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
    tolerance: "15",
    layers: `all:${GWR_LAYER}`,
    sr: "4326",
    lang: "de",
    returnGeometry: "false",
  });

  const res = await fetch(`${IDENTIFY_URL}?${params.toString()}`);
  if (!res.ok) return null;

  const data = (await res.json()) as {
    results?: Array<{ attributes?: Record<string, unknown> }>;
  };

  const first = data.results?.[0];
  if (!first?.attributes) return null;
  const a = first.attributes;

  return {
    egid: String(a.egid ?? a.EGID ?? ""),
    buildingYear: toNum(a.gbauj ?? a.GBAUJ ?? a.baujahr),
    buildingCategory: resolve(BUILDING_CATEGORY, a.gkat ?? a.GKAT),
    heatingType: resolve(HEATING_TYPE, a.gheiz ?? a.GHEIZ),
    heatingSource: resolve(HEATING_SOURCE, a.gwaerm ?? a.GWAERM ?? a.gwaerme),
    floors: toNum(a.gastw ?? a.GASTW ?? a.geschosse),
    dwellings: toNum(a.ganzwhg ?? a.GANZWHG),
    area: toNum(a.garea ?? a.GAREA ?? a.gebaeude_flaeche),
    status: typeof a.gstat === "string" ? a.gstat : undefined,
  };
}

function toNum(v: unknown): number | undefined {
  if (v == null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function resolve(map: Record<string, string>, v: unknown): string | undefined {
  if (v == null) return undefined;
  const key = String(v);
  return map[key] ?? (typeof v === "string" && v.length > 2 ? v : undefined);
}
