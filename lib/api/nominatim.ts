import type { CantonCode, NominatimResult } from "../types";

export async function geocodeAddress(
  query: string,
): Promise<NominatimResult | null> {
  const params = new URLSearchParams({
    q: `${query} Schweiz`,
    format: "json",
    addressdetails: "1",
    limit: "1",
    countrycodes: "ch",
  });

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
    {
      headers: {
        "User-Agent": "checkmiete.ch/1.0",
        Accept: "application/json",
      },
    },
  );

  if (!res.ok) throw new Error(`Nominatim ${res.status}`);
  const data = (await res.json()) as RawNominatim[];
  if (!data.length) return null;

  const raw = data[0];
  const addr = raw.address ?? {};
  const iso = (addr["ISO3166-2-lvl4"] ?? "").replace("CH-", "").toUpperCase();

  return {
    lat: parseFloat(raw.lat),
    lon: parseFloat(raw.lon),
    displayName: raw.display_name,
    city: addr.city ?? addr.town ?? addr.village,
    town: addr.town,
    village: addr.village,
    postcode: addr.postcode,
    canton: isCanton(iso) ? iso : undefined,
    country: addr.country,
    houseNumber: addr.house_number,
    suburb: addr.suburb,
    quartier: addr.suburb ?? addr.city_district,
    importance: raw.importance ?? 0,
  };
}

function isCanton(code: string): code is CantonCode {
  return [
    "ZH","BE","LU","UR","SZ","OW","NW","GL","ZG","FR","SO","BS","BL","SH",
    "AR","AI","SG","GR","AG","TG","TI","VD","VS","NE","GE","JU",
  ].includes(code);
}

interface RawNominatim {
  lat: string;
  lon: string;
  display_name: string;
  importance?: number;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    city_district?: string;
    postcode?: string;
    country?: string;
    house_number?: string;
    "ISO3166-2-lvl4"?: string;
  };
}
