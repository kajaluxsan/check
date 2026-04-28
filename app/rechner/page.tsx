"use client";

import { useMemo, useState } from "react";
import { TrendingDown, Calculator } from "lucide-react";
import Card, { Metric, Pill } from "@/components/ui/Card";
import { useT } from "@/lib/i18n/context";
import { calcAffordability } from "@/lib/calc/affordability";
import { calcReference } from "@/lib/calc/reference";
import { REFERENCE_RATE } from "@/lib/data/laws";

export default function RechnerPage() {
  const { t } = useT();

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 py-12">
      <div className="mb-10">
        <div className="text-xs uppercase tracking-[0.2em] text-lime-accent mb-2">
          {t.rechner.label}
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl">{t.rechner.title}</h1>
        <p className="text-ink-mute mt-3 max-w-2xl">{t.rechner.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        <ReferenceRateTool />
        <AffordabilityTool />
      </div>

      <div className="mt-10 rounded-2xl bg-ink-elev border border-ink-border p-6 text-center">
        <div className="text-sm text-ink-mute">{t.rechner.phase2}</div>
      </div>
    </div>
  );
}

function ReferenceRateTool() {
  const { t } = useT();
  const [rent, setRent] = useState("1800");
  const [contractRate, setContractRate] = useState("3.00");

  const result = useMemo(
    () => calcReference(Number(rent), Number(contractRate)),
    [rent, contractRate],
  );

  return (
    <Card
      title={t.rechner.refTitle}
      icon={TrendingDown}
      source="VMWG Art. 13 \u00b7 BWO"
    >
      <div className="space-y-4 mb-6">
        <FieldInput
          label={t.rechner.refRentLabel}
          value={rent}
          onChange={setRent}
          type="number"
        />
        <FieldInput
          label={t.rechner.refRateLabel}
          value={contractRate}
          onChange={setContractRate}
          type="number"
          step="0.25"
          hint={t.rechner.refCurrentRate(REFERENCE_RATE)}
        />
      </div>

      <div className="rounded-xl bg-ink-bg border border-ink-border p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="text-xs uppercase tracking-wide text-ink-dim">
            {t.rechner.result}
          </div>
          <Pill tone={result.eligible ? "good" : "mid"}>
            {result.eligible ? t.rechner.reductionPossible : t.rechner.noReduction}
          </Pill>
        </div>
        {result.eligible ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Metric label={t.rechner.newRent} value={fmtChf(result.newRent)} tone="good" />
            <Metric label={t.rechner.savingsMonth} value={`-${fmtChf(result.savingsMonthly)}`} tone="good" />
            <Metric label={t.rechner.savingsYear} value={`-${fmtChf(result.savingsYearly)}`} tone="good" />
          </div>
        ) : (
          <div className="text-sm text-ink-mute">{result.note}</div>
        )}
        {result.eligible && (
          <p className="text-xs text-ink-mute mt-4 leading-relaxed">
            {result.note} {t.rechner.refNote}
          </p>
        )}
      </div>
    </Card>
  );
}

function AffordabilityTool() {
  const { t } = useT();
  const [income, setIncome] = useState("6500");
  const [rent, setRent] = useState("2000");

  const result = useMemo(
    () => calcAffordability(Number(income), Number(rent)),
    [income, rent],
  );

  const tone =
    result.verdict === "ok" ? "good" :
    result.verdict === "warn" ? "warn" : "bad";

  return (
    <Card title={t.rechner.affordTitle} icon={Calculator}>
      <div className="space-y-4 mb-6">
        <FieldInput
          label={t.rechner.affordIncomeLabel}
          value={income}
          onChange={setIncome}
          type="number"
        />
        <FieldInput
          label={t.rechner.affordRentLabel}
          value={rent}
          onChange={setRent}
          type="number"
        />
      </div>

      <div className="rounded-xl bg-ink-bg border border-ink-border p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="text-xs uppercase tracking-wide text-ink-dim">
            {t.rechner.result}
          </div>
          <Pill tone={tone}>{result.label}</Pill>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Metric label={t.rechner.budget} value={fmtChf(result.recommended)} sub={t.rechner.budgetSub} />
          <Metric
            label={t.rechner.burdenRate}
            value={`${Math.round(result.burdenPct * 100)}%`}
            tone={tone === "good" ? "good" : tone === "warn" ? "warn" : "bad"}
          />
        </div>
        <div className="mt-4">
          <div className="h-2 rounded-full bg-ink-elev2 overflow-hidden">
            <div
              className={`h-full transition-all ${
                tone === "good"
                  ? "bg-lime-accent"
                  : tone === "warn"
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
              style={{ width: `${Math.min(100, result.burdenPct * 100)}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-ink-dim">
            <span>0%</span>
            <span>{t.rechner.rule}</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  type = "text",
  step,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  step?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-wide text-ink-dim mb-1.5">
        {label}
      </div>
      <input
        type={type}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg bg-ink-bg border border-ink-border text-white outline-none focus:border-lime-accent"
      />
      {hint && <div className="text-xs text-ink-dim mt-1">{hint}</div>}
    </label>
  );
}

function fmtChf(v: number): string {
  return `${new Intl.NumberFormat("de-CH", { maximumFractionDigits: 0 }).format(
    Math.round(v),
  )} CHF`;
}
