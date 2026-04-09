/**
 * Static legal constants used by the legal info card and calculators.
 * These values reflect federal Swiss tenancy law; canton-specific notice
 * rules are included where relevant.
 */

// Reference mortgage interest rate (hypothekarischer Referenzzinssatz)
// published quarterly by the Bundesamt für Wohnungswesen (BWO).
// As of early 2025 it stood at 1.75%. Adjust manually when the BWO updates.
export const REFERENCE_RATE = 1.75;

// Maximum rent increase on initial rent (Anfangsmiete) before it becomes
// challengeable at the conciliation authority — Schwellenwert per canton
// case law. The law says the old rent must be disclosed (Art. 270 OR).
export const MAX_INITIAL_INCREASE_PCT = 10;

// Maximum security deposit in months of net rent (Art. 257e OR).
export const MAX_DEPOSIT_MONTHS = 3;

// Default statutory notice period (Wohnungen): 3 months.
export const DEFAULT_NOTICE_MONTHS = 3;

// Typical utility cost benchmarks per m² per year by heating type.
// Used for Tool 3 – "Nebenkosten-Check" (Phase 2).
export const UTILITY_BENCHMARK_CHF_PER_SQM = {
  gas:      { low: 14, high: 22 },
  oil:      { low: 16, high: 24 },
  heatPump: { low: 10, high: 16 },
  district: { low: 15, high: 20 },
  electric: { low: 20, high: 30 },
};

// Rule of thumb: monthly rent should not exceed 1/3 of net income.
export const AFFORDABILITY_RATIO = 1 / 3;
