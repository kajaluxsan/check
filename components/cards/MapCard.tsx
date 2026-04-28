"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import Card from "@/components/ui/Card";
import { useT } from "@/lib/i18n/context";
import { fetchPois } from "@/lib/api/overpass";
import type { GeoPoint, Poi, PoiCategory } from "@/lib/types";

const LeafletMap = dynamic(() => import("@/components/Map"), {
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
  bank: "🏦",
  fuel: "⛽",
  post: "📬",
  sport: "🏋️",
  park: "🌳",
  library: "📚",
  kiosk: "🏪",
  kindergarten: "👶",
  bus_tram: "🚌",
  worship: "⛪",
  culture: "🎭",
};

const DEFAULT_ACTIVE: PoiCategory[] = ["station", "supermarket", "school"];

const INITIAL_RADIUS = 500;
const MAX_RADIUS = 5000;
const RADIUS_OPTIONS = [250, 500, 750, 1000, 5000];

function formatRadius(r: number): string {
  return r >= 1000 ? `${r / 1000} km` : `${r} m`;
}

export default function MapCard({ center }: { center: GeoPoint | null }) {
  const { t } = useT();
  const [radius, setRadius] = useState(500);
  const [active, setActive] = useState<Set<PoiCategory>>(new Set(DEFAULT_ACTIVE));
  const [expanded, setExpanded] = useState(false);
  const [loadingCats, setLoadingCats] = useState<Set<PoiCategory>>(new Set());
  const [error, setError] = useState<string | null>(null);

  // Cache: category → Poi[] (at MAX_RADIUS)
  const cacheRef = useRef<Map<PoiCategory, Poi[]>>(new Map());
  // Track which categories have been fetched at full radius
  const fetchedFullRef = useRef<Set<PoiCategory>>(new Set());

  const centerRef = useRef(center);
  centerRef.current = center;

  // Fetch a set of categories (fast at INITIAL_RADIUS, then full at MAX_RADIUS)
  const fetchCategories = useCallback(async (cats: PoiCategory[]) => {
    const c = centerRef.current;
    if (!c || cats.length === 0) return;

    const catsToFetch = cats.filter((cat) => !fetchedFullRef.current.has(cat));
    if (catsToFetch.length === 0) return;

    setLoadingCats((prev) => {
      const next = new Set(prev);
      catsToFetch.forEach((cat) => next.add(cat));
      return next;
    });
    setError(null);

    try {
      // Phase 1: fast fetch
      const fast = await fetchPois(c, INITIAL_RADIUS, catsToFetch);
      // Store in cache immediately
      for (const cat of catsToFetch) {
        cacheRef.current.set(cat, fast.filter((p) => p.category === cat));
      }
      // Trigger re-render
      setLoadingCats((prev) => new Set(prev));

      // Phase 2: full fetch
      const full = await fetchPois(c, MAX_RADIUS, catsToFetch);
      for (const cat of catsToFetch) {
        cacheRef.current.set(cat, full.filter((p) => p.category === cat));
        fetchedFullRef.current.add(cat);
      }
    } catch {
      setError(t.common.error);
    } finally {
      setLoadingCats((prev) => {
        const next = new Set(prev);
        catsToFetch.forEach((cat) => next.delete(cat));
        return next;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On mount / center change: fetch default categories
  useEffect(() => {
    if (!center) return;
    // Reset cache when center changes
    cacheRef.current.clear();
    fetchedFullRef.current.clear();
    fetchCategories(DEFAULT_ACTIVE);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center?.lat, center?.lon]);

  function toggle(cat: PoiCategory) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
        // Fetch if not cached
        if (!cacheRef.current.has(cat)) {
          fetchCategories([cat]);
        }
      }
      return next;
    });
  }

  // Build filtered POIs from cache
  const allCachedPois: Poi[] = [];
  for (const cat of active) {
    const pois = cacheRef.current.get(cat);
    if (pois) allCachedPois.push(...pois);
  }
  const filtered = allCachedPois.filter((p) => p.distanceM <= radius);

  const isLoading = loadingCats.size > 0;

  const categoryLabels: Record<PoiCategory, string> = {
    station: t.map.station,
    supermarket: t.map.supermarket,
    school: t.map.school,
    pharmacy: t.map.pharmacy,
    doctor: t.map.doctor,
    restaurant: t.map.restaurant,
    parking: t.map.parking,
    bank: t.map.bank,
    fuel: t.map.fuel,
    post: t.map.post,
    sport: t.map.sport,
    park: t.map.park,
    library: t.map.library,
    kiosk: t.map.kiosk,
    kindergarten: t.map.kindergarten,
    bus_tram: t.map.bus_tram,
    worship: t.map.worship,
    culture: t.map.culture,
  };

  const categoryButtons = (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(CATEGORY_ICONS) as PoiCategory[]).map((cat) => {
        const on = active.has(cat);
        const catLoading = loadingCats.has(cat);
        return (
          <button
            key={cat}
            type="button"
            onClick={() => toggle(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
              on
                ? "bg-lime-accent text-ink-bg border-lime-accent"
                : "bg-ink-bg text-ink-mute border-ink-border hover:text-white"
            } ${catLoading ? "animate-pulse" : ""}`}
          >
            {CATEGORY_ICONS[cat]} {categoryLabels[cat]}
          </button>
        );
      })}
    </div>
  );

  return (
    <Card title={t.map.title} icon="🗺️" className="md:col-span-2 xl:col-span-3">
      {!center ? (
        <div className="py-10 text-ink-mute text-sm">{t.common.noCoordinates}</div>
      ) : (
        <>
          <div className="mb-4">{categoryButtons}</div>

          <div className={`relative h-[280px] sm:h-[360px] lg:h-[450px] rounded-xl overflow-hidden border border-ink-border ${expanded ? "invisible h-0 !mb-0" : ""}`}>
            {!expanded && <LeafletMap center={center} pois={filtered} radiusM={radius} />}
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

          {expanded && (
            <div className="fixed inset-0 z-50 bg-ink-bg flex flex-col">
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-ink-border">
                {categoryButtons}
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
                <LeafletMap center={center} pois={filtered} radiusM={radius} />
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

          {isLoading && (
            <div className="mt-3 text-xs text-ink-dim">{t.map.loadingPois}</div>
          )}
          {error && (
            <div className="mt-3 text-xs text-red-400">{error}</div>
          )}
          {!isLoading && !error && (
            <div className="mt-3 text-xs text-ink-dim">
              {t.map.entries(filtered.length, formatRadius(radius))}
            </div>
          )}
        </>
      )}
    </Card>
  );
}
