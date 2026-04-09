import type { CantonCode, TaxInfo } from "../types";
import { CANTONS_BY_CODE } from "../data/cantons";

/**
 * Tax data. The ESTV does not publish a free REST API for municipal tax
 * rates, so Phase 1 uses canton-level aggregates from publicly available
 * BFS / ESTV reports. Values are approximate average municipal tax burdens
 * (as a percentage of the canton tax) combined with the canton itself.
 *
 * For Phase 2 we'd parse the ESTV PDFs / XML into a JSON table at build time.
 */

const CANTON_AVG_TAX: Record<CantonCode, number> = {
  ZH: 11.5, BE: 14.8, LU: 12.1, UR: 11.0, SZ: 9.0,  OW: 10.2, NW: 9.5,
  GL: 12.5, ZG: 8.0,  FR: 13.7, SO: 14.3, BS: 12.0, BL: 13.6, SH: 12.9,
  AR: 11.4, AI: 10.5, SG: 12.6, GR: 12.0, AG: 12.2, TG: 12.0, TI: 13.5,
  VD: 14.0, VS: 13.1, NE: 15.5, GE: 14.9, JU: 15.1,
};

const CANTON_POPULATION: Partial<Record<CantonCode, number>> = {
  ZH: 1590000, BE: 1050000, LU: 420000, UR: 37000,  SZ: 165000, OW: 38000,
  NW: 44000,   GL: 41000,   ZG: 130000, FR: 330000, SO: 280000, BS: 200000,
  BL: 295000,  SH: 85000,   AR: 56000,  AI: 17000,  SG: 520000, GR: 200000,
  AG: 710000,  TG: 290000,  TI: 350000, VD: 820000, VS: 360000, NE: 175000,
  GE: 515000,  JU: 75000,
};

const CANTON_VACANCY: Partial<Record<CantonCode, number>> = {
  ZH: 0.55, BE: 1.30, LU: 1.10, UR: 1.40, SZ: 1.00, OW: 0.90, NW: 0.70,
  GL: 2.10, ZG: 0.50, FR: 2.00, SO: 2.15, BS: 1.25, BL: 1.45, SH: 1.55,
  AR: 1.45, AI: 1.30, SG: 1.80, GR: 1.15, AG: 2.05, TG: 2.10, TI: 1.80,
  VD: 0.85, VS: 2.05, NE: 2.60, GE: 0.38, JU: 2.80,
};

export async function fetchTaxInfo(
  canton: CantonCode,
): Promise<TaxInfo> {
  const cantonData = CANTONS_BY_CODE[canton];
  return {
    municipalityTax: CANTON_AVG_TAX[canton] ?? 12.5,
    cantonName: cantonData?.name ?? canton,
    population: CANTON_POPULATION[canton],
    vacancyRate: CANTON_VACANCY[canton],
  };
}

export function getTaxRank(canton: CantonCode): {
  rank: number;
  total: number;
} {
  const sorted = Object.entries(CANTON_AVG_TAX).sort(
    ([, a], [, b]) => a - b,
  );
  const rank = sorted.findIndex(([c]) => c === canton) + 1;
  return { rank, total: sorted.length };
}
