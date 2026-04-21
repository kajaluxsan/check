"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { fetchPois } from "@/lib/api/overpass";
import type { GeoPoint, Poi, PoiCategory } from "@/lib/types";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] w-full rounded-xl bg-ink-bg border border-ink-border flex items-center justify-center text-ink-dim text-sm">
      Lade Karte …
    </div>
  ),
});

const CATEGORIES: { value: PoiCategory; label: string; icon: string }[] = [
  { value: "station", label: "ÖV", icon: "🚆" },
  { value: "supermarket", label: "Laden", icon: "🛒" },
  { value: "school", label: "Schule", icon: "🏫" },
  { value: "pharmacy", label: "Apotheke", icon: "💊" },
  { value: "doctor", label: "Arzt", icon: "🏥" },
  { value: "restaurant", label: "Essen", icon: "🍽️" },
  { value: "parking", label: "Parkplatz", icon: "🅿️" },
];

const MAX_RADIUS = 1000;

export default function MapCard({ center }: { center: GeoPoint | null }) {
  const [radius, setRadius] = useState(500);
  const [allPois, setAllPois] = useState<Poi[]>([]);
  const [active, setActive] = useState<Set<PoiCategory>>(
    new Set(CATEGORIES.map((c) => c.value)),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch once with max radius — then filter client-side by selected radius.
  useEffect(() => {
    if (!center) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchPois(center, MAX_RADIUS)
      .then((list) => {
        if (!cancelled) setAllPois(list);
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

  function toggle(cat: PoiCategory) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  const filtered = allPois.filter(
    (p) => active.has(p.category) && p.distanceM <= radius,
  );

  return (
    <Card
      title="Umgebungskarte"
      icon="🗺️"
      source="OpenStreetMap · Overpass"
      className="md:col-span-2"
    >
      {!center ? (
        <div className="py-10 text-ink-mute text-sm">
          Keine Koordinaten verfügbar.
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map((c) => {
              const on = active.has(c.value);
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => toggle(c.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    on
                      ? "bg-lime-accent text-ink-bg border-lime-accent"
                      : "bg-ink-bg text-ink-mute border-ink-border hover:text-white"
                  }`}
                >
                  {c.icon} {c.label}
                </button>
              );
            })}
          </div>

          <div className="h-[360px] rounded-xl overflow-hidden border border-ink-border">
            <Map center={center} pois={filtered} radiusM={radius} />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <label className="text-xs text-ink-mute whitespace-nowrap">
              Radius
            </label>
            <input
              type="range"
              min={200}
              max={1000}
              step={100}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="flex-1 accent-lime-accent"
            />
            <span className="text-xs text-white font-mono w-12 text-right">
              {radius} m
            </span>
          </div>

          {loading && (
            <div className="mt-3 text-xs text-ink-dim">Aktualisiere POIs …</div>
          )}
          {error && (
            <div className="mt-3 text-xs text-red-400">{error}</div>
          )}
          {!loading && !error && (
            <div className="mt-3 text-xs text-ink-dim">
              {filtered.length} Einträge im {radius}m-Radius
            </div>
          )}
        </>
      )}
    </Card>
  );
}
