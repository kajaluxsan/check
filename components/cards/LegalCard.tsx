"use client";

import Link from "next/link";
import { Scale } from "lucide-react";
import Card from "@/components/ui/Card";
import { DEFAULT_NOTICE_MONTHS, MAX_DEPOSIT_MONTHS, MAX_INITIAL_INCREASE_PCT, REFERENCE_RATE } from "@/lib/data/laws";

export default function LegalCard({ rent, rooms }: { rent: number; rooms: string }) {
  const maxDeposit = rent * MAX_DEPOSIT_MONTHS;

  return (
    <Card title="Rechtliche Schnellinfos" icon={Scale} className="md:col-span-2">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <LegalItem
          title="Anfangsmiete"
          answer={`Max. +${MAX_INITIAL_INCREASE_PCT}%`}
          detail="Über der Vormiete. Innert 30 Tagen anfechtbar (Art. 270 OR)."
        />
        <LegalItem
          title="Max. Kaution"
          answer={`${fmt(maxDeposit)}`}
          detail={`${MAX_DEPOSIT_MONTHS} Nettomieten auf Sperrkonto (Art. 257e OR).`}
        />
        <LegalItem
          title="Kündigungsfrist"
          answer={`${DEFAULT_NOTICE_MONTHS} Monate`}
          detail="Auf gesetzliche Termine (meist Ende März, Juni, September)."
        />
        <LegalItem
          title="Referenzzinssatz"
          answer={`${REFERENCE_RATE}%`}
          detail="War der Satz bei Vertragsabschluss höher? Du hast Anspruch auf Senkung."
          action={
            <Link href="/rechner" className="inline-flex items-center text-xs text-accent hover:underline mt-2">
              Rechner →
            </Link>
          }
        />
      </div>
      <div className="mt-1 font-mono text-[10px] text-ink-dim">
        Zimmer: {rooms} · Netto: {fmt(rent)}
      </div>
    </Card>
  );
}

function LegalItem({ title, answer, detail, action }: { title: string; answer: string; detail: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-input bg-ink-bg border border-ink-border p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-dim mb-2">{title}</div>
      <div className="font-serif text-xl text-[var(--fg)]">{answer}</div>
      <div className="text-xs text-ink-mute mt-2 leading-relaxed">{detail}</div>
      {action}
    </div>
  );
}

function fmt(v: number): string {
  return `${new Intl.NumberFormat("de-CH", { maximumFractionDigits: 0 }).format(Math.round(v))} CHF`;
}
