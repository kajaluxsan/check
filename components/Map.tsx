"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { GeoPoint, Poi, PoiCategory } from "@/lib/types";

const CATEGORY_ICON: Record<PoiCategory, string> = {
  parking: "P",
  supermarket: "S",
  school: "Sc",
  pharmacy: "+",
  doctor: "Dr",
  restaurant: "R",
  station: "T",
};

function letterIcon(letter: string) {
  return L.divIcon({
    className: "",
    html: `<div style="
      display:inline-flex;align-items:center;justify-content:center;
      width:28px;height:28px;border-radius:8px;background:#1e1916;
      border:2px solid #ef4444;font-size:11px;font-weight:600;color:#ef4444;
      box-shadow:0 2px 6px rgba(0,0,0,0.5);font-family:Inter,system-ui,sans-serif;
    ">${letter}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

const HOME_ICON = L.divIcon({
  className: "",
  html: `<div style="
    display:inline-flex;align-items:center;justify-content:center;
    width:36px;height:36px;border-radius:50%;background:#ef4444;
    border:3px solid #14100e;font-size:16px;color:white;
    box-shadow:0 2px 10px rgba(239,68,68,0.5);
  ">●</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
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
          color: "#ef4444",
          fillColor: "#ef4444",
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
          icon={letterIcon(CATEGORY_ICON[p.category])}
        >
          <Popup>
            <div className="text-sm">
              <div className="font-semibold">{p.name}</div>
              <div className="text-xs opacity-70">{p.distanceM} m</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
