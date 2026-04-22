"use client";

import { useEffect, useState } from "react";
import Card, { Metric } from "@/components/ui/Card";
import {
  fetchDepartures,
  fetchJourney,
  findNearestStop,
} from "@/lib/api/transport";
import { useT } from "@/lib/i18n/context";
import type { GeoPoint, JourneyResult, TransportDeparture, TransportStop } from "@/lib/types";

export default function TransportCard({ center }: { center: GeoPoint | null }) {
  const { t } = useT();
  const [stop, setStop] = useState<TransportStop | null>(null);
  const [departures, setDepartures] = useState<TransportDeparture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Journey calculator
  const [workAddr, setWorkAddr] = useState("");
  const [journey, setJourney] = useState<JourneyResult | null>(null);
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
        if (!cancelled) setError(t.common.error);
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
    setJourney(null);
    setJourneyLoading(true);
    try {
      const result = await fetchJourney(stop.name, workAddr);
      if (!result) {
        setJourneyErr(t.transport.noConnection);
      } else {
        setJourney(result);
      }
    } catch {
      setJourneyErr(t.transport.journeyError);
    } finally {
      setJourneyLoading(false);
    }
  }

  return (
    <Card
      title={t.transport.title}
      icon="🚆"
      loading={loading}
      error={error}
    >
      {stop ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <Metric label={t.transport.nearestStop} value={stop.name} />
            <Metric
              label={t.transport.distance}
              value={`${stop.distanceM} m`}
              sub={t.transport.walkMin(Math.max(1, Math.round(stop.distanceM / 80)))}
              tone={stop.distanceM < 400 ? "good" : "neutral"}
            />
          </div>

          <div className="rounded-xl bg-ink-bg border border-ink-border p-3">
            <div className="text-xs text-ink-dim uppercase tracking-wide mb-2">
              {t.transport.departures}
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
              <div className="text-sm text-ink-dim">{t.transport.noData}</div>
            )}
          </div>

          <form onSubmit={onCalcJourney} className="mt-5">
            <label className="text-xs text-ink-mute block mb-1.5">
              {t.transport.journeyLabel}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={workAddr}
                onChange={(e) => setWorkAddr(e.target.value)}
                placeholder={t.transport.journeyPlaceholder}
                className="flex-1 px-3 py-2 rounded-lg bg-ink-bg border border-ink-border text-sm text-white outline-none focus:border-lime-accent"
              />
              <button
                type="submit"
                disabled={!workAddr || journeyLoading}
                className="px-4 py-2 rounded-lg bg-lime-accent text-ink-bg text-sm font-medium hover:bg-lime-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.transport.calculate}
              </button>
            </div>
            {journeyErr && (
              <div className="mt-2 text-sm text-red-400">{journeyErr}</div>
            )}
          </form>

          {journey && (
            <div className="mt-4 rounded-xl bg-ink-bg border border-ink-border p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs text-ink-dim uppercase tracking-wide">
                  {t.transport.connection}
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-white font-medium">
                    {journey.departure} → {journey.arrival}
                  </span>
                  <span className="text-lime-accent font-semibold">
                    {journey.durationMin} {t.common.min}
                  </span>
                  {journey.transfers > 0 && (
                    <span className="text-ink-mute">
                      {t.transport.transfers(journey.transfers)}
                    </span>
                  )}
                </div>
              </div>

              <div className="relative pl-5">
                {journey.sections.map((s, i) => (
                  <div key={i} className="relative pb-3 last:pb-0">
                    {/* Vertikale Linie */}
                    {i < journey.sections.length - 1 && (
                      <div className="absolute left-[-13px] top-3 bottom-0 w-px bg-ink-border" />
                    )}
                    {/* Punkt */}
                    <div
                      className={`absolute left-[-16px] top-1 w-1.5 h-1.5 rounded-full ${
                        s.isWalk ? "bg-ink-mute" : "bg-lime-accent"
                      }`}
                    />

                    <div className="flex items-start gap-2 text-sm">
                      <span className="font-mono text-xs text-ink-dim w-10 shrink-0">
                        {s.departureTime}
                      </span>
                      {s.isWalk ? (
                        <span className="text-ink-mute text-xs">
                          🚶 {t.transport.walkTo(s.arrivalName)}
                        </span>
                      ) : (
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-1.5 py-0.5 text-[11px] bg-ink-elev2 border border-ink-border rounded text-ink-mute shrink-0">
                              {s.line}
                            </span>
                            <span className="text-white text-xs truncate">
                              {s.departureName}
                            </span>
                            <span className="text-ink-dim text-xs">→</span>
                            <span className="text-white text-xs truncate">
                              {s.arrivalName}
                            </span>
                          </div>
                          {s.direction && (
                            <div className="text-[11px] text-ink-dim mt-0.5">
                              {t.transport.direction(s.direction, s.arrivalTime)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        !loading && <div className="text-ink-mute text-sm">{t.transport.noStop}</div>
      )}
    </Card>
  );
}
