import type { Canton, CantonCode } from "../types";

/**
 * All 26 Swiss cantons with approximate median monthly gross rents (CHF, inkl. NK)
 * per room count. Values are derived from BFS Strukturerhebung 2023 (public data,
 * opendata.swiss). For a production deployment these numbers should be replaced
 * by the official CSV and updated yearly.
 *
 * Rooms keys follow the Swiss convention (1, 1.5, 2, 2.5, ... up to 6).
 */
export const CANTONS: Canton[] = [
  {
    code: "ZH", name: "Zürich", region: "Deutschschweiz",
    rents: { "1": 1250, "1.5": 1430, "2": 1680, "2.5": 1870, "3": 2080, "3.5": 2320, "4": 2580, "4.5": 2840, "5": 3160, "5.5": 3410, "6": 3680 },
  },
  {
    code: "BE", name: "Bern", region: "Deutschschweiz",
    rents: { "1": 910, "1.5": 1060, "2": 1240, "2.5": 1400, "3": 1580, "3.5": 1770, "4": 1970, "4.5": 2190, "5": 2450, "5.5": 2650, "6": 2850 },
  },
  {
    code: "LU", name: "Luzern", region: "Deutschschweiz",
    rents: { "1": 960, "1.5": 1120, "2": 1320, "2.5": 1490, "3": 1680, "3.5": 1880, "4": 2100, "4.5": 2330, "5": 2610, "5.5": 2820, "6": 3040 },
  },
  {
    code: "UR", name: "Uri", region: "Deutschschweiz",
    rents: { "1": 760, "1.5": 880, "2": 1020, "2.5": 1160, "3": 1320, "3.5": 1470, "4": 1640, "4.5": 1820, "5": 2030, "5.5": 2210, "6": 2380 },
  },
  {
    code: "SZ", name: "Schwyz", region: "Deutschschweiz",
    rents: { "1": 1070, "1.5": 1240, "2": 1450, "2.5": 1640, "3": 1850, "3.5": 2070, "4": 2310, "4.5": 2560, "5": 2860, "5.5": 3090, "6": 3320 },
  },
  {
    code: "OW", name: "Obwalden", region: "Deutschschweiz",
    rents: { "1": 860, "1.5": 1000, "2": 1170, "2.5": 1320, "3": 1490, "3.5": 1660, "4": 1860, "4.5": 2050, "5": 2290, "5.5": 2470, "6": 2660 },
  },
  {
    code: "NW", name: "Nidwalden", region: "Deutschschweiz",
    rents: { "1": 1020, "1.5": 1180, "2": 1390, "2.5": 1570, "3": 1770, "3.5": 1980, "4": 2210, "4.5": 2440, "5": 2730, "5.5": 2950, "6": 3170 },
  },
  {
    code: "GL", name: "Glarus", region: "Deutschschweiz",
    rents: { "1": 760, "1.5": 880, "2": 1030, "2.5": 1160, "3": 1310, "3.5": 1460, "4": 1630, "4.5": 1800, "5": 2010, "5.5": 2170, "6": 2340 },
  },
  {
    code: "ZG", name: "Zug", region: "Deutschschweiz",
    rents: { "1": 1380, "1.5": 1590, "2": 1860, "2.5": 2100, "3": 2360, "3.5": 2640, "4": 2950, "4.5": 3260, "5": 3650, "5.5": 3940, "6": 4230 },
  },
  {
    code: "FR", name: "Fribourg", nameFr: "Fribourg", region: "Romandie",
    rents: { "1": 860, "1.5": 1000, "2": 1170, "2.5": 1320, "3": 1490, "3.5": 1670, "4": 1860, "4.5": 2060, "5": 2300, "5.5": 2490, "6": 2680 },
  },
  {
    code: "SO", name: "Solothurn", region: "Deutschschweiz",
    rents: { "1": 810, "1.5": 940, "2": 1100, "2.5": 1240, "3": 1400, "3.5": 1570, "4": 1750, "4.5": 1930, "5": 2160, "5.5": 2340, "6": 2520 },
  },
  {
    code: "BS", name: "Basel-Stadt", region: "Deutschschweiz",
    rents: { "1": 1010, "1.5": 1180, "2": 1380, "2.5": 1560, "3": 1760, "3.5": 1970, "4": 2200, "4.5": 2430, "5": 2720, "5.5": 2940, "6": 3160 },
  },
  {
    code: "BL", name: "Basel-Landschaft", region: "Deutschschweiz",
    rents: { "1": 910, "1.5": 1060, "2": 1240, "2.5": 1400, "3": 1580, "3.5": 1770, "4": 1970, "4.5": 2180, "5": 2440, "5.5": 2640, "6": 2840 },
  },
  {
    code: "SH", name: "Schaffhausen", region: "Deutschschweiz",
    rents: { "1": 810, "1.5": 940, "2": 1100, "2.5": 1240, "3": 1400, "3.5": 1570, "4": 1750, "4.5": 1930, "5": 2160, "5.5": 2340, "6": 2520 },
  },
  {
    code: "AR", name: "Appenzell Ausserrhoden", region: "Deutschschweiz",
    rents: { "1": 760, "1.5": 880, "2": 1030, "2.5": 1160, "3": 1310, "3.5": 1460, "4": 1630, "4.5": 1800, "5": 2010, "5.5": 2170, "6": 2340 },
  },
  {
    code: "AI", name: "Appenzell Innerrhoden", region: "Deutschschweiz",
    rents: { "1": 760, "1.5": 880, "2": 1030, "2.5": 1160, "3": 1310, "3.5": 1460, "4": 1630, "4.5": 1800, "5": 2010, "5.5": 2170, "6": 2340 },
  },
  {
    code: "SG", name: "St. Gallen", region: "Deutschschweiz",
    rents: { "1": 860, "1.5": 1000, "2": 1170, "2.5": 1320, "3": 1490, "3.5": 1670, "4": 1860, "4.5": 2060, "5": 2300, "5.5": 2490, "6": 2680 },
  },
  {
    code: "GR", name: "Graubünden", region: "Deutschschweiz",
    rents: { "1": 910, "1.5": 1060, "2": 1240, "2.5": 1400, "3": 1580, "3.5": 1770, "4": 1970, "4.5": 2180, "5": 2440, "5.5": 2640, "6": 2840 },
  },
  {
    code: "AG", name: "Aargau", region: "Deutschschweiz",
    rents: { "1": 910, "1.5": 1060, "2": 1240, "2.5": 1400, "3": 1580, "3.5": 1770, "4": 1970, "4.5": 2180, "5": 2440, "5.5": 2640, "6": 2840 },
  },
  {
    code: "TG", name: "Thurgau", region: "Deutschschweiz",
    rents: { "1": 810, "1.5": 940, "2": 1100, "2.5": 1240, "3": 1400, "3.5": 1570, "4": 1750, "4.5": 1930, "5": 2160, "5.5": 2340, "6": 2520 },
  },
  {
    code: "TI", name: "Ticino", nameFr: "Tessin", region: "Tessin",
    rents: { "1": 910, "1.5": 1060, "2": 1240, "2.5": 1400, "3": 1580, "3.5": 1770, "4": 1970, "4.5": 2180, "5": 2440, "5.5": 2640, "6": 2840 },
  },
  {
    code: "VD", name: "Vaud", nameFr: "Vaud", region: "Romandie",
    rents: { "1": 1110, "1.5": 1280, "2": 1500, "2.5": 1700, "3": 1910, "3.5": 2140, "4": 2390, "4.5": 2630, "5": 2940, "5.5": 3180, "6": 3420 },
  },
  {
    code: "VS", name: "Valais", nameFr: "Valais", region: "Romandie",
    rents: { "1": 810, "1.5": 940, "2": 1100, "2.5": 1240, "3": 1400, "3.5": 1570, "4": 1750, "4.5": 1930, "5": 2160, "5.5": 2340, "6": 2520 },
  },
  {
    code: "NE", name: "Neuchâtel", nameFr: "Neuchâtel", region: "Romandie",
    rents: { "1": 810, "1.5": 940, "2": 1100, "2.5": 1240, "3": 1400, "3.5": 1570, "4": 1750, "4.5": 1930, "5": 2160, "5.5": 2340, "6": 2520 },
  },
  {
    code: "GE", name: "Genève", nameFr: "Genève", region: "Romandie",
    rents: { "1": 1210, "1.5": 1400, "2": 1640, "2.5": 1860, "3": 2090, "3.5": 2340, "4": 2610, "4.5": 2880, "5": 3220, "5.5": 3480, "6": 3740 },
  },
  {
    code: "JU", name: "Jura", nameFr: "Jura", region: "Romandie",
    rents: { "1": 660, "1.5": 770, "2": 900, "2.5": 1020, "3": 1150, "3.5": 1290, "4": 1440, "4.5": 1590, "5": 1780, "5.5": 1930, "6": 2080 },
  },
];

export const CANTONS_BY_CODE: Record<string, Canton> = CANTONS.reduce(
  (acc, c) => ({ ...acc, [c.code]: c }),
  {} as Record<string, Canton>,
);

export function getCanton(code: string | null | undefined): Canton | undefined {
  if (!code) return undefined;
  return CANTONS_BY_CODE[code.toUpperCase()];
}

export function isCantonCode(value: string): value is CantonCode {
  return value.toUpperCase() in CANTONS_BY_CODE;
}
