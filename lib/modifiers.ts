import type { Condition, Floor, Noise, Verdict } from "./types";

/**
 * Price modifiers applied on top of the canton median rent.
 * Values are expressed as fractions (e.g. -0.05 = -5%).
 */

export const NOISE_OPTIONS: { value: Noise; label: string; modifier: number }[] = [
  { value: "quiet",    label: "Ruhig",      modifier: 0.03 },
  { value: "normal",   label: "Normal",     modifier: 0 },
  { value: "loud",     label: "Laut",       modifier: -0.05 },
  { value: "veryLoud", label: "Sehr laut",  modifier: -0.10 },
];

export const FLOOR_OPTIONS: { value: Floor; label: string; modifier: number }[] = [
  { value: "ground", label: "Erdgeschoss",       modifier: -0.03 },
  { value: "low",    label: "1.–3. Stock",       modifier: 0 },
  { value: "mid",    label: "4.–6. Stock",       modifier: 0.02 },
  { value: "high",   label: "7. Stock oder höher", modifier: 0.05 },
];

export const CONDITION_OPTIONS: { value: Condition; label: string; modifier: number }[] = [
  { value: "new",       label: "Neubau",          modifier: 0.10 },
  { value: "renovated", label: "Renoviert",       modifier: 0.05 },
  { value: "good",      label: "Guter Zustand",   modifier: 0 },
  { value: "old",       label: "Älter",           modifier: -0.08 },
  { value: "needsWork", label: "Sanierungsbedarf",modifier: -0.15 },
];

export function getModifier<T extends string>(
  options: { value: T; modifier: number }[],
  value: T,
): number {
  return options.find((o) => o.value === value)?.modifier ?? 0;
}

export function getLabel<T extends string>(
  options: { value: T; label: string }[],
  value: T,
): string {
  return options.find((o) => o.value === value)?.label ?? String(value);
}

export const VERDICT_STYLE: Record<
  Verdict,
  { bg: string; text: string; ring: string; accent: string; bar: string }
> = {
  steal:      { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200", accent: "bg-emerald-500", bar: "bg-emerald-500" },
  fair:       { bg: "bg-green-50",   text: "text-green-700",   ring: "ring-green-200",   accent: "bg-green-500",   bar: "bg-green-500" },
  slightly:   { bg: "bg-amber-50",   text: "text-amber-700",   ring: "ring-amber-200",   accent: "bg-amber-500",   bar: "bg-amber-500" },
  overpriced: { bg: "bg-orange-50",  text: "text-orange-700",  ring: "ring-orange-200",  accent: "bg-orange-500",  bar: "bg-orange-500" },
  scam:       { bg: "bg-red-50",     text: "text-red-700",     ring: "ring-red-200",     accent: "bg-red-500",     bar: "bg-red-500" },
};
