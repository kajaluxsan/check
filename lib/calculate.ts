import { getCanton } from "./data/cantons";
import {
  CONDITION_OPTIONS,
  FLOOR_OPTIONS,
  NOISE_OPTIONS,
  getLabel,
  getModifier,
} from "./modifiers";
import type { CheckInput, CheckResult, Verdict } from "./types";

/**
 * Pure calculation function. Takes a user input and returns a verdict with
 * expected price, comparison and advice. Returns null if canton/rooms unknown.
 */
export function calculate(input: CheckInput): CheckResult | null {
  const canton = getCanton(input.canton);
  if (!canton) return null;

  const baseRent = canton.rents[input.rooms as keyof typeof canton.rents];
  if (!baseRent) return null;

  const modNoise = getModifier(NOISE_OPTIONS, input.noise);
  const modFloor = getModifier(FLOOR_OPTIONS, input.floor);
  const modCondition = getModifier(CONDITION_OPTIONS, input.condition);
  const totalMod = modNoise + modFloor + modCondition;

  const expected = Math.round(baseRent * (1 + totalMod));
  const expectedLow = Math.round(expected * 0.92);
  const expectedHigh = Math.round(expected * 1.08);

  const diff = input.price - expected;
  const diffPct = diff / expected;

  const { verdict, headline, summary, advice } = buildVerdict(
    diffPct,
    diff,
    canton.name,
  );

  const pricePerSqm = input.size > 0 ? input.price / input.size : 0;

  const modifiers = [
    { label: `Lärm: ${getLabel(NOISE_OPTIONS, input.noise)}`, value: modNoise },
    { label: `Stockwerk: ${getLabel(FLOOR_OPTIONS, input.floor)}`, value: modFloor },
    { label: `Zustand: ${getLabel(CONDITION_OPTIONS, input.condition)}`, value: modCondition },
  ];

  return {
    canton,
    expected,
    expectedLow,
    expectedHigh,
    actual: input.price,
    diff,
    diffPct,
    verdict,
    pricePerSqm,
    headline,
    summary,
    advice,
    modifiers,
  };
}

function buildVerdict(diffPct: number, diff: number, cityName: string): {
  verdict: Verdict;
  headline: string;
  summary: string;
  advice: string[];
} {
  if (diffPct < -0.1) {
    return {
      verdict: "steal",
      headline: "Schnäppchen!",
      summary: `Diese Wohnung liegt deutlich unter dem Marktpreis. Du sparst rund ${Math.abs(diff)} CHF pro Monat gegenüber dem erwarteten Preis in ${cityName}.`,
      advice: [
        "Schnell handeln – solche Angebote sind meist schnell vergeben.",
        "Prüfe die Wohnung vor Ort. Zu gute Angebote können auf Mängel hindeuten.",
        "Kontrolliere, ob es keine versteckten Nebenkosten gibt.",
      ],
    };
  }
  if (diffPct < 0.05) {
    return {
      verdict: "fair",
      headline: "Fairer Preis",
      summary: `Der Mietpreis entspricht dem, was in ${cityName} für vergleichbare Wohnungen üblich ist.`,
      advice: [
        "Marktgerechter Preis – kein Grund zum Verhandeln, aber auch kein Abzock.",
        "Nutze die Zeit für eine sorgfältige Besichtigung statt zu zögern.",
        "Frag nach der Zusammensetzung der Nebenkosten.",
      ],
    };
  }
  if (diffPct < 0.15) {
    return {
      verdict: "slightly",
      headline: "Leicht überteuert",
      summary: `Diese Wohnung liegt rund ${Math.round(diffPct * 100)}% über dem marktüblichen Preis. Du zahlst etwa ${diff} CHF pro Monat zu viel.`,
      advice: [
        "Frag höflich nach Verhandlungsspielraum – viele Vermieter sind flexibel.",
        "Prüfe die Vormiete im Mietvertrag (Art. 270 OR) – du kannst anfechten.",
        "Vergleiche mit ähnlichen Inseraten in der Umgebung.",
      ],
    };
  }
  if (diffPct < 0.3) {
    return {
      verdict: "overpriced",
      headline: "Überteuert",
      summary: `Achtung: Diese Wohnung ist rund ${Math.round(diffPct * 100)}% teurer als vergleichbare Objekte in ${cityName}. Das sind ${diff} CHF Mehrkosten pro Monat.`,
      advice: [
        "Du kannst die Anfangsmiete beim Schlichtungsamt anfechten (Art. 270 OR).",
        "Verlange das Formular zur Vormiete – in vielen Kantonen ist es Pflicht.",
        "Überleg dir, ob andere Angebote besser passen.",
      ],
    };
  }
  return {
    verdict: "scam",
    headline: "Stark überteuert – Warnung",
    summary: `Diese Wohnung ist über ${Math.round(diffPct * 100)}% teurer als üblich. Das sind ${diff} CHF pro Monat über dem Marktpreis. Eine Anfechtung ist sehr erfolgversprechend.`,
    advice: [
      "Nicht ohne Prüfung unterschreiben. Bei solchen Preisen fast immer anfechtbar.",
      "Mieterverband (mieterverband.ch) bietet eine kostenlose Erstberatung.",
      "Dokumentiere das Inserat als Beweismittel für eine spätere Anfechtung.",
    ],
  };
}
