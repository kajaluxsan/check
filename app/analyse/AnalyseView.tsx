"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n/context";
import AddressSearch from "@/components/AddressSearch";
import BuildingCard from "@/components/cards/BuildingCard";
import LegalCard from "@/components/cards/LegalCard";
import MapCard from "@/components/cards/MapCard";
import NoiseCard from "@/components/cards/NoiseCard";
import RentCheckCard from "@/components/cards/RentCheckCard";
import TaxCard from "@/components/cards/TaxCard";
import TransportCard from "@/components/cards/TransportCard";
import { geocodeAddress } from "@/lib/api/nominatim";
import type { NominatimResult } from "@/lib/types";

export default function AnalyseView() {
  const { t } = useT();
  const params = useSearchParams();
  const address = params.get("address") ?? "";
  const rooms = params.get("rooms") ?? "3.5";
  const rent = Number(params.get("rent") ?? "0");

  const [geo, setGeo] = useState<NominatimResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    geocodeAddress(address)
      .then((r) => {
        if (cancelled) return;
        if (!r) setError(t.analyse.notFound);
        setGeo(r);
      })
      .catch(() => {
        if (!cancelled) setError(t.analyse.geocodeError);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  if (!address) {
    return (
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 py-16">
        <h1 className="font-serif text-4xl mb-2">{t.analyse.title}</h1>
        <p className="text-ink-mute mb-8">{t.analyse.subtitle}</p>
        <AddressSearch />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-2">
            {t.analyse.yourAnalysis}
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[var(--fg)]">
            {address}
          </h1>
          {geo?.displayName && (
            <p className="text-ink-mute text-sm mt-2 truncate max-w-lg">{geo.displayName}</p>
          )}
        </div>
        {geo && (
          <div className="flex flex-wrap gap-2">
            <Chip>{rooms} Zi.</Chip>
            <Chip>{new Intl.NumberFormat("de-CH").format(rent)} CHF</Chip>
            {geo.canton && <Chip>{geo.canton}</Chip>}
          </div>
        )}
      </div>

      {loading && (
        <div className="py-20 text-center text-ink-mute">
          <div className="inline-block w-6 h-6 border-2 border-ink-border border-t-accent rounded-full animate-spin mb-3" />
          <div className="text-sm">{t.analyse.searching}</div>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-card bg-ink-elev border border-status-bad/30 p-6 text-center">
          <div className="text-status-bad font-medium mb-2">{error}</div>
          <div className="text-ink-mute text-sm mb-4">{t.analyse.tryAgain}</div>
          <div className="max-w-xl mx-auto">
            <AddressSearch variant="compact" />
          </div>
        </div>
      )}

      {!loading && !error && geo && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          <RentCheckCard canton={geo.canton ?? null} rooms={rooms} actual={rent} />
          <BuildingCard center={{ lat: geo.lat, lon: geo.lon }} hasHouseNumber={!!geo.houseNumber} />
          <MapCard center={{ lat: geo.lat, lon: geo.lon }} />
          <NoiseCard center={{ lat: geo.lat, lon: geo.lon }} />
          <TransportCard center={{ lat: geo.lat, lon: geo.lon }} />
          <TaxCard canton={geo.canton ?? null} />
          <LegalCard rent={rent} rooms={rooms} />
        </div>
      )}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-3 py-1.5 rounded-pill bg-ink-elev border border-ink-border font-mono text-xs text-ink-mute">
      {children}
    </span>
  );
}
