"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";
import Card from "@/components/ui/Card";
import { getNoiseMapUrl, NOISE_LEGEND, ROAD_LAYER, RAIL_LAYER } from "@/lib/api/geoadmin";
import type { GeoPoint } from "@/lib/types";

type NoiseMode = "road" | "rail";

export default function NoiseCard({ center }: { center: GeoPoint | null }) {
  const [mode, setMode] = useState<NoiseMode>("road");

  if (!center) {
    return <Card title="Lärm & Umwelt" icon={Volume2} error="Keine Koordinaten." />;
  }

  const layer = mode === "road" ? ROAD_LAYER : RAIL_LAYER;
  const url = getNoiseMapUrl(layer, center);

  return (
    <Card title="Lärm & Umwelt" icon={Volume2}>
      <div className="flex gap-2 mb-4">
        <TabButton active={mode === "road"} onClick={() => setMode("road")}>Strassenlärm</TabButton>
        <TabButton active={mode === "rail"} onClick={() => setMode("rail")}>Bahnlärm</TabButton>
      </div>

      <div className="rounded-input overflow-hidden border border-ink-border bg-ink-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={`${mode}-${center.lat}-${center.lon}`}
          src={url}
          alt={`${mode === "road" ? "Strassen" : "Bahn"}lärm`}
          width={480}
          height={300}
          className="w-full h-auto"
          loading="eager"
        />
      </div>

      <div className="mt-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-dim mb-2">Legende (Lden Tagesmittel)</div>
        <div className="flex gap-0.5 rounded-[8px] overflow-hidden">
          {NOISE_LEGEND.map((l) => (
            <div key={l.min} className="flex-1 h-3" style={{ backgroundColor: l.color }} title={l.label} />
          ))}
        </div>
        <div className="flex justify-between font-mono text-[10px] text-ink-dim mt-1">
          <span>&lt; 45 dB</span><span>55 dB</span><span>65 dB</span><span>&gt; 70 dB</span>
        </div>
      </div>

      <a
        href={`https://map.geo.admin.ch/?lang=de&layers=${layer}&E=${center.lon}&N=${center.lat}&zoom=8`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center text-xs text-accent hover:underline"
      >
        Auf map.geo.admin.ch anzeigen →
      </a>
    </Card>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-input text-sm font-medium border transition ${
        active ? "bg-accent text-white border-accent" : "bg-ink-bg text-ink-mute border-ink-border hover:text-[var(--fg)]"
      }`}
    >
      {children}
    </button>
  );
}
