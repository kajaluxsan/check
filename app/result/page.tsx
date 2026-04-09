import Link from "next/link";
import { calculate } from "@/lib/calculate";
import { VERDICT_STYLE } from "@/lib/modifiers";
import type { CheckInput, Condition, Floor, Noise, RoomKey } from "@/lib/types";

interface ResultPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function ResultPage({ searchParams }: ResultPageProps) {
  const params = normalize(searchParams);
  if (!params) return <InvalidResult />;

  const result = calculate(params);
  if (!result) return <InvalidResult />;

  const style = VERDICT_STYLE[result.verdict];

  // Compute the position of the actual price on a scale from
  // expectedLow * 0.7 to expectedHigh * 1.4 (so that scams are still visible).
  const scaleMin = result.expectedLow * 0.7;
  const scaleMax = result.expectedHigh * 1.4;
  const percent = (val: number) =>
    Math.min(100, Math.max(0, ((val - scaleMin) / (scaleMax - scaleMin)) * 100));

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-brand-600 font-medium">Schritt 2 von 2</div>
        <Link
          href="/checker"
          className="text-sm text-neutral-500 hover:text-neutral-700"
        >
          ← Neue Prüfung
        </Link>
      </div>

      {/* Verdict card */}
      <div className={`rounded-3xl ${style.bg} ring-1 ${style.ring} p-8 sm:p-10`}>
        <div className={`text-sm font-semibold uppercase tracking-wide ${style.text}`}>
          Ergebnis
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold mt-2 text-neutral-900">
          {result.headline}
        </h1>
        <p className="mt-4 text-neutral-700 max-w-2xl">{result.summary}</p>

        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          <MetricCard
            label="Deine Miete"
            value={formatChf(result.actual)}
            sub="pro Monat"
          />
          <MetricCard
            label="Erwarteter Preis"
            value={formatChf(result.expected)}
            sub={`${formatChf(result.expectedLow)} – ${formatChf(result.expectedHigh)}`}
          />
          <MetricCard
            label={result.diff >= 0 ? "Zu viel" : "Ersparnis"}
            value={(result.diff >= 0 ? "+" : "") + formatChf(result.diff)}
            sub={`${result.diff >= 0 ? "+" : ""}${Math.round(result.diffPct * 100)}%`}
            accent={result.diff >= 0 ? "text-red-600" : "text-emerald-600"}
          />
        </div>
      </div>

