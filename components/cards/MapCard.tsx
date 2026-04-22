"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { useT } from "@/lib/i18n/context";
import { fetchPois } from "@/lib/api/overpass";
import type { GeoPoint, Poi, PoiCategory } from "@/lib/types";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-[280px] sm:h-[360px] lg:h-[450px] w-full rounded-xl bg-ink-bg border border-ink-border flex items-center justify-center text-ink-dim text-sm">
      &hellip;
    </div>
  ),
});

const CATEGORY_ICONS: Record<PoiCategory, string> = {
  station: "🚆",
  supermarket: "🛒",
  school: "🏫",
  pharmacy: "💊",
  doctor: "🏥",
  restaurant: "🍽️",
  parking: "🅿️",
};

const INITIAL_RADIUS = 500;
const MAX_RADIUS = 5000;
const RADIUS_OPTIONS = [250, 500, 750, 1000, 5000];

function formatRadius(r: number): string {
  return r >= 1000 ? `${r / 1000} km` : `${r} m`;
}

export default function MapCard({ center }: { center: GeoPoint | null }) {
  const { t } = useT();
  const [radius, setRadius] = useState(500);
  const [allPois, setAllPois] = useState<Poi[]>([]);
  const [active, setActive] = useState<Set<PoiCategory>>(
    new Set(Object.keys(CATEGORY_ICONS) as PoiCategory[]),
  );
  const [loading, setLoading] = useState(false);
  const [loadingFull, setLoadingFull] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!center) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchPois(center, INITIAL_RADIUS)
      .then((list) => {
        if (cancelled) return;
        setAllPois(list);
        setLoading(false);

        setLoadingFull(true);
        return fetchPois(center, MAX_RADIUS).then((full) => {
          if (!cancelled) setAllPois(full);
        });
      })
      .catch(() => {
        if (!cancelled) setError(t.common.error);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
          setLoadingFull(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [center?.lat, center?.lon, t]);

  const categoryLabels: Record<PoiCategory, string> = {
    station: t.map.station,
    supermarket: t.map.supermarket,
    school: t.map.school,
    pharmacy: t.map.pharmacy,
    doctor: t.map.doctor,
    restaurant: t.map.restaurant,
    parking: t.map.parking,
  };

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
    <Card title={t.map.title} icon="🗺️" className="md:col-span-2 xl:col-span-3">
      {!center ? (
        <div className="py-10 text-ink-mute text-sm">{t.common.noCoordinates}</div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {(Object.keys(CATEGORY_ICONS) as PoiCategory[]).map((cat) => {
              const on = active.has(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggle(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    on
                      ? "bg-lime-accent text-ink-bg border-lime-accent"
                      : "bg-ink-bg text-ink-mute border-ink-border hover:text-white"
                  }`}
                >
                  {CATEGORY_ICONS[cat]} {categoryLabels[cat]}
                </button>
              );
            })}
          </div>

          <div className={`relative h-[280px] sm:h-[360px] lg:h-[450px] rounded-xl overflow-hidden border border-ink-border ${expanded ? "invisible h-0 !mb-0" : ""}`}>
            {!expanded && <Map center={center} pois={filtered} radiusM={radius} />}
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="absolute top-2 right-2 z-[1000] w-8 h-8 rounded-lg bg-ink-bg/80 border border-ink-border backdrop-blur flex items-center justify-center text-ink-mute hover:text-white hover:bg-ink-elev transition"
              aria-label="Expand map"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            </button>
          </div>

          {/* Expanded fullscreen overlay */}
          {expanded && (
            <div className="fixed inset-0 z-50 bg-ink-bg flex flex-col">
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-ink-border">
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(CATEGORY_ICONS) as PoiCategory[]).map((cat) => {
                    const on = active.has(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggle(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                          on
                            ? "bg-lime-accent text-ink-bg border-lime-accent"
                            : "bg-ink-bg text-ink-mute border-ink-border hover:text-white"
                        }`}
                      >
                        {CATEGORY_ICONS[cat]} {categoryLabels[cat]}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="ml-3 shrink-0 w-8 h-8 rounded-lg bg-ink-elev border border-ink-border flex items-center justify-center text-ink-mute hover:text-white transition"
                  aria-label="Close"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="flex-1">
                <Map center={center} pois={filtered} radiusM={radius} />
              </div>
              <div className="px-4 sm:px-6 py-3 border-t border-ink-border flex items-center gap-4">
                <div className="text-xs text-ink-dim uppercase tracking-wide">{t.map.radius}</div>
                <div className="flex gap-1.5">
                  {RADIUS_OPTIONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRadius(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                        radius === r
                          ? "bg-lime-accent text-ink-bg border-lime-accent"
                          : "bg-ink-elev text-ink-mute border-ink-border hover:text-white hover:border-ink-mute"
                      }`}
                    >
                      {formatRadius(r)}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-ink-dim ml-auto">
                  {t.map.entries(filtered.length, formatRadius(radius))}
                  {loadingFull && ` · ${t.map.loadingMore}`}
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 rounded-xl bg-ink-bg border border-ink-border p-3">
            <div className="flex items-center justify-between mb-2.5">
              <div className="text-xs text-ink-dim uppercase tracking-wide">{t.map.radius}</div>
              <div className="text-sm font-medium text-white">{formatRadius(radius)}</div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {RADIUS_OPTIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRadius(r)}
                  className={`py-2 rounded-lg text-xs font-medium border transition ${
                    radius === r
                      ? "bg-lime-accent text-ink-bg border-lime-accent"
                      : "bg-ink-elev text-ink-mute border-ink-border hover:text-white hover:border-ink-mute"
                  }`}
                >
                  {formatRadius(r)}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="mt-3 text-xs text-ink-dim">{t.map.loadingPois}</div>
          )}
          {error && (
            <div className="mt-3 text-xs text-red-400">{error}</div>
          )}
          {!loading && !error && (
            <div className="mt-3 text-xs text-ink-dim">
              {t.map.entries(filtered.length, formatRadius(radius))}
              {loadingFull && ` \u00b7 ${t.map.loadingMore}`}
            </div>
          )}
        </>
      )}
    </Card>
  );
}
