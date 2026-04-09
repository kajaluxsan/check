"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CANTONS } from "@/lib/data/cantons";
import {
  CONDITION_OPTIONS,
  FLOOR_OPTIONS,
  NOISE_OPTIONS,
} from "@/lib/modifiers";
import type { Condition, Floor, Noise, RoomKey } from "@/lib/types";

const ROOM_OPTIONS: RoomKey[] = [
  "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5", "5.5", "6",
];

export default function CheckerPage() {
  const router = useRouter();
  const [canton, setCanton] = useState("ZH");
  const [rooms, setRooms] = useState<RoomKey>("3.5");
  const [size, setSize] = useState("80");
  const [price, setPrice] = useState("");
  const [noise, setNoise] = useState<Noise>("normal");
  const [floor, setFloor] = useState<Floor>("low");
  const [condition, setCondition] = useState<Condition>("good");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const priceNum = Number(price);
    const sizeNum = Number(size);
    if (!priceNum || priceNum < 100) {
      setError("Bitte gib einen gültigen Mietpreis ein.");
      return;
    }
    if (!sizeNum || sizeNum < 10) {
      setError("Bitte gib eine gültige Wohnfläche ein.");
      return;
    }
    const params = new URLSearchParams({
      canton,
      rooms,
      size: String(sizeNum),
      price: String(priceNum),
      noise,
      floor,
      condition,
    });
    router.push(`/result?${params.toString()}`);
  }

  // Group cantons by region for a nicer dropdown
  const grouped = CANTONS.reduce<Record<string, typeof CANTONS>>((acc, c) => {
    (acc[c.region] ||= []).push(c);
    return acc;
  }, {});

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16">
      <div className="mb-10">
        <div className="text-sm text-brand-600 font-medium mb-2">Schritt 1 von 2</div>
        <h1 className="text-3xl sm:text-4xl font-bold">Wohnung prüfen</h1>
        <p className="text-neutral-600 mt-2">
          Gib ein paar Angaben zur Wohnung ein. Alles bleibt lokal in deinem Browser.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Location */}
        <Section title="Standort" subtitle="In welchem Kanton liegt die Wohnung?">
          <Field label="Kanton">
            <select
              value={canton}
              onChange={(e) => setCanton(e.target.value)}
              className="select"
            >
              {Object.entries(grouped).map(([region, list]) => (
                <optgroup key={region} label={region}>
                  {list.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </Field>
        </Section>

        {/* Size */}
        <Section title="Grösse" subtitle="Wie gross ist die Wohnung?">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Zimmer">
              <select
                value={rooms}
                onChange={(e) => setRooms(e.target.value as RoomKey)}
                className="select"
              >
                {ROOM_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r} Zimmer
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Wohnfläche (m²)">
              <input
                type="number"
                inputMode="numeric"
                min={10}
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="input"
                placeholder="80"
              />
            </Field>
          </div>
        </Section>

        {/* Price */}
        <Section title="Mietpreis" subtitle="Wie hoch ist die aktuelle Bruttomiete (inkl. Nebenkosten)?">
          <Field label="Monatsmiete (CHF)">
            <input
              type="number"
              inputMode="numeric"
              min={100}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input"
              placeholder="z.B. 2200"
              required
            />
          </Field>
        </Section>

        {/* Qualities */}
        <Section title="Eigenschaften" subtitle="Diese Faktoren beeinflussen den fairen Preis.">
          <div className="space-y-5">
            <RadioGroup
              label="Lärmbelastung"
              name="noise"
              value={noise}
              onChange={(v) => setNoise(v as Noise)}
              options={NOISE_OPTIONS}
            />
            <RadioGroup
              label="Stockwerk"
              name="floor"
              value={floor}
              onChange={(v) => setFloor(v as Floor)}
              options={FLOOR_OPTIONS}
            />
            <RadioGroup
              label="Zustand"
              name="condition"
              value={condition}
              onChange={(v) => setCondition(v as Condition)}
              options={CONDITION_OPTIONS}
            />
          </div>
        </Section>

        {error && (
          <div className="rounded-lg bg-red-50 text-red-700 p-4 text-sm ring-1 ring-red-200">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-neutral-500">
            Keine Registrierung. Keine Cookies. Nichts wird gespeichert.
          </p>
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700"
          >
            Ergebnis ansehen →
          </button>
        </div>
      </form>

      <style jsx>{`
        .input,
        .select {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.5rem;
          border: 1px solid #e5e5e5;
          background: white;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .input:focus,
        .select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }
      `}</style>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-neutral-200 p-6">
      <div className="mb-4">
        <div className="font-semibold text-lg">{title}</div>
        {subtitle && <div className="text-sm text-neutral-500">{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-neutral-700 mb-1.5">{label}</div>
      {children}
    </label>
  );
}

function RadioGroup<T extends string>({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div>
      <div className="text-sm font-medium text-neutral-700 mb-2">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={
                "px-3.5 py-2 rounded-full text-sm font-medium border transition " +
                (selected
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300")
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
