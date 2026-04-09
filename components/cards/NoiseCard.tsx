"use client";

import { useEffect, useState } from "react";
import Card, { Pill } from "@/components/ui/Card";
import { fetchNoise } from "@/lib/api/geoadmin";
import type { GeoPoint, NoiseReading } from "@/lib/types";

function classify(db: number | null) {
  if (db == null) return { tone: "mid" as const, label: "Unbekannt", emoji: "❔" };
  if (db < 50) return { tone: "good" as const, label: "Ruhig", emoji: "🟢" };
  if (db < 60) return { tone: "warn" as const, label: "Normal", emoji: "🟡" };
  if (db < 70) return { tone: "mid" as const, label: "Laut", emoji: "🟠" };
  return { tone: "bad" as const, label: "Sehr laut", emoji: "🔴" };
}

export default function NoiseCard({ center }: { center: GeoPoint | null }) {
  const [data, setData] = useState<NoiseReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!center) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchNoise(center)
      .then((r) => {
        if (!cancelled) setData(r);
      })
      .catch(() => {
        if (!cancelled) setError("Daten momentan nicht verfügbar.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [center]);

  const road = classify(data?.roadDb ?? null);
  const rail = classify(data?.railDb ?? null);

  return (
    <Card
      title="Lärm & Umwelt"
      icon="🔊"
      source="geo.admin.ch · BAFU"
      loading={loading}
      error={error}
    >
      <div className="space-y-4">
        <NoiseRow
          label="Strassenlärm"
          db={data?.roadDb ?? null}
          tone={road.tone}
          rating={road.label}
          emoji={road.emoji}
        />
        <NoiseRow
          label="Bahnlärm"
          db={data?.railDb ?? null}
          tone={rail.tone}
          rating={rail.label}
          emoji={rail.emoji}
        />
      </div>
      <div className="mt-5 text-xs text-ink-dim">
        Werte in dB(A) Tagesmittel (Lden). 50 dB = Bibliothek, 70 dB = Verkehrslärm.
      </div>
    </Card>
  );
}

function NoiseRow({
  label,
  db,
  tone,
  rating,
  emoji,
}: {
  label: string;
  db: number | null;
  tone: "good" | "warn" | "mid" | "bad";
  rating: string;
  emoji: string;
}) {
  return (
    <div className="rounded-xl bg-ink-bg border border-ink-border p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-ink-dim">{label}</div>
          <div className="font-serif text-3xl mt-1">
            {db != null ? `${db.toFixed(0)} dB` : "—"}
          </div>
        </div>
        <Pill tone={tone}>{emoji} {rating}</Pill>
      </div>
      {db != null && (
        <div className="mt-3 h-1.5 rounded-full bg-ink-elev2 overflow-hidden">
          <div
            className={`h-full transition-all ${
              tone === "good" ? "bg-lime-accent" :
              tone === "warn" ? "bg-yellow-500" :
              tone === "mid" ? "bg-orange-500" : "bg-red-500"
            }`}
            style={{ width: `${Math.min(100, Math.max(0, ((db - 30) / 50) * 100))}%` }}
          />
        </div>
      )}
    </div>
  );
}
