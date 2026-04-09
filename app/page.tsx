import Link from "next/link";
import { CANTONS } from "@/lib/data/cantons";

export default function HomePage() {
  const cantonCount = CANTONS.length;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-emerald-50 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white ring-1 ring-neutral-200 text-xs text-neutral-600 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Basierend auf offiziellen BFS-Daten 2023
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-neutral-900">
              Zahlst du <span className="text-brand-600">zu viel Miete</span>?
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-neutral-600 max-w-2xl">
              Prüfe in 30 Sekunden, ob deine Wohnung marktgerecht bepreist ist –
              für alle {cantonCount} Kantone der Schweiz. Kostenlos, ohne Anmeldung.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/checker"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 shadow-sm"
              >
                Jetzt Mietpreis prüfen →
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-white ring-1 ring-neutral-200 text-neutral-700 font-medium hover:bg-neutral-50"
              >
                So funktioniert&apos;s
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              <Stat number={cantonCount.toString()} label="Kantone" />
              <Stat number="30s" label="Dauer" />
              <Stat number="0 CHF" label="Kosten" />
            </div>
          </div>
        </div>
      </section>

      {/* Compare vs Homegate */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-2">Warum check?</h2>
        <p className="text-center text-neutral-600 mb-12">
          Anders als klassische Immoportale zeigen wir dir nicht nur Angebote –
          wir sagen dir, ob sie fair sind.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white ring-1 ring-neutral-200 p-6">
            <div className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
              Homegate, ImmoScout & Co.
            </div>
            <ul className="space-y-3 text-neutral-700">
              <CompareRow ok={false}>Listen von Inseraten – ohne Bewertung</CompareRow>
              <CompareRow ok={false}>Keine Einordnung, ob der Preis fair ist</CompareRow>
              <CompareRow ok={false}>Vermieter zahlen fürs Inserieren</CompareRow>
              <CompareRow ok={false}>Keine Hinweise auf Anfechtungsrecht</CompareRow>
            </ul>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-emerald-50 ring-1 ring-brand-200 p-6">
            <div className="text-sm font-semibold text-brand-700 uppercase tracking-wide mb-4">
              check
            </div>
            <ul className="space-y-3 text-neutral-800">
              <CompareRow ok>Klare Ampel: fair, teuer, überteuert</CompareRow>
              <CompareRow ok>Basiert auf BFS-Medianen, nicht auf Inseraten</CompareRow>
              <CompareRow ok>100% neutral – wir sind kein Vermieter-Portal</CompareRow>
              <CompareRow ok>Konkrete Tipps zur Mietpreisanfechtung</CompareRow>
            </ul>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-3 gap-6">
          <Feature
            icon="📊"
            title="Offizielle Daten"
            text="Medianmieten für alle 26 Kantone, basierend auf BFS Strukturerhebung."
          />
          <Feature
            icon="⚖️"
            title="Klare Einordnung"
            text="Grün, gelb oder rot – du weisst sofort, ob der Preis in Ordnung ist."
          />
          <Feature
            icon="🔔"
            title="Preis-Alerts"
            text="Lass dich benachrichtigen, wenn Wohnungen unter deinem Wunschpreis auftauchen."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="rounded-3xl bg-neutral-900 text-white p-10 sm:p-14 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Bereit, deinen Mietvertrag zu prüfen?
          </h2>
          <p className="text-neutral-300 max-w-xl mx-auto mb-8">
            Nimm deinen Mietvertrag oder ein Inserat und finde in 30 Sekunden heraus,
            ob der Preis fair ist.
          </p>
          <Link
            href="/checker"
            className="inline-flex items-center px-8 py-3 rounded-lg bg-white text-neutral-900 font-semibold hover:bg-neutral-100"
          >
            Gratis prüfen →
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-2xl sm:text-3xl font-bold text-neutral-900">{number}</div>
      <div className="text-sm text-neutral-500">{label}</div>
    </div>
  );
}

function CompareRow({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={`mt-0.5 inline-flex w-5 h-5 rounded-full items-center justify-center text-xs font-bold shrink-0 ${
          ok ? "bg-emerald-500 text-white" : "bg-neutral-200 text-neutral-500"
        }`}
      >
        {ok ? "✓" : "×"}
      </span>
      <span>{children}</span>
    </li>
  );
}

function Feature({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-neutral-200 p-6">
      <div className="text-3xl mb-3">{icon}</div>
      <div className="font-semibold text-lg mb-1">{title}</div>
      <p className="text-neutral-600 text-sm">{text}</p>
    </div>
  );
}
