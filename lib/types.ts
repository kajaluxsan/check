// Shared domain types used across the rent checker.

export type CantonCode =
  | "ZH" | "BE" | "LU" | "UR" | "SZ" | "OW" | "NW" | "GL" | "ZG"
  | "FR" | "SO" | "BS" | "BL" | "SH" | "AR" | "AI" | "SG" | "GR"
  | "AG" | "TG" | "TI" | "VD" | "VS" | "NE" | "GE" | "JU";

export type RoomKey =
  | "1" | "1.5" | "2" | "2.5" | "3" | "3.5" | "4" | "4.5" | "5" | "5.5" | "6";

export type Noise = "quiet" | "normal" | "loud" | "veryLoud";
export type Floor = "ground" | "low" | "mid" | "high";
export type Condition = "new" | "renovated" | "good" | "old" | "needsWork";

export interface Canton {
  code: CantonCode;
  name: string;
  nameFr?: string;
  region: "Deutschschweiz" | "Romandie" | "Tessin";
  /** Median monthly gross rent (CHF) by room count. */
  rents: Record<RoomKey, number>;
}

export interface CheckInput {
  canton: CantonCode | string;
  rooms: RoomKey | string;
  size: number; // m²
  price: number; // CHF / month
  noise: Noise;
  floor: Floor;
  condition: Condition;
}

export type Verdict = "steal" | "fair" | "slightly" | "overpriced" | "scam";

export interface CheckResult {
  canton: Canton;
  expected: number;
  expectedLow: number;
  expectedHigh: number;
  actual: number;
  diff: number;
  diffPct: number;
  verdict: Verdict;
  pricePerSqm: number;
  headline: string;
  summary: string;
  advice: string[];
  modifiers: { label: string; value: number }[];
}
