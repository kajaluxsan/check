"use client";

import { useEffect, useState } from "react";
import { TrainFront } from "lucide-react";
import Card, { Metric } from "@/components/ui/Card";
import { fetchDepartures, fetchJourneyTime, findNearestStop } from "@/lib/api/transport";
import type { GeoPoint, TransportDeparture, TransportStop } from "@/lib/types";

export default function TransportCard({ center }: { center: GeoPoint | null }) {
  const [stop, setStop] = useState<TransportStop | null>(null);
  const [departures, setDepartures] = useState<TransportDeparture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    return () => { cancelled = true; };
  }, [center]);

  async function onCalcJourney(e: React.FormEvent) {
    e.preventDefault();
    if (!stop) return;
    setJourneyErr(null);
    setJourneyMin(null);
    setJourneyLoading(true);
    try {
      const m = await fetchJourneyTime(stop.name, workAddr);
      if (m == null) setJourneyErr("Keine Verbindung gefunden.");
      else setJourneyMin(m);
    } catch { setJourneyErr("Fehler beim Abrufen."); }
    finally { setJourneyLoading(false); }
  }

  return (
    <Card title="Öffentlicher Verkehr" icon={TrainFront} loading={loading} error={error}>
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

          <div className="rounded-input bg-ink-bg border border-ink-border p-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-dim mb-2">Nächste Abfahrten</div>
            {departures.length > 0 ? (
              <ul className="divide-y divide-ink-border text-sm">
                {departures.map((d, i) => (
                  <li key={i} className="py-2 flex items-center gap-3">
                    <span className="font-mono text-[var(--fg)] w-14">{d.time}</span>
                    <span className="px-2 py-0.5 text-[11px] font-mono bg-accent-soft border border-accent-border rounded-[6px] text-accent">
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
            <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-dim block mb-1.5">Reisezeit berechnen</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={workAddr}
                onChange={(e) => setWorkAddr(e.target.value)}
                placeholder="z.B. Zürich HB"
                className="flex-1 px-3 py-2 rounded-input bg-ink-bg border border-ink-border text-sm text-[var(--fg)] outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={!workAddr || journeyLoading}
                className="px-4 py-2 rounded-input bg-accent text-white text-sm font-medium hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Los
              </button>
            </div>
            {journeyMin != null && <div className="mt-2 text-sm font-mono text-status-good">Fahrzeit: {journeyMin} Min.</div>}
            {journeyErr && <div className="mt-2 text-sm text-status-bad">{journeyErr}</div>}
          </form>
        </>
      ) : (
        !loading && <div className="text-ink-mute text-sm">Keine Haltestelle in der Nähe.</div>
      )}
    </Card>
  );
}
