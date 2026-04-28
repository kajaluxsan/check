"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useT } from "@/lib/i18n/context";

const ROOM_OPTIONS = ["1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5", "5.5", "6"];

export default function AddressSearch({
  variant = "hero",
}: {
  variant?: "hero" | "compact";
}) {
  const { t } = useT();
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [rooms, setRooms] = useState("3.5");
  const [rent, setRent] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (address.trim().length < 4) {
      setError(t.search.errorAddress);
      return;
    }
    const rentNum = Number(rent);
    if (!rentNum || rentNum < 100) {
      setError(t.search.errorRent);
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
        isHero ? "rounded-[20px] p-4 sm:p-5" : "rounded-card p-3"
      } bg-ink-elev border border-ink-border shadow-card`}
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={t.search.addressPlaceholder}
          className="w-full px-3 py-3.5 rounded-input bg-ink-bg border border-ink-border text-[var(--fg)] placeholder:text-ink-dim outline-none focus:border-accent transition"
        />

        <select
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
          className="py-3.5 px-3 rounded-input bg-ink-bg border border-ink-border text-[var(--fg)] outline-none focus:border-accent"
        >
          {ROOM_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r} {t.search.rooms}
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
            placeholder={t.search.rentPlaceholder}
            className="w-full py-3.5 pl-3 pr-14 rounded-input bg-ink-bg border border-ink-border text-[var(--fg)] placeholder:text-ink-dim outline-none focus:border-accent font-mono"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-dim text-sm font-mono">
            {t.common.chf}
          </span>
        </div>
        <button
          type="submit"
          className="py-3.5 px-5 rounded-input bg-accent text-white font-semibold hover:bg-accent-hover transition whitespace-nowrap"
        >
          {t.search.submit}
        </button>
      </div>
      {error && (
        <div className="mt-3 text-sm text-status-bad">{error}</div>
      )}
    </form>
  );
}
