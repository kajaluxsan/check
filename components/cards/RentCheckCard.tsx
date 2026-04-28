"use client";

import { Coins } from "lucide-react";
import Card, { Metric, Pill } from "@/components/ui/Card";
import { checkRent, type RentCheckResult } from "@/lib/calc/rent";
import { useT } from "@/lib/i18n/context";
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
  const { t } = useT();

  if (!canton) {
    return (
      <Card title={t.rent.title} icon="💰" error={t.common.cantonNotFound} />
    );
  }
  const result = checkRent(canton, rooms, actual);
  if (!result) {
    return (
      <Card
        title={t.rent.title}
        icon={Coins}
        error={t.rent.noData}
      />
    );
  }

  const tone = VERDICT_TONE[result.verdict];
  const metricTone =
    result.verdict === "great" || result.verdict === "fair"
      ? "good"
      : result.verdict === "slightly"
        ? "warn"
        : "bad";

  return (
    <Card
      title={t.rent.title}
      icon={Coins}
      action={<Pill tone={tone}>{result.label}</Pill>}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
        <Metric label={t.rent.yourRent} value={fmt(result.actual)} />
        <Metric label={t.rent.median} value={fmt(result.expected)} />
        <Metric
          label={result.diff >= 0 ? t.rent.more : t.rent.less}
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
  const { t } = useT();
  const scaleMin = result.expectedLow * 0.7;
  const scaleMax = result.expectedHigh * 1.4;
  const pct = (v: number) =>
    Math.min(100, Math.max(0, ((v - scaleMin) / (scaleMax - scaleMin)) * 100));

  return (
    <div className="mt-6">
      <div className="relative h-10">
        <div className="absolute inset-x-0 top-4 h-2 rounded-full bg-gradient-to-r from-lime-accent via-yellow-400 via-60% to-red-500" />
        <div
          className="absolute top-3 h-4 rounded-md border border-white/30 bg-white/10"
          style={{
            left: `${pct(result.expectedLow)}%`,
            width: `${pct(result.expectedHigh) - pct(result.expectedLow)}%`,
          }}
        />
        <div
          className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
          style={{ left: `${pct(result.actual)}%` }}
        >
          <div className="text-[10px] text-white font-semibold">{t.rent.you}</div>
          <div className="w-3 h-3 rounded-full bg-white border-2 border-ink-bg mt-1" />
        </div>
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-ink-dim">
        <span>{fmt(scaleMin)}</span>
        <span>{t.rent.fair}: {fmt(result.expectedLow)}–{fmt(result.expectedHigh)}</span>
        <span>{fmt(scaleMax)}</span>
      </div>
    </div>
  );
}

function fmt(v: number): string {
  return `${new Intl.NumberFormat("de-CH", { maximumFractionDigits: 0 }).format(
    Math.round(v),
  )} CHF`;
}
