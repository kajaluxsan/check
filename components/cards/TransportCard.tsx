"use client";

import { useEffect, useState } from "react";
import Card, { Metric } from "@/components/ui/Card";
import {
  fetchDepartures,
  fetchJourneyTime,
  findNearestStop,
} from "@/lib/api/transport";
import type { GeoPoint, TransportDeparture, TransportStop } from "@/lib/types";

export default function TransportCard({ center }: { center: GeoPoint | null }) {
  const [stop, setStop] = useState<TransportStop | null>(null);
  const [departures, setDepartures] = useState<TransportDeparture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Journey calculator
  const [workAddr, setWorkAddr] = useState("");
  const [journeyMin, setJourneyMin] = useState<number | null>(null);
  const [journeyErr, setJourneyErr] = useState<string | null>(null);
  const [journeyLoading, setJourneyLoading] = useState(false);

  useEffect(() => {
    if (!center) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const near = await findNearestStop(center);
        if (cancelled) return;
        setStop(near);
        if (near) {
          const dep = await fetchDepartures(near.name, 5);
          if (!cancelled) setDepartures(dep);
        }
      } catch {
        if (!cancelled) setError("Daten momentan nicht verfügbar.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [center]);

  async function onCalcJourney(e: React.FormEvent) {
    e.preventDefault();
    if (!stop) return;
    setJourneyErr(null);
    setJourneyMin(null);
    setJourneyLoading(true);
    try {
      const m = await fetchJourneyTime(stop.name, workAddr);
      if (m == null) {
        setJourneyErr("Keine Verbindung gefunden.");
      } else {
        setJourneyMin(m);
      }
    } catch {
      setJourneyErr("Fehler beim Abrufen der Verbindung.");
    } finally {
      setJourneyLoading(false);
    }
  }

  return (
    <Card
      title="Öffentlicher Verkehr"
      icon="🚆"
      source="transport.opendata.ch"
      loading={loading}
      error={error}
    >
      {stop ? (
        <>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <Metric label="Nächste Haltestelle" value={stop.name} />
            <Metric
              label="Distanz"
              value={`${stop.distanceM} m`}
              sub={`~${Math.max(1, Math.round(stop.distanceM / 80))} Min. zu Fuss`}
              tone={stop.distanceM < 400 ? "good" : "neutral"}
            />
          </div>

          <div className="rounded-xl bg-ink-bg border border-ink-border p-3">
            <div className="text-xs text-ink-dim uppercase tracking-wide mb-2">
              Nächste Abfahrten
            </div>
            {departures.length > 0 ? (
              <ul className="divide-y divide-ink-border text-sm">
                {departures.map((d, i) => (
                  <li key={i} className="py-2 flex items-center gap-3">
                    <span className="font-mono text-white w-14">{d.time}</span>
                    <span className="px-2 py-0.5 text-[11px] bg-ink-elev2 border border-ink-border rounded text-ink-mute">
                      {d.category} {d.number}
                    </span>
                    <span className="text-ink-mute truncate">→ {d.destination}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-ink-dim">Keine Daten.</div>
            )}
          </div>

          <form onSubmit={onCalcJourney} className="mt-5">
            <label className="text-xs text-ink-mute block mb-1.5">
              Reisezeit zu einer anderen Adresse
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={workAddr}
                onChange={(e) => setWorkAddr(e.target.value)}
                placeholder="z.B. Zürich HB"
                className="flex-1 px-3 py-2 rounded-lg bg-ink-bg border border-ink-border text-sm text-white outline-none focus:border-lime-accent"
              />
              <button
                type="submit"
                disabled={!workAddr || journeyLoading}
                className="px-4 py-2 rounded-lg bg-lime-accent text-ink-bg text-sm font-medium hover:bg-lime-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Rechnen
              </button>
            </div>
            {journeyMin != null && (
              <div className="mt-2 text-sm text-lime-accent">
                Fahrzeit: {journeyMin} Min.
              </div>
            )}
            {journeyErr && (
              <div className="mt-2 text-sm text-red-400">{journeyErr}</div>
            )}
          </form>
        </>
      ) : (
        !loading && <div className="text-ink-mute text-sm">Keine Haltestelle in der Nähe.</div>
      )}
    </Card>
  );
}
