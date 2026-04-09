import { CANTONS_BY_CODE } from "../data/cantons";
import type { CantonCode, Verdict } from "../types";

export interface RentCheckResult {
  expected: number;
  expectedLow: number;
  expectedHigh: number;
  actual: number;
  diff: number;
  diffPct: number;
  verdict: Verdict;
  label: string;
  summary: string;
}

/**
 * Pure rent check: compares the user's net rent against the canton median
 * for the given room count. Tolerance band is ±8%.
 */
export function checkRent(
  canton: CantonCode,
  rooms: string,
  actual: number,
): RentCheckResult | null {
  const c = CANTONS_BY_CODE[canton];
  if (!c) return null;
  const expected = c.rents[rooms as keyof typeof c.rents];
  if (!expected) return null;

  const expectedLow = Math.round(expected * 0.92);
  const expectedHigh = Math.round(expected * 1.08);
  const diff = actual - expected;
  const diffPct = diff / expected;

  let verdict: Verdict;
  let label: string;
  let summary: string;

  if (diffPct < -0.1) {
    verdict = "great";
    label = "Sehr günstig";
    summary = `Du zahlst rund ${Math.abs(diff)} CHF weniger als der Durchschnitt in ${c.name}.`;
  } else if (diffPct < 0.05) {
    verdict = "fair";
    label = "Fair";
    summary = `Der Preis entspricht dem Marktdurchschnitt in ${c.name}.`;
  } else if (diffPct < 0.15) {
    verdict = "slightly";
    label = "Etwas teuer";
    summary = `Deine Miete liegt rund ${Math.round(diffPct * 100)}% über dem Mittel in ${c.name}.`;
  } else {
    verdict = "overpriced";
    label = "Überteuert";
    summary = `Deine Miete liegt ${Math.round(diffPct * 100)}% über dem Mittel – eine Anfechtung ist möglich.`;
  }

  return {
    expected,
    expectedLow,
    expectedHigh,
    actual,
    diff,
    diffPct,
    verdict,
    label,
    summary,
  };
}
