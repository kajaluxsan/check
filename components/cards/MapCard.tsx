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

const MAX_RADIUS = 20000;

const RADIUS_OPTIONS = [200, 300, 500, 750, 1000, 3000, 5000, 10000, 15000, 20000];

function formatRadius(r: number): string {
  return r >= 1000 ? `${r / 1000} km` : `${r} m`;
}

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

          <div className="mt-4">
            <div className="text-xs text-ink-mute mb-2">Radius</div>
            <div className="flex flex-wrap gap-1.5">
              {RADIUS_OPTIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRadius(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                    radius === r
                      ? "bg-lime-accent text-ink-bg border-lime-accent"
                      : "bg-ink-bg text-ink-mute border-ink-border hover:text-white hover:border-ink-mute"
                  }`}
                >
                  {formatRadius(r)}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="mt-3 text-xs text-ink-dim">Aktualisiere POIs …</div>
          )}
          {error && (
            <div className="mt-3 text-xs text-red-400">{error}</div>
          )}
          {!loading && !error && (
            <div className="mt-3 text-xs text-ink-dim">
              {filtered.length} Einträge im {formatRadius(radius)}-Radius
            </div>
          )}
        </>
      )}
    </Card>
  );
}
