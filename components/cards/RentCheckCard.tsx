"use client";

import { Coins } from "lucide-react";
import Card, { Metric, Pill } from "@/components/ui/Card";
import { checkRent, type RentCheckResult } from "@/lib/calc/rent";
import type { CantonCode, Verdict } from "@/lib/types";

const VERDICT_TONE: Record<Verdict, "good" | "warn" | "mid" | "bad"> = {
  great: "good",
  fair: "good",
  slightly: "warn",
  overpriced: "bad",
};

export default function RentCheckCard({
  canton,
  rooms,
  actual,
}: {
  canton: CantonCode | null;
  rooms: string;
  actual: number;
}) {
  if (!canton) {
    return <Card title="Mietpreis-Check" icon={Coins} error="Kanton nicht ermittelbar." />;
  }
  const result = checkRent(canton, rooms, actual);
  if (!result) {
    return <Card title="Mietpreis-Check" icon={Coins} error="Keine Daten für diese Zimmerzahl." />;
  }

  const tone = VERDICT_TONE[result.verdict];
  const metricTone = result.verdict === "great" || result.verdict === "fair" ? "good" : result.verdict === "slightly" ? "warn" : "bad";

  return (
    <Card
      title="Mietpreis-Check"
      icon={Coins}
      action={<Pill tone={tone}>{result.label}</Pill>}
    >
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Metric label="Deine Miete" value={fmt(result.actual)} />
        <Metric label="Kantons-Median" value={fmt(result.expected)} />
        <Metric
          label={result.diff >= 0 ? "Mehr" : "Weniger"}
          value={`${result.diff >= 0 ? "+" : ""}${Math.round(result.diffPct * 100)}%`}
          tone={metricTone}
        />
      </div>
      <p className="text-sm text-ink-mute">{result.summary}</p>
      <PriceBar result={result} />
    </Card>
  );
}

function PriceBar({ result }: { result: RentCheckResult }) {
  const scaleMin = result.expectedLow * 0.7;
  const scaleMax = result.expectedHigh * 1.4;
  const pct = (v: number) =>
    Math.min(100, Math.max(0, ((v - scaleMin) / (scaleMax - scaleMin)) * 100));

  return (
    <div className="mt-6">
      <div className="relative h-10">
        <div className="absolute inset-x-0 top-4 h-2 rounded-full bg-gradient-to-r from-status-good via-status-warn via-60% to-status-bad" />
        <div
          className="absolute top-3 h-4 rounded-[6px] border border-[var(--fg)]/20 bg-[var(--fg)]/10"
          style={{
            left: `${pct(result.expectedLow)}%`,
            width: `${pct(result.expectedHigh) - pct(result.expectedLow)}%`,
          }}
        />
        <div
          className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
          style={{ left: `${pct(result.actual)}%` }}
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--fg)] font-medium">Du</div>
          <div className="w-3 h-3 rounded-full bg-[var(--fg)] border-2 border-ink-bg mt-1" />
        </div>
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] text-ink-dim">
        <span>{fmt(scaleMin)}</span>
        <span>fair: {fmt(result.expectedLow)}–{fmt(result.expectedHigh)}</span>
        <span>{fmt(scaleMax)}</span>
      </div>
    </div>
  );
}

function fmt(v: number): string {
  return `${new Intl.NumberFormat("de-CH", { maximumFractionDigits: 0 }).format(Math.round(v))} CHF`;
}
