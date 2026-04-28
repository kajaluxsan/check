"use client";

import Link from "next/link";
import { Scale } from "lucide-react";
import Card, { Pill } from "@/components/ui/Card";
import { useT } from "@/lib/i18n/context";
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
  const { t } = useT();
  const maxDeposit = rent * MAX_DEPOSIT_MONTHS;

  return (
    <Card
      title={t.legal.title}
      icon={Scale}
      className="md:col-span-2 xl:col-span-3"
    >
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <LegalItem
          title={t.legal.initialRent}
          answer={t.legal.initialRentAnswer(MAX_INITIAL_INCREASE_PCT)}
          detail={t.legal.initialRentDetail}
        />
        <LegalItem
          title={t.legal.maxDeposit}
          answer={t.legal.maxDepositAnswer(fmt(maxDeposit), MAX_DEPOSIT_MONTHS)}
          detail={t.legal.maxDepositDetail}
        />
        <LegalItem
          title={t.legal.noticePeriod}
          answer={t.legal.noticePeriodAnswer(DEFAULT_NOTICE_MONTHS)}
          detail={t.legal.noticePeriodDetail}
        />
        <LegalItem
          title={t.legal.referenceRate}
          answer={t.legal.referenceRateAnswer(REFERENCE_RATE)}
          detail={t.legal.referenceRateDetail}
          pill={<Link href="/rechner"><Pill tone="good">{t.legal.reductionPossible}</Pill></Link>}
        />
      </div>
      <div className="mt-5 text-xs text-ink-dim">
        {t.legal.disclaimer}
      </div>
      <div className="mt-1 text-xs text-ink-dim">
        {t.legal.roomsRef(rooms, fmt(rent))}
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
