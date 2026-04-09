import Link from "next/link";
import { CANTONS } from "@/lib/data/cantons";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold">Über check</h1>
      <p className="text-neutral-600 mt-3 text-lg">
        check hilft dir, faire Mietpreise in der Schweiz zu erkennen – in allen{" "}
        {CANTONS.length} Kantonen.
      </p>

      <section className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold">Woher kommen die Daten?</h2>
        <p className="text-neutral-700">
          Die Medianmieten basieren auf der Strukturerhebung des{" "}
          <span className="font-medium">Bundesamts für Statistik (BFS)</span>.
          Diese Daten sind öffentlich zugänglich auf{" "}
          <span className="font-medium">opendata.swiss</span> und werden jährlich
          aktualisiert. Im Gegensatz zu Immobilienportalen zeigen sie nicht nur die
          aktuell angebotenen Wohnungen, sondern den tatsächlichen Mietbestand.
        </p>
        <p className="text-neutral-700">
          In diesem MVP arbeiten wir mit approximierten Medianwerten pro Kanton und
          Zimmerzahl. Für eine produktive Version werden die offiziellen CSV-Files
          direkt eingebunden.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold">Wie wird der faire Preis berechnet?</h2>
        <ol className="list-decimal list-inside space-y-2 text-neutral-700">
          <li>Wir nehmen den Kantons-Median für die entsprechende Zimmerzahl.</li>
          <li>Modifikatoren für Lärm, Stockwerk und Zustand werden angewendet.</li>
          <li>
            Daraus entsteht ein Erwartungswert mit einer Spanne von ±8% (fair).
          </li>
          <li>Dein Preis wird gegen diese Spanne verglichen und eingeordnet.</li>
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Abdeckung: alle Kantone</h2>
        <div className="flex flex-wrap gap-2">
          {CANTONS.map((c) => (
            <span
              key={c.code}
              className="inline-flex items-center px-3 py-1.5 rounded-full bg-white ring-1 ring-neutral-200 text-sm text-neutral-700"
            >
              <span className="font-semibold text-brand-600 mr-1.5">{c.code}</span>
              {c.name}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Was check nicht ist</h2>
        <ul className="space-y-2 text-neutral-700">
          <li>• Keine Rechtsberatung. Für verbindliche Auskünfte: Mieterverband.</li>
          <li>• Keine Garantie, dass du den Preis erfolgreich anfechten kannst.</li>
          <li>• Kein Immobilienportal – wir vermieten keine Wohnungen.</li>
        </ul>
      </section>

      <div className="mt-12 rounded-2xl bg-gradient-to-br from-brand-50 to-emerald-50 ring-1 ring-brand-200 p-8 text-center">
        <h2 className="text-2xl font-bold">Bereit, zu prüfen?</h2>
        <p className="text-neutral-700 mt-2">
          In 30 Sekunden weisst du, ob deine Miete fair ist.
        </p>
        <Link
          href="/checker"
          className="mt-5 inline-flex items-center px-6 py-3 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700"
        >
          Jetzt prüfen →
        </Link>
      </div>
    </div>
  );
}
