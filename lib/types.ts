// Shared domain types used across checkmiete.

export type CantonCode =
  | "ZH" | "BE" | "LU" | "UR" | "SZ" | "OW" | "NW" | "GL" | "ZG"
  | "FR" | "SO" | "BS" | "BL" | "SH" | "AR" | "AI" | "SG" | "GR"
  | "AG" | "TG" | "TI" | "VD" | "VS" | "NE" | "GE" | "JU";

export interface GeoPoint {
  lat: number;
  lon: number;
}

export interface NominatimResult extends GeoPoint {
  displayName: string;
  city?: string;
  town?: string;
  village?: string;
  postcode?: string;
  canton?: CantonCode;
  country?: string;
  houseNumber?: string;
}

export type PoiCategory =
  | "parking"
  | "supermarket"
  | "school"
  | "pharmacy"
  | "doctor"
  | "restaurant"
  | "station"
  | "bank"
  | "fuel"
  | "post"
  | "sport"
  | "park"
  | "library"
  | "kiosk"
  | "kindergarten"
  | "bus_tram"
  | "worship"
  | "culture";

export interface Poi extends GeoPoint {
  id: string;
  category: PoiCategory;
  name: string;
  distanceM: number;
}

export interface TransportStop extends GeoPoint {
  id: string;
  name: string;
  distanceM: number;
}

export interface TransportDeparture {
  time: string; // HH:MM
  destination: string;
  category: string;
  number: string;
}

export interface JourneySection {
  departureName: string;
  departureTime: string; // HH:MM
  arrivalName: string;
  arrivalTime: string; // HH:MM
  category: string; // e.g. "S", "IR", "Bus", or "walk"
  line: string; // e.g. "S41"
  direction: string;
  isWalk: boolean;
}

export interface JourneyResult {
  durationMin: number;
  departure: string; // HH:MM
  arrival: string; // HH:MM
  transfers: number;
  sections: JourneySection[];
}

export interface TaxInfo {
  municipalityTax: number; // percent
  cantonName: string;
  population?: number;
  vacancyRate?: number;
}

export type Verdict = "great" | "fair" | "slightly" | "overpriced";
