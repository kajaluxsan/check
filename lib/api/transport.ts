import type {
  GeoPoint,
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
    x: point.lon.toString(),
    y: point.lat.toString(),
    type: "station",
  });
  const res = await fetch(
    `https://transport.opendata.ch/v1/locations?${params.toString()}`,
  );
  if (!res.ok) throw new Error(`transport.opendata.ch ${res.status}`);
  const data = (await res.json()) as { stations: RawStation[] };
  const s = data.stations?.[0];
  if (!s || !s.coordinate?.x || !s.coordinate?.y) return null;
  const lat = s.coordinate.x;
  const lon = s.coordinate.y;
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
  // Duration format: "00d00:45:00"
  const m = /(\d+)d(\d{2}):(\d{2}):/.exec(c.duration);
  if (!m) return null;
  return parseInt(m[1]) * 1440 + parseInt(m[2]) * 60 + parseInt(m[3]);
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
}
