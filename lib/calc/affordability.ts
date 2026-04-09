import { AFFORDABILITY_RATIO } from "../data/laws";

export interface AffordabilityResult {
  recommended: number;
  burdenPct: number;
  verdict: "ok" | "warn" | "bad";
  label: string;
}

/**
 * Affordability rule of thumb: monthly gross rent should not exceed one
 * third of net income. Banks use a similar (stricter) rule when assessing
 * mortgage applications.
 */
export function calcAffordability(
  netIncome: number,
  currentRent: number,
): AffordabilityResult {
  const recommended = Math.round(netIncome * AFFORDABILITY_RATIO);
  const burdenPct = currentRent > 0 && netIncome > 0
    ? currentRent / netIncome
    : 0;

  let verdict: AffordabilityResult["verdict"];
  let label: string;

  if (burdenPct === 0) {
    verdict = "ok";
    label = "—";
  } else if (burdenPct <= 0.33) {
    verdict = "ok";
    label = "Tragbar";
  } else if (burdenPct <= 0.4) {
    verdict = "warn";
    label = "Grenzwertig";
  } else {
    verdict = "bad";
    label = "Zu hoch";
  }

  return { recommended, burdenPct, verdict, label };
}
