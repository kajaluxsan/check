"use client";

import { useEffect, useState } from "react";
import Card, { Metric } from "@/components/ui/Card";
import { fetchTaxInfo, getTaxRank } from "@/lib/api/tax";
import { useT } from "@/lib/i18n/context";
import type { CantonCode, TaxInfo } from "@/lib/types";

export default function TaxCard({ canton }: { canton: CantonCode | null }) {
  const { t } = useT();
  const [data, setData] = useState<TaxInfo | null>(null);
  const [rank, setRank] = useState<{ rank: number; total: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canton) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchTaxInfo(canton)
      .then((r) => {
        setData(r);
        setRank(getTaxRank(canton));
      })
      .finally(() => setLoading(false));
  }, [canton]);

  if (!canton) {
    return (
      <Card title={t.tax.title} icon="🏛️" error={t.common.cantonNotFound} />
    );
  }

  return (
    <Card
      title={t.tax.title}
      icon="🏛️"
      loading={loading}
    >
      {data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Metric
              label={t.tax.taxBurden}
              value={`${data.municipalityTax.toFixed(1)}%`}
              sub={rank ? t.tax.rank(rank.rank, rank.total) : undefined}
              tone={
                data.municipalityTax < 11
                  ? "good"
                  : data.municipalityTax < 13
                    ? "neutral"
                    : "warn"
              }
            />
            <Metric
              label={t.tax.vacancyRate}
              value={data.vacancyRate != null ? `${data.vacancyRate.toFixed(2)}%` : "—"}
              sub={
                data.vacancyRate != null && data.vacancyRate < 1
                  ? t.tax.tightMarket
                  : data.vacancyRate != null
                    ? t.tax.relaxedMarket
                    : undefined
              }
              tone={
                data.vacancyRate == null
                  ? "neutral"
                  : data.vacancyRate < 1
                    ? "bad"
                    : "good"
              }
            />
          </div>
          <div className="mt-5 rounded-xl bg-ink-bg border border-ink-border p-4">
            <div className="text-xs text-ink-dim uppercase tracking-wide mb-2">
              {t.tax.canton(data.cantonName)}
            </div>
            <div className="text-sm text-ink-mute">
              {data.population
                ? t.tax.population(new Intl.NumberFormat("de-CH").format(data.population))
                : ""}
            </div>
            <p className="text-xs text-ink-dim mt-2">
              {t.tax.phase2Note}
            </p>
          </div>
        </>
      )}
    </Card>
  );
}
