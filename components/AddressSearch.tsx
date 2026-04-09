"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const ROOM_OPTIONS = ["1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5", "5.5", "6"];

export default function AddressSearch({
  variant = "hero",
}: {
  variant?: "hero" | "compact";
}) {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [rooms, setRooms] = useState("3.5");
  const [rent, setRent] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (address.trim().length < 4) {
      setError("Bitte gib eine gültige Adresse ein.");
      return;
    }
    const rentNum = Number(rent);
    if (!rentNum || rentNum < 100) {
      setError("Bitte gib deine Nettomiete ein.");
      return;
    }
    const params = new URLSearchParams({
      address: address.trim(),
      rooms,
      rent: String(rentNum),
    });
    router.push(`/analyse?${params.toString()}`);
  }

  const isHero = variant === "hero";

  return (
    <form
      onSubmit={submit}
      className={`${
        isHero ? "rounded-3xl p-4 sm:p-5" : "rounded-2xl p-3"
      } bg-ink-elev border border-ink-border shadow-2xl`}
    >
      <div
        className={`grid gap-3 ${
          isHero ? "sm:grid-cols-[1fr_auto_auto_auto]" : "sm:grid-cols-[1fr_auto_auto_auto]"
        }`}
      >
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-dim">
            📍
          </span>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Strasse, Ort"
            className="w-full pl-9 pr-3 py-3 rounded-xl bg-ink-bg border border-ink-border text-white placeholder:text-ink-dim outline-none focus:border-lime-accent transition"
          />
        </div>
        <select
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
          className="py-3 px-3 rounded-xl bg-ink-bg border border-ink-border text-white outline-none focus:border-lime-accent"
        >
          {ROOM_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r} Zi.
            </option>
          ))}
        </select>
        <div className="relative">
          <input
            type="number"
            inputMode="numeric"
            min={100}
            value={rent}
            onChange={(e) => setRent(e.target.value)}
            placeholder="Nettomiete"
            className="w-full py-3 pl-3 pr-12 rounded-xl bg-ink-bg border border-ink-border text-white placeholder:text-ink-dim outline-none focus:border-lime-accent"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-dim text-sm">
            CHF
          </span>
        </div>
        <button
          type="submit"
          className="py-3 px-5 rounded-xl bg-lime-accent text-ink-bg font-semibold hover:bg-lime-dark transition whitespace-nowrap"
        >
          Analysieren →
        </button>
      </div>
      {error && (
        <div className="mt-3 text-sm text-red-400">{error}</div>
      )}
    </form>
  );
}
