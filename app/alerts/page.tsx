"use client";

import { useState } from "react";
import { CANTONS } from "@/lib/data/cantons";

export default function AlertsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [canton, setCanton] = useState("ZH");
  const [maxPrice, setMaxPrice] = useState("2000");
  const [minRooms, setMinRooms] = useState("2.5");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // No backend in the MVP – we only acknowledge on-screen.
    setSubmitted(true);
  }

  const rooms = ["1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5", "5.5", "6"];

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-3xl mb-4">
          ✓
        </div>
        <h1 className="text-3xl font-bold">Alert gespeichert</h1>
        <p className="text-neutral-600 mt-3">
          Sobald eine passende Wohnung in {getCantonName(canton)} unter{" "}
          {formatChf(Number(maxPrice))} auftaucht, schicken wir dir eine E-Mail an{" "}
          <span className="font-medium text-neutral-800">{email}</span>.
        </p>
        <p className="text-xs text-neutral-400 mt-4">
          Hinweis: Dies ist ein MVP-Prototyp. In der finalen Version werden die
          Alerts tatsächlich verschickt.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 inline-flex items-center px-5 py-2.5 rounded-lg bg-white ring-1 ring-neutral-200 text-neutral-700 font-medium hover:bg-neutral-50"
        >
          Weiteren Alert erstellen
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 ring-1 ring-amber-200 text-xs text-amber-700 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Beta-Funktion
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold">Preis-Alerts</h1>
        <p className="text-neutral-600 mt-2 max-w-xl">
          Lass dich benachrichtigen, wenn eine Wohnung unter deinem Wunschpreis
          auf dem Markt erscheint – mit direkter Einschätzung, ob der Preis fair ist.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white ring-1 ring-neutral-200 p-6 sm:p-8 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            E-Mail
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="du@beispiel.ch"
            className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Kanton
            </label>
            <select
              value={canton}
              onChange={(e) => setCanton(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 bg-white outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
            >
              {CANTONS.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Mindestgrösse
            </label>
            <select
              value={minRooms}
              onChange={(e) => setMinRooms(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 bg-white outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
            >
              {rooms.map((r) => (
                <option key={r} value={r}>
                  ab {r} Zimmer
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Maximaler Preis (CHF/Monat)
          </label>
          <input
            type="number"
            min={100}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div className="flex items-start gap-2 text-xs text-neutral-500">
          <span>🔒</span>
          <span>
            Wir verwenden deine E-Mail nur für diesen Alert. Kein Newsletter,
            keine Weitergabe an Dritte.
          </span>
        </div>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center px-6 py-3 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700"
        >
          Alert aktivieren
        </button>
      </form>
    </div>
  );
}

function getCantonName(code: string): string {
  return CANTONS.find((c) => c.code === code)?.name ?? code;
}

function formatChf(value: number): string {
  return `${new Intl.NumberFormat("de-CH").format(value)} CHF`;
}
