"use client";

import Card, { Pill } from "@/components/ui/Card";
import {
  DEFAULT_NOTICE_MONTHS,
  MAX_DEPOSIT_MONTHS,
  MAX_INITIAL_INCREASE_PCT,
  REFERENCE_RATE,
} from "@/lib/data/laws";

export default function LegalCard({
  rent,
  rooms,
}: {
  rent: number;
  rooms: string;
}) {
  const maxDeposit = rent * MAX_DEPOSIT_MONTHS;

  return (
    <Card
      title="Rechtliche Schnellinfos"
      icon="⚖️"
      className="md:col-span-2"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <LegalItem
          title="Anfangsmiete"
          answer={`Deine Anfangsmiete darf maximal ${MAX_INITIAL_INCREASE_PCT}% über der Vormiete liegen.`}
          detail="Wenn der Vermieter mehr verlangt, kannst du innert 30 Tagen beim Schlichtungsamt anfechten (Art. 270 OR). Verlange das Formular zur Vormiete."
        />
        <LegalItem
          title="Maximale Kaution"
          answer={`${fmt(maxDeposit)} (${MAX_DEPOSIT_MONTHS} Nettomieten)`}
          detail="Art. 257e OR: max. 3 Monatsmieten netto. Die Kaution gehört auf ein auf deinen Namen lautendes Sperrkonto."
        />
        <LegalItem
          title="Kündigungsfrist"
          answer={`${DEFAULT_NOTICE_MONTHS} Monate auf gesetzliche Kündigungstermine.`}
          detail="Meistens Ende März, Juni, September. Kantonale Gebräuche (z.B. Ortsüblichkeit) gelten zusätzlich."
        />
        <LegalItem
          title="Referenzzinssatz"
          answer={`Aktuell: ${REFERENCE_RATE}%`}
          detail={`Wenn der Zinssatz bei deinem Vertragsabschluss höher war, hast du Anspruch auf eine Mietzinssenkung. → Berechne es im Rechner.`}
          pill={<Pill tone="good">Mietzinssenkung möglich?</Pill>}
        />
      </div>
      <div className="mt-5 text-xs text-ink-dim">
        Dies sind Schnell-Infos zu den häufigsten Fragen – keine Rechtsberatung.
        Für konkrete Fälle: Mieterverband (mieterverband.ch).
      </div>
      <div className="mt-1 text-xs text-ink-dim">
        Zimmer berücksichtigt: {rooms} · Netto-Bezug: {fmt(rent)}
      </div>
    </Card>
  );
}

function LegalItem({
  title,
  answer,
  detail,
  pill,
}: {
  title: string;
  answer: string;
  detail: string;
  pill?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-ink-bg border border-ink-border p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="text-sm uppercase tracking-wide text-ink-dim">
          {title}
        </div>
        {pill}
      </div>
      <div className="text-white font-medium">{answer}</div>
      <div className="text-xs text-ink-mute mt-2 leading-relaxed">{detail}</div>
    </div>
  );
}

function fmt(v: number): string {
  return `${new Intl.NumberFormat("de-CH", { maximumFractionDigits: 0 }).format(
    Math.round(v),
  )} CHF`;
}