      {/* Scale visualization */}
      <div className="mt-10 rounded-2xl bg-white ring-1 ring-neutral-200 p-6 sm:p-8">
        <div className="font-semibold mb-4">Preis im Vergleich</div>
        <div className="relative h-16">
          {/* gradient bar */}
          <div className="absolute inset-x-0 top-6 h-3 rounded-full bg-gradient-to-r from-emerald-400 via-green-400 via-40% via-amber-400 via-60% to-red-500" />
          {/* expected range overlay */}
          <div
            className="absolute top-4 h-7 rounded-lg ring-2 ring-neutral-900/20 bg-white/40"
            style={{
              left: `${percent(result.expectedLow)}%`,
              width: `${percent(result.expectedHigh) - percent(result.expectedLow)}%`,
            }}
          />
          {/* expected marker */}
          <div
            className="absolute top-0 -translate-x-1/2"
            style={{ left: `${percent(result.expected)}%` }}
          >
            <div className="text-[10px] text-neutral-500 whitespace-nowrap">fair</div>
            <div className="w-px h-10 bg-neutral-400 mx-auto" />
          </div>
          {/* actual marker */}
          <div
            className="absolute top-0 -translate-x-1/2"
            style={{ left: `${percent(result.actual)}%` }}
          >
            <div className={`text-xs font-semibold whitespace-nowrap ${style.text}`}>
              du
            </div>
            <div className={`w-3 h-3 rounded-full mx-auto mt-1 ring-2 ring-white ${style.accent}`} />
          </div>
        </div>
        <div className="flex justify-between text-xs text-neutral-400 mt-2">
          <span>{formatChf(Math.round(scaleMin))}</span>
          <span>{formatChf(Math.round(scaleMax))}</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white ring-1 ring-neutral-200 p-6">
          <div className="font-semibold mb-4">So kommt der Referenzpreis zustande</div>
          <div className="space-y-2 text-sm">
            <Row
              label={`Median ${result.canton.name} (${params.rooms} Zi.)`}
              value={formatChf(Math.round(result.expected / (1 + sumMods(result.modifiers))))}
            />
            {result.modifiers.map((m) => (
              <Row
                key={m.label}
                label={m.label}
                value={`${m.value >= 0 ? "+" : ""}${Math.round(m.value * 100)}%`}
                muted={m.value === 0}
              />
            ))}
            <div className="border-t border-neutral-200 my-2" />
            <Row label="Erwarteter Preis" value={formatChf(result.expected)} bold />
            {result.pricePerSqm > 0 && (
              <Row
                label="Deine Miete pro m²"
                value={`${result.pricePerSqm.toFixed(1)} CHF`}
                muted
              />
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white ring-1 ring-neutral-200 p-6">
          <div className="font-semibold mb-4">Was du jetzt tun kannst</div>
          <ul className="space-y-3">
            {result.advice.map((a, i) => (
              <li key={i} className="flex gap-3 text-sm text-neutral-700">
                <span className="shrink-0 inline-flex w-5 h-5 rounded-full bg-brand-100 text-brand-700 items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <p className="text-xs text-neutral-500 max-w-md">
          Diese Berechnung dient nur der Orientierung und ersetzt keine Rechtsberatung.
          Bei konkreten Fragen wende dich an den Mieterverband.
        </p>
        <div className="flex gap-2">
          <Link
            href="/checker"
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-white ring-1 ring-neutral-200 text-neutral-700 font-medium hover:bg-neutral-50"
          >
            Nochmal prüfen
          </Link>
          <Link
            href="/alerts"
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700"
          >
            Preis-Alert erstellen →
          </Link>
        </div>
      </div>
    </div>
  );
}

function normalize(
  q: Record<string, string | string[] | undefined>,
): CheckInput | null {
  const str = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;
  const canton = str(q.canton);
  const rooms = str(q.rooms) as RoomKey | undefined;
  const size = Number(str(q.size));
  const price = Number(str(q.price));
  const noise = str(q.noise) as Noise | undefined;
  const floor = str(q.floor) as Floor | undefined;
  const condition = str(q.condition) as Condition | undefined;

  if (!canton || !rooms || !price || !noise || !floor || !condition) return null;
  if (Number.isNaN(size) || Number.isNaN(price)) return null;

  return { canton, rooms, size, price, noise, floor, condition };
}

function sumMods(mods: { value: number }[]): number {
  return mods.reduce((sum, m) => sum + m.value, 0);
}

function formatChf(value: number): string {
  const formatted = new Intl.NumberFormat("de-CH", {
    maximumFractionDigits: 0,
  }).format(Math.abs(value));
  return `${value < 0 ? "-" : ""}${formatted} CHF`;
}

function MetricCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl bg-white/70 ring-1 ring-white p-4">
      <div className="text-xs text-neutral-600 uppercase tracking-wide">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${accent ?? "text-neutral-900"}`}>
        {value}
      </div>
      {sub && <div className="text-xs text-neutral-500 mt-0.5">{sub}</div>}
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  muted,
}: {
  label: string;
  value: string;
  bold?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between ${
        bold ? "font-semibold text-neutral-900" : muted ? "text-neutral-500" : "text-neutral-700"
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function InvalidResult() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Ergebnis nicht verfügbar</h1>
      <p className="text-neutral-600 mt-2">
        Die Parameter sind unvollständig. Bitte fülle das Formular erneut aus.
      </p>
      <Link
        href="/checker"
        className="mt-6 inline-flex items-center px-5 py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700"
      >
        Zum Checker →
      </Link>
    </div>
  );
}
