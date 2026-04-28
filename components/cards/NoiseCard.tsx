"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";
import Card from "@/components/ui/Card";
import { useT } from "@/lib/i18n/context";
import {
  getNoiseMapUrl,
  NOISE_LEGEND,
  ROAD_LAYER,
  RAIL_LAYER,
} from "@/lib/api/geoadmin";
import type { GeoPoint } from "@/lib/types";

type NoiseMode = "road" | "rail";

export default function NoiseCard({ center }: { center: GeoPoint | null }) {
  const { t } = useT();
  const [mode, setMode] = useState<NoiseMode>("road");

  if (!center) {
    return (
      <Card title={t.noise.title} icon={Volume2} error={t.noise.noCoords} />
    );
  }

  const layer = mode === "road" ? ROAD_LAYER : RAIL_LAYER;
  const url = getNoiseMapUrl(layer, center);

  return (
    <Card title={t.noise.title} icon={Volume2}>
      <div className="flex gap-2 mb-4">
        <TabButton active={mode === "road"} onClick={() => setMode("road")}>
          {t.noise.road}
        </TabButton>
        <TabButton active={mode === "rail"} onClick={() => setMode("rail")}>
          {t.noise.rail}
        </TabButton>
      </div>

      <div className="rounded-xl overflow-hidden border border-ink-border bg-ink-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={`${mode}-${center.lat}-${center.lon}`}
          src={url}
          alt={`${mode === "road" ? t.noise.road : t.noise.rail} ${center.lat.toFixed(4)}, ${center.lon.toFixed(4)}`}
          width={480}
          height={300}
          className="w-full h-auto"
          loading="eager"
        />
      </div>

      <div className="mt-4">
        <div className="text-xs uppercase tracking-wide text-ink-dim mb-2">
          {t.noise.legend}
        </div>
        <div className="flex gap-0.5 rounded-lg overflow-hidden">
          {NOISE_LEGEND.map((l) => (
            <div
              key={l.min}
              className="flex-1 h-3"
              style={{ backgroundColor: l.color }}
              title={l.label}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-ink-dim mt-1">
          <span>{t.noise.quiet}</span>
          <span>{t.noise.mid}</span>
          <span>{t.noise.loud}</span>
          <span>{t.noise.veryLoud}</span>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-ink-bg border border-ink-border p-3">
        <div className="grid grid-cols-2 gap-2 text-xs text-ink-mute">
          <div>🟢 {t.noise.greenQuiet}</div>
          <div>🟡 {t.noise.yellowNormal}</div>
          <div>🟠 {t.noise.orangeLoud}</div>
          <div>🔴 {t.noise.redVeryLoud}</div>
        </div>
      </div>

      <a
        href={`https://map.geo.admin.ch/?lang=de&layers=${layer}&E=${center.lon}&N=${center.lat}&zoom=8`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center text-xs text-lime-accent hover:underline"
      >
        {t.noise.showOnMap}
      </a>
    </Card>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
        active
          ? "bg-lime-accent text-ink-bg border-lime-accent"
          : "bg-ink-bg text-ink-mute border-ink-border hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
