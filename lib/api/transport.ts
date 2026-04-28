import type {
  GeoPoint,
  JourneyResult,
  JourneySection,
  TransportDeparture,
  TransportStop,
} from "../types";
import { haversine } from "./overpass";

/**
 * Wrapper around transport.opendata.ch — the community API over the SBB
 * timetable data. Free, no key, CORS-enabled.
 */

export async function findNearestStop(
  point: GeoPoint,
): Promise<TransportStop | null> {
  const params = new URLSearchParams({
    x: point.lat.toString(),
    y: point.lon.toString(),
    type: "station",
  });
  const res = await fetch(
    `https://transport.opendata.ch/v1/locations?${params.toString()}`,
  );
  if (!res.ok) throw new Error(`transport.opendata.ch ${res.status}`);
  const data = (await res.json()) as { stations: RawStation[] };
  // The first result is often a generic address with null coordinates.
  // Skip entries without valid coordinates or without an id.
  const s = (data.stations ?? []).find(
    (st) => st.coordinate?.x != null && st.coordinate?.y != null && st.id,
  );
  if (!s) return null;
  const lat = s.coordinate!.x!;
  const lon = s.coordinate!.y!;
  return {
    id: s.id ?? s.name,
    name: s.name,
    lat,
    lon,
    distanceM: Math.round(haversine(point, { lat, lon })),
  };
}

export async function fetchDepartures(
  stationName: string,
  limit = 5,
): Promise<TransportDeparture[]> {
  const params = new URLSearchParams({
    station: stationName,
    limit: limit.toString(),
  });
  const res = await fetch(
    `https://transport.opendata.ch/v1/stationboard?${params.toString()}`,
  );
  if (!res.ok) throw new Error(`transport.opendata.ch ${res.status}`);
  const data = (await res.json()) as { stationboard: RawStationboard[] };
  return (data.stationboard ?? []).slice(0, limit).map((s) => ({
    time: s.stop.departure
      ? new Date(s.stop.departure).toLocaleTimeString("de-CH", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—",
    destination: s.to ?? "—",
    category: s.category ?? "",
    number: s.number ?? s.name ?? "",
  }));
}

export async function fetchJourneyTime(
  fromName: string,
  toQuery: string,
): Promise<number | null> {
  const journey = await fetchJourney(fromName, toQuery);
  return journey?.durationMin ?? null;
}

export async function fetchJourney(
  fromName: string,
  toQuery: string,
): Promise<JourneyResult | null> {
  const params = new URLSearchParams({
    from: fromName,
    to: toQuery,
    limit: "1",
  });
  const res = await fetch(
    `https://transport.opendata.ch/v1/connections?${params.toString()}`,
  );
  if (!res.ok) throw new Error(`transport.opendata.ch ${res.status}`);
  const data = (await res.json()) as { connections: RawConnection[] };
  const c = data.connections?.[0];
  if (!c?.duration) return null;

  const m = /(\d+)d(\d{2}):(\d{2}):/.exec(c.duration);
  if (!m) return null;
  const durationMin = parseInt(m[1]) * 1440 + parseInt(m[2]) * 60 + parseInt(m[3]);

  const sections: JourneySection[] = (c.sections ?? [])
    .map((s): JourneySection | null => {
      const depTime = fmtTime(s.departure?.departure);
      const arrTime = fmtTime(s.arrival?.arrival);
      if (!depTime || !arrTime) return null;

      const isWalk = s.walk != null;
      return {
        departureName: s.departure?.station?.name ?? "—",
        departureTime: depTime,
        arrivalName: s.arrival?.station?.name ?? "—",
        arrivalTime: arrTime,
        category: isWalk ? "walk" : (s.journey?.category ?? ""),
        line: isWalk ? "" : `${s.journey?.category ?? ""} ${s.journey?.number ?? ""}`.trim(),
        direction: s.journey?.to ?? "",
        isWalk,
      };
    })
    .filter((s): s is JourneySection => s !== null);

  return {
    durationMin,
    departure: fmtTime(c.from?.departure) ?? "—",
    arrival: fmtTime(c.to?.arrival) ?? "—",
    transfers: c.transfers ?? 0,
    sections,
  };
}

function fmtTime(iso: string | undefined | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" });
}

interface RawStation {
  id?: string;
  name: string;
  coordinate?: { x: number; y: number };
}

interface RawStationboard {
  stop: { departure?: string };
  to?: string;
  category?: string;
  number?: string;
  name?: string;
}

interface RawConnection {
  duration?: string;
  transfers?: number;
  from?: { departure?: string; station?: { name?: string } };
  to?: { arrival?: string; station?: { name?: string } };
  sections?: RawSection[];
}

interface RawSection {
  departure?: { departure?: string; station?: { name?: string } };
  arrival?: { arrival?: string; station?: { name?: string } };
  journey?: { category?: string; number?: string; to?: string };
  walk?: unknown;
}
