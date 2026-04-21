import Link from "next/link";
import { CANTONS } from "@/lib/data/cantons";

export default function UeberPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="text-xs uppercase tracking-[0.2em] text-lime-accent mb-2">
          Über uns
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl">
          Gratis, unabhängig, aus Open Data gebaut.
        </h1>
        <p className="text-ink-mute mt-4 max-w-2xl text-lg">
          checkmiete.ch kombiniert öffentliche Datenquellen zu einem Dashboard,
          das dir hilft, deine Wohnung einzuschätzen — und deine Rechte zu kennen.
        </p>
      </div>

      <section className="grid md:grid-cols-2 gap-4 mb-12">
        <SourceCard
          icon="📊"
          name="BFS — Bundesamt für Statistik"
          description="Mietpreise pro Kanton aus der Strukturerhebung. Öffentlich auf opendata.swiss."
        />
        <SourceCard
          icon="🗺️"
          name="OpenStreetMap / Overpass"
          description="Karte, POIs, Läden, Schulen, Ärzte — alles aus der gemeinschaftlich gepflegten Weltkarte."
        />
        <SourceCard
          icon="🚆"
          name="transport.opendata.ch"
          description="ÖV-Verbindungen und Haltestellen basierend auf SBB-Fahrplandaten."
        />
        <SourceCard
          icon="🔊"
          name="geo.admin.ch / BAFU"
          description="Lärmwerte für Strasse und Bahn aus den offiziellen Lärmkartierungen."
        />
        <SourceCard
          icon="🏛️"
          name="ESTV / BFS"
          description="Steuerbelastung, Einwohnerzahlen und Leerstandsquote pro Kanton."
        />
        <SourceCard
          icon="📜"
          name="BWO / OR"
          description="Referenzzinssatz und mietrechtliche Grundlagen — jeweils aktuell gehalten."
        />
      </section>

      <section className="mb-12">
        <h2 className="font-serif text-2xl mb-4">Abdeckung: alle 26 Kantone</h2>
        <div className="flex flex-wrap gap-2">
          {CANTONS.map((c) => (
            <span
              key={c.code}
              className="inline-flex items-center px-3 py-1.5 rounded-full bg-ink-elev border border-ink-border text-sm"
            >
              <span className="font-mono text-lime-accent mr-2">{c.code}</span>
              <span className="text-ink-mute">{c.name}</span>
            </span>
          ))}
        </div>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="font-serif text-2xl">Was checkmiete nicht ist</h2>
        <ul className="space-y-2 text-ink-mute">
          <li>• Keine Rechtsberatung. Für verbindliche Auskünfte: Mieterverband.</li>
          <li>• Kein Immobilienportal — wir vermieten keine Wohnungen.</li>
          <li>• Keine Garantie, dass du den Preis erfolgreich anfechten kannst.</li>
          <li>• Kein Ersatz für eine Besichtigung vor Ort.</li>
        </ul>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="font-serif text-2xl">Phase 1 vs. Phase 2</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-ink-elev border border-ink-border p-5">
            <div className="text-xs uppercase tracking-wide text-lime-accent mb-2">
              Jetzt live
            </div>
            <ul className="space-y-1 text-sm text-ink-mute">
              <li>· Landing Page</li>
              <li>· Adress-Analyse mit 6 Karten</li>
              <li>· Referenzzinssatz-Rechner</li>
              <li>· Tragbarkeits-Rechner</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-ink-elev border border-ink-border p-5">
            <div className="text-xs uppercase tracking-wide text-ink-dim mb-2">
              Folgt
            </div>
            <ul className="space-y-1 text-sm text-ink-mute">
              <li>· Nebenkosten-Check</li>
              <li>· Kündigungsfrist-Rechner</li>
              <li>· Mietrecht-Ratgeber</li>
              <li>· Französisch / Italienisch</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="rounded-3xl bg-gradient-to-br from-lime-accent/15 to-lime-accent/5 border border-lime-accent/40 p-10 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl text-white">
          Probier&apos;s aus.
        </h2>
        <p className="mt-3 text-ink-mute">Eine Adresse reicht — 30 Sekunden.</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center px-6 py-3 rounded-xl bg-lime-accent text-ink-bg font-semibold hover:bg-lime-dark"
        >
          Zur Analyse →
        </Link>
      </div>
    </div>
  );
}

function SourceCard({
  icon,
  name,
  description,
}: {
  icon: string;
  name: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-ink-elev border border-ink-border p-5">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-semibold text-white mb-1">{name}</div>
      <div className="text-sm text-ink-mute">{description}</div>
    </div>
  );
}
