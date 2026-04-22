"use client";

import { useEffect, useState } from "react";
import Card, { Metric } from "@/components/ui/Card";
import { fetchGwrBuilding, type GwrBuilding } from "@/lib/api/gwr";
import type { GeoPoint } from "@/lib/types";

export default function BuildingCard({
  center,
  hasHouseNumber,
}: {
  center: GeoPoint | null;
  hasHouseNumber: boolean;
}) {
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
        if (!cancelled) setError("Gebäudedaten nicht verfügbar.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [center, hasHouseNumber]);

  if (!hasHouseNumber) {
    return (
      <Card title="Gebäudedaten" icon="🏠">
        <div className="rounded-xl bg-ink-bg border border-ink-border p-4">
          <p className="text-ink-mute text-sm">
            Gib die genaue Adresse mit Hausnummer an, um weitere
            Informationen wie Baujahr, Heizungsart und Gebäudetyp anzuzeigen.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Gebäudedaten"
      icon="🏠"
      loading={loading}
      error={error}
    >
      {data ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
            {data.buildingYear && (
              <Metric
                label="Baujahr"
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
              <Metric label="Heizungstyp" value={data.heatingType} />
            )}
            {data.heatingSource && (
              <Metric
                label="Energieträger"
                value={data.heatingSource}
                tone={
                  ["Wärmepumpe", "Sonne", "Fernwärme", "Erdwärme", "Luft", "Wasser"].some((t) =>
                    data.heatingSource?.includes(t),
                  )
                    ? "good"
                    : "neutral"
                }
              />
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {data.buildingCategory && (
              <InfoRow label="Gebäudetyp" value={data.buildingCategory} />
            )}
            {data.floors && (
              <InfoRow label="Stockwerke" value={String(data.floors)} />
            )}
            {data.dwellings && (
              <InfoRow label="Wohnungen" value={String(data.dwellings)} />
            )}
            {data.area && (
              <InfoRow label="Gebäudefläche" value={`${data.area} m²`} />
            )}
            {data.egid && (
              <InfoRow label="EGID" value={data.egid} />
            )}
          </div>

          {!data.buildingYear && !data.heatingType && !data.buildingCategory && (
            <div className="text-sm text-ink-mute">
              Für dieses Gebäude sind keine detaillierten Daten im GWR hinterlegt.
            </div>
          )}
        </>
      ) : (
        !loading && !error && (
          <div className="text-sm text-ink-mute">
            Kein Gebäude an dieser Adresse im GWR gefunden.
          </div>
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
