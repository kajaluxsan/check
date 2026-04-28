import type { GeoPoint } from "../types";

/**
 * Query the GWR (Gebäude- und Wohnungsregister) via geo.admin.ch MapServer.
 * Returns building data for the nearest building at a given coordinate.
 */

const IDENTIFY_URL = "https://api3.geo.admin.ch/rest/services/all/MapServer/identify";
const GWR_LAYER = "ch.bfs.gebaeude_wohnungs_register";

export interface GwrDwelling {
  number: string;
  floor: string;
  rooms: number | null;
  area: number | null;
  kitchen: boolean;
  yearBuilt: number | null;
}

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
  // Extended fields
  volume?: number;
  energyArea?: number;
  shelter?: boolean;
  buildingMonth?: number;
  egrid?: string;
  municipality?: string;
  canton?: string;
  hotWaterType?: string;
  hotWaterSource?: string;
  heatingType2?: string;
  heatingSource2?: string;
  address?: string;
  dwellingDetails?: GwrDwelling[];
}

const HEATING_TYPE: Record<string, string> = {
  "7400": "Kessel (Einzelfeuerung)",
  "7410": "Kessel (Gemeinschaftsfeuerung)",
  "7420": "Wärmepumpe",
  "7430": "Fernwärme",
  "7440": "Elektro (Direktheizung)",
  "7450": "Ofen",
  "7460": "Andere Wärmeerzeugung",
  "7100": "Einzelofenheizung",
  "7101": "Etagenheizung",
  "7102": "Zentralheizung",
  "7103": "Fernwärme",
  "7104": "Wärmepumpe",
  "7109": "Andere",
};

const HEATING_SOURCE: Record<string, string> = {
  "7500": "Heizöl",
  "7501": "Kohle",
  "7510": "Gas",
  "7520": "Elektrizität",
  "7530": "Holz",
  "7540": "Abwärme",
  "7541": "Geothermie",
  "7542": "Sonne",
  "7550": "Fernwärme",
  "7560": "Andere",
  "7570": "Luft",
  "7580": "Erdwärme / Wasser",
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

const FLOOR_CODE: Record<string, string> = {
  "3100": "Parterre",
  "3101": "1. OG",
  "3102": "2. OG",
  "3103": "3. OG",
  "3104": "4. OG",
  "3105": "5. OG",
  "3106": "6. OG",
  "3107": "7. OG",
  "3108": "8. OG",
  "3109": "9. OG",
  "3110": "10. OG+",
  "3400": "UG",
  "3401": "1. UG",
  "3402": "2. UG",
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

  // Parse dwelling details from array fields
  const dwellingDetails = parseDwellings(a);

  return {
    egid: String(a.egid ?? a.EGID ?? ""),
    buildingYear: toNum(a.gbauj ?? a.GBAUJ ?? a.baujahr),
    buildingCategory: resolve(BUILDING_CATEGORY, a.gkat ?? a.GKAT),
    heatingType: resolve(HEATING_TYPE, a.gwaerzh1 ?? a.gheiz ?? a.GHEIZ),
    heatingSource: resolve(HEATING_SOURCE, a.genh1 ?? a.gwaerm ?? a.GWAERM),
    floors: toNum(a.gastw ?? a.GASTW ?? a.geschosse),
    dwellings: toNum(a.ganzwhg ?? a.GANZWHG),
    area: toNum(a.garea ?? a.GAREA ?? a.gebaeude_flaeche),
    status: typeof a.gstat === "string" ? a.gstat : undefined,
    // Extended
    volume: toNum(a.gvol),
    energyArea: toNum(a.gebf),
    shelter: a.gschutzr === 1 || a.gschutzr === "1",
    buildingMonth: toNum(a.gbaum),
    egrid: typeof a.egrid === "string" ? a.egrid : undefined,
    municipality: typeof a.ggdename === "string" ? a.ggdename : undefined,
    canton: typeof a.gdekt === "string" ? a.gdekt : undefined,
    hotWaterType: resolve(HEATING_TYPE, a.gwaerzw1),
    hotWaterSource: resolve(HEATING_SOURCE, a.genw1),
    heatingType2: resolve(HEATING_TYPE, a.gwaerzh2),
    heatingSource2: resolve(HEATING_SOURCE, a.genh2),
    address: typeof a.strname_deinr === "string" ? a.strname_deinr : undefined,
    dwellingDetails: dwellingDetails.length > 0 ? dwellingDetails : undefined,
  };
}

function parseDwellings(a: Record<string, unknown>): GwrDwelling[] {
  const whgnr = a.whgnr as string[] | null;
  if (!Array.isArray(whgnr)) return [];

  const wstwk = (a.wstwk as number[] | null) ?? [];
  const wazim = (a.wazim as number[] | null) ?? [];
  const warea = (a.warea as number[] | null) ?? [];
  const wkche = (a.wkche as number[] | null) ?? [];
  const wbauj = (a.wbauj as number[] | null) ?? [];

  return whgnr.map((nr, i) => ({
    number: nr ?? "—",
    floor: resolve(FLOOR_CODE, wstwk[i]) ?? String(wstwk[i] ?? "—"),
    rooms: typeof wazim[i] === "number" ? wazim[i] : null,
    area: typeof warea[i] === "number" ? warea[i] : null,
    kitchen: wkche[i] === 1,
    yearBuilt: typeof wbauj[i] === "number" ? wbauj[i] : null,
  }));
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
