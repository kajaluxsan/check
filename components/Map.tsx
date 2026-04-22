"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { GeoPoint, Poi, PoiCategory } from "@/lib/types";

const CATEGORY_ICON: Record<PoiCategory, string> = {
  parking: "🅿️",
  supermarket: "🛒",
  school: "🏫",
  pharmacy: "💊",
  doctor: "🏥",
  restaurant: "🍽️",
  station: "🚆",
};

function emojiIcon(emoji: string) {
  return L.divIcon({
    className: "",
    html: `<div style="
      display:inline-flex;align-items:center;justify-content:center;
      width:30px;height:30px;border-radius:50%;background:var(--bg-elev);
      border:2px solid var(--accent);font-size:16px;
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
    ">${emoji}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
}

const HOME_ICON = L.divIcon({
  className: "",
  html: `<div style="
    display:inline-flex;align-items:center;justify-content:center;
    width:38px;height:38px;border-radius:50%;background:var(--accent);
    border:3px solid var(--bg);font-size:18px;font-weight:bold;color:var(--bg);
    box-shadow:0 2px 10px rgba(100,163,13,0.4);
  ">🏠</div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

export default function Map({
  center,
  pois,
  radiusM,
}: {
  center: GeoPoint;
  pois: Poi[];
  radiusM: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current, {
      center: [center.lat, center.lon],
      zoom: 15,
      scrollWheelZoom: false,
    });

    const isLight = document.documentElement.classList.contains("light");
    const tileStyle = isLight ? "light_all" : "dark_all";
    L.tileLayer(`https://{s}.basemaps.cartocdn.com/${tileStyle}/{z}/{x}/{y}{r}.png`, {
      attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [center.lat, center.lon]);

  // Update overlays (circle, markers) when pois/radius change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const layers: L.Layer[] = [];

    const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
    const circle = L.circle([center.lat, center.lon], {
      radius: radiusM,
      color: accent,
      fillColor: accent,
      fillOpacity: 0.04,
      weight: 1,
    }).addTo(map);
    layers.push(circle);

    const homeMarker = L.marker([center.lat, center.lon], { icon: HOME_ICON })
      .bindPopup("Deine Adresse")
      .addTo(map);
    layers.push(homeMarker);

    for (const p of pois) {
      const marker = L.marker([p.lat, p.lon], {
        icon: emojiIcon(CATEGORY_ICON[p.category]),
      })
        .bindPopup(
          `<div class="text-sm"><div class="font-semibold">${p.name}</div><div class="text-xs text-neutral-500">${p.distanceM} m</div></div>`
        )
        .addTo(map);
      layers.push(marker);
    }

    return () => {
      layers.forEach((l) => l.remove());
    };
  }, [center.lat, center.lon, pois, radiusM]);

  return (
    <div
      ref={containerRef}
      style={{ height: "100%", width: "100%", borderRadius: "12px" }}
    />
  );
}
