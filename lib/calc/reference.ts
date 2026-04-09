import { REFERENCE_RATE } from "../data/laws";

/**
 * Reference interest rate calculator.
 *
 * When the hypothekarische Referenzzinssatz drops, tenants can request a
 * rent reduction. A 0.25-percentage-point drop corresponds to a 2.91%
 * reduction of the net rent (Art. 13 VMWG). This function computes how much
 * CHF per month a tenant could save, given the current net rent and the
 * reference rate in effect when the contract was signed.
 */

export interface RefRateResult {
  eligible: boolean;
  currentRate: number;
  contractRate: number;
  reductionPct: number;
  newRent: number;
  savingsMonthly: number;
  savingsYearly: number;
  note: string;
}

export function calcReference(
  netRent: number,
  contractRate: number,
): RefRateResult {
  const current = REFERENCE_RATE;
  if (netRent <= 0 || contractRate <= 0) {
    return {
      eligible: false,
      currentRate: current,
      contractRate,
      reductionPct: 0,
      newRent: netRent,
      savingsMonthly: 0,
      savingsYearly: 0,
      note: "Bitte gib deine aktuelle Nettomiete und den Referenzzinssatz bei Vertragsabschluss ein.",
    };
  }

  if (current >= contractRate) {
    return {
      eligible: false,
      currentRate: current,
      contractRate,
      reductionPct: 0,
      newRent: netRent,
      savingsMonthly: 0,
      savingsYearly: 0,
      note: `Der Referenzzinssatz ist seit deinem Vertragsabschluss nicht gesunken (${contractRate}% → ${current}%). Kein Senkungsanspruch.`,
    };
  }

  // Each 0.25 pp drop corresponds to -2.91% (VMWG Art. 13).
  const steps = (contractRate - current) / 0.25;
  const reductionPct = steps * 0.0291;
  const newRent = Math.round(netRent * (1 - reductionPct));
  const savingsMonthly = netRent - newRent;

  return {
    eligible: savingsMonthly > 0,
    currentRate: current,
    contractRate,
    reductionPct,
    newRent,
    savingsMonthly,
    savingsYearly: savingsMonthly * 12,
    note: `Du hast Anspruch auf rund ${(reductionPct * 100).toFixed(1)}% Senkung. Fordere sie schriftlich beim Vermieter ein.`,
  };
}
