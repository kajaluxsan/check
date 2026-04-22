"use client";

import { useEffect, useState } from "react";
import Card, { Metric } from "@/components/ui/Card";
import { useT } from "@/lib/i18n/context";
import { fetchGwrBuilding, type GwrBuilding } from "@/lib/api/gwr";
import type { GeoPoint } from "@/lib/types";

export default function BuildingCard({
  center,
  hasHouseNumber,
}: {
  center: GeoPoint | null;
  hasHouseNumber: boolean;
}) {
  const { t } = useT();
  const [data, setData] = useState<GwrBuilding | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!center || !hasHouseNumber) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchGwrBuilding(center)
      .then((r) => {
        if (!cancelled) setData(r);
      })
      .catch(() => {
        if (!cancelled) setError(t.building.notAvailable);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [center, hasHouseNumber, t]);

  if (!hasHouseNumber) {
    return (
      <Card title={t.building.title} icon="🏠">
        <div className="rounded-xl bg-ink-bg border border-ink-border p-4">
          <p className="text-ink-mute text-sm">{t.building.needHouseNumber}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title={t.building.title} icon="🏠" loading={loading} error={error} className="xl:col-span-2">
      {data ? (
        <>
          {/* Top metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {data.buildingYear && (
              <Metric
                label={t.building.yearBuilt}
                value={String(data.buildingYear)}
                tone={
                  data.buildingYear >= 2010
                    ? "good"
                    : data.buildingYear >= 1990
                      ? "neutral"
                      : "warn"
                }
              />
            )}
            {data.heatingType && (
              <Metric label={t.building.heatingType} value={data.heatingType} />
            )}
            {data.heatingSource && (
              <Metric
                label={t.building.energySource}
                value={data.heatingSource}
                tone={
                  ["Wärmepumpe", "Sonne", "Fernwärme", "Erdwärme", "Luft", "Wasser", "Erdwärme / Wasser"].some((x) =>
                    data.heatingSource?.includes(x),
                  )
                    ? "good"
                    : "neutral"
                }
              />
            )}
            {data.hotWaterType && (
              <Metric label={t.building.hotWater} value={`${data.hotWaterType}${data.hotWaterSource ? ` (${data.hotWaterSource})` : ""}`} />
            )}
          </div>

          {/* Info grid — all fields in one wide grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {data.buildingCategory && (
              <InfoRow label={t.building.buildingType} value={data.buildingCategory} />
            )}
            {data.floors && (
              <InfoRow label={t.building.floors} value={String(data.floors)} />
            )}
            {data.dwellings && (
              <InfoRow label={t.building.apartments} value={String(data.dwellings)} />
            )}
            {data.area && (
              <InfoRow label={t.building.area} value={`${data.area} m²`} />
            )}
            {data.energyArea && (
              <InfoRow label={t.building.energyArea} value={`${data.energyArea} m²`} />
            )}
            {data.volume && (
              <InfoRow label={t.building.volume} value={`${new Intl.NumberFormat("de-CH").format(data.volume)} m³`} />
            )}
            {data.shelter != null && (
              <InfoRow label={t.building.shelter} value={data.shelter ? t.building.shelterYes : t.building.shelterNo} />
            )}
            {data.municipality && (
              <InfoRow label={t.building.municipality} value={data.municipality} />
            )}
            {data.canton && (
              <InfoRow label={t.building.canton} value={data.canton} />
            )}
            {data.heatingType2 && (
              <InfoRow label={t.building.heating2} value={`${data.heatingType2}${data.heatingSource2 ? ` (${data.heatingSource2})` : ""}`} />
            )}
            {data.egid && (
              <InfoRow label="EGID" value={data.egid} />
            )}
            {data.egrid && (
              <InfoRow label="EGRID" value={data.egrid} />
            )}
          </div>

          {/* Dwelling details table — collapsible */}
          {data.dwellingDetails && data.dwellingDetails.length > 0 && (
            <details className="mt-4 rounded-xl bg-ink-bg border border-ink-border overflow-hidden">
              <summary className="px-3 py-2.5 cursor-pointer text-xs text-ink-dim uppercase tracking-wide hover:text-ink-mute transition select-none">
                {t.building.dwellings} ({data.dwellingDetails.length})
              </summary>
              <div className="px-3 pb-3 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-ink-dim text-left">
                      <th className="pb-1.5 pr-3 font-medium">{t.building.dwellingNr}</th>
                      <th className="pb-1.5 pr-3 font-medium">{t.building.dwellingFloor}</th>
                      <th className="pb-1.5 pr-3 font-medium">{t.building.dwellingRooms}</th>
                      <th className="pb-1.5 pr-3 font-medium">{t.building.dwellingArea}</th>
                      <th className="pb-1.5 font-medium">{t.building.dwellingKitchen}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-border">
                    {data.dwellingDetails.map((d, i) => (
                      <tr key={i} className="text-white">
                        <td className="py-1.5 pr-3">{d.number}</td>
                        <td className="py-1.5 pr-3 text-ink-mute">{d.floor}</td>
                        <td className="py-1.5 pr-3">{d.rooms ?? "—"}</td>
                        <td className="py-1.5 pr-3">{d.area ? `${d.area} m²` : "—"}</td>
                        <td className="py-1.5">{d.kitchen ? "✓" : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}

          {!data.buildingYear && !data.heatingType && !data.buildingCategory && (
            <div className="text-sm text-ink-mute">{t.building.noDetails}</div>
          )}
        </>
      ) : (
        !loading && !error && (
          <div className="text-sm text-ink-mute">{t.building.noBuilding}</div>
        )
      )}
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-ink-bg border border-ink-border px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-wide text-ink-dim">{label}</div>
      <div className="text-sm text-white mt-0.5 truncate">{value}</div>
    </div>
  );
}
