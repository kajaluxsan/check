"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
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
      width:30px;height:30px;border-radius:50%;background:#141414;
      border:2px solid #c8f035;font-size:16px;
      box-shadow:0 2px 6px rgba(0,0,0,0.5);
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
    width:38px;height:38px;border-radius:50%;background:#c8f035;
    border:3px solid #0a0a0a;font-size:18px;font-weight:bold;color:#0a0a0a;
    box-shadow:0 2px 10px rgba(200,240,53,0.5);
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
  return (
    <MapContainer
      center={[center.lat, center.lon]}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <Circle
        center={[center.lat, center.lon]}
        radius={radiusM}
        pathOptions={{
          color: "#c8f035",
          fillColor: "#c8f035",
          fillOpacity: 0.04,
          weight: 1,
        }}
      />
      <Marker position={[center.lat, center.lon]} icon={HOME_ICON}>
        <Popup>Deine Adresse</Popup>
      </Marker>
      {pois.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lon]}
          icon={emojiIcon(CATEGORY_ICON[p.category])}
        >
          <Popup>
            <div className="text-sm">
              <div className="font-semibold">{p.name}</div>
              <div className="text-xs text-neutral-500">{p.distanceM} m</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
