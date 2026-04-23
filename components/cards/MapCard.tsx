"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { MapIcon, TrainFront, ShoppingCart, GraduationCap, Cross, Stethoscope, Utensils, ParkingCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import { fetchPois } from "@/lib/api/overpass";
import type { GeoPoint, Poi, PoiCategory } from "@/lib/types";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] w-full rounded-input bg-ink-bg border border-ink-border flex items-center justify-center text-ink-dim text-sm">
      Lade Karte …
    </div>
  ),
});

const CATEGORIES: { value: PoiCategory; label: string; Icon: typeof MapIcon }[] = [
  { value: "station", label: "ÖV", Icon: TrainFront },
  { value: "supermarket", label: "Laden", Icon: ShoppingCart },
  { value: "school", label: "Schule", Icon: GraduationCap },
  { value: "pharmacy", label: "Apotheke", Icon: Cross },
  { value: "doctor", label: "Arzt", Icon: Stethoscope },
  { value: "restaurant", label: "Essen", Icon: Utensils },
  { value: "parking", label: "Parkplatz", Icon: ParkingCircle },
];

const MAX_RADIUS = 10000;
const RADIUS_OPTIONS = [250, 500, 750, 1000, 5000];

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

  useEffect(() => {
    if (!center) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchPois(center, MAX_RADIUS)
      .then((list) => { if (!cancelled) setAllPois(list); })
      .catch(() => { if (!cancelled) setError("Daten momentan nicht verfügbar."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [center]);

  function toggle(cat: PoiCategory) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  const filtered = allPois.filter((p) => active.has(p.category) && p.distanceM <= radius);

  return (
    <Card title="Umgebungskarte" icon={MapIcon} className="md:col-span-2">
      {!center ? (
        <div className="py-10 text-ink-mute text-sm">Keine Koordinaten verfügbar.</div>
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
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-medium border transition ${
                    on
                      ? "bg-accent text-white border-accent"
                      : "bg-ink-bg text-ink-mute border-ink-border hover:text-[var(--fg)]"
                  }`}
                >
                  <c.Icon className="w-3.5 h-3.5" />
                  {c.label}
                </button>
              );
            })}
          </div>

          <div className="h-[360px] rounded-input overflow-hidden border border-ink-border">
            <Map center={center} pois={filtered} radiusM={radius} />
          </div>

          <div className="mt-4 rounded-input bg-ink-bg border border-ink-border p-3">
            <div className="flex items-center justify-between mb-2.5">
              <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-dim">Radius</div>
              <div className="text-sm font-medium font-mono text-[var(--fg)]">{formatRadius(radius)}</div>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {RADIUS_OPTIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRadius(r)}
                  className={`py-2 rounded-input text-xs font-medium border transition ${
                    radius === r
                      ? "bg-accent text-white border-accent"
                      : "bg-ink-elev text-ink-mute border-ink-border hover:text-[var(--fg)] hover:border-ink-mute"
                  }`}
                >
                  {formatRadius(r)}
                </button>
              ))}
            </div>
          </div>

          {loading && <div className="mt-3 text-xs text-ink-dim">Aktualisiere POIs …</div>}
          {error && <div className="mt-3 text-xs text-status-bad">{error}</div>}
          {!loading && !error && (
            <div className="mt-3 text-xs text-ink-dim">{filtered.length} Einträge im {formatRadius(radius)}-Radius</div>
          )}
        </>
      )}
    </Card>
  );
}
