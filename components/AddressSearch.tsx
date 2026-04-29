"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n/context";
import { geocodeAddress } from "@/lib/api/nominatim";
import type { NominatimResult } from "@/lib/types";

const ROOM_OPTIONS = ["1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5", "5.5", "6"];
const DEBOUNCE_MS = 500;

// Stubs for downstream API calls — triggered on successful geocode.
async function fetchOverpass(_lat: number, _lon: number) { return null; }
async function fetchTransport(_lat: number, _lon: number) { return null; }
async function fetchLaerm(_lat: number, _lon: number) { return null; }

export default function AddressSearch({
  variant = "hero",
}: {
  variant?: "hero" | "compact";
}) {
  const { t } = useT();
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [rooms, setRooms] = useState("3.5");
  const [rent, setRent] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Live preview state
  const [preview, setPreview] = useState<NominatimResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [lowImportance, setLowImportance] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced geocode for live preview
  const debouncedGeocode = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 4) {
      setPreview(null);
      setLowImportance(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await geocodeAddress(query);
        setPreview(result);
        setLowImportance(result !== null && result.importance < 0.3);
        if (!result) setError(t.search.errorAddress);
      } catch {
        setError(t.search.errorAddress);
        setPreview(null);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);
  }, [t.search.errorAddress]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function onAddressChange(value: string) {
    setAddress(value);
    debouncedGeocode(value);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (address.trim().length < 4) {
      setError(t.search.errorAddress);
      return;
    }
    const rentNum = Number(rent);
    if (!rentNum || rentNum < 100) {
      setError(t.search.errorRent);
      return;
    }

    // If no preview yet, geocode now
    if (!preview) {
      setLoading(true);
      try {
        const result = await geocodeAddress(address);
        if (!result) {
          setError(t.search.errorAddress);
          setLoading(false);
          return;
        }
        setPreview(result);
        setLowImportance(result.importance < 0.3);

        // Fire parallel stub calls
        void Promise.all([
          fetchOverpass(result.lat, result.lon),
          fetchTransport(result.lat, result.lon),
          fetchLaerm(result.lat, result.lon),
        ]);
      } catch {
        setError(t.search.errorAddress);
        setLoading(false);
        return;
      } finally {
        setLoading(false);
      }
    } else {
      // Fire parallel stub calls with cached preview
      void Promise.all([
        fetchOverpass(preview.lat, preview.lon),
        fetchTransport(preview.lat, preview.lon),
        fetchLaerm(preview.lat, preview.lon),
      ]);
    }

    const params = new URLSearchParams({
      address: address.trim(),
      rooms,
      rent: String(rentNum),
    });
    router.push(`/analyse?${params.toString()}`);
  }

  const isHero = variant === "hero";

  return (
    <div>
      <form
        onSubmit={submit}
        className={`${
          isHero ? "rounded-[20px] p-4 sm:p-5" : "rounded-card p-3"
        } bg-ink-elev border border-ink-border shadow-card`}
      >
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <input
              type="text"
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
              placeholder={t.search.addressPlaceholder}
              className="w-full px-3 py-3.5 rounded-input bg-ink-bg border border-ink-border text-[var(--fg)] placeholder:text-ink-dim outline-none focus:border-accent transition"
            />
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-ink-border border-t-accent rounded-full animate-spin" />
              </div>
            )}
          </div>

          <select
            value={rooms}
            onChange={(e) => setRooms(e.target.value)}
            className="py-3.5 px-3 rounded-input bg-ink-bg border border-ink-border text-[var(--fg)] outline-none focus:border-accent"
          >
            {ROOM_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r} {t.search.rooms}
              </option>
            ))}
          </select>

          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              min={100}
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              placeholder={t.search.rentPlaceholder}
              className="w-full py-3.5 pl-3 pr-14 rounded-input bg-ink-bg border border-ink-border text-[var(--fg)] placeholder:text-ink-dim outline-none focus:border-accent font-mono"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-dim text-sm font-mono">
              {t.common.chf}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="py-3.5 px-5 rounded-input bg-accent text-white font-semibold hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed transition whitespace-nowrap"
          >
            {t.search.submit}
          </button>
        </div>

        {error && (
          <div className="mt-3 text-sm text-status-bad">{error}</div>
        )}
      </form>

      {/* Live preview: Stadt, Quartier, formatted address */}
      {preview && !error && (
        <div className="mt-3 rounded-input bg-ink-elev border border-ink-border px-4 py-3">
          {lowImportance && (
            <div className="text-xs text-status-warn mb-2">
              ⚠ Adresse nicht eindeutig gefunden — bitte präzisieren
            </div>
          )}
          <div className="text-sm text-[var(--fg)] truncate">{preview.displayName}</div>
          <div className="flex gap-4 mt-1.5 text-xs text-ink-mute">
            {preview.city && (
              <span>Stadt: <span className="text-[var(--fg)]">{preview.city}</span></span>
            )}
            {preview.quartier && (
              <span>Quartier: <span className="text-[var(--fg)]">{preview.quartier}</span></span>
            )}
            {preview.postcode && (
              <span>PLZ: <span className="text-[var(--fg)]">{preview.postcode}</span></span>
            )}
            {preview.canton && (
              <span>Kanton: <span className="text-[var(--fg)]">{preview.canton}</span></span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
