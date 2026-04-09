import Link from "next/link";
import AddressSearch from "@/components/AddressSearch";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-20 w-[700px] h-[700px] rounded-full bg-lime-accent/10 blur-3xl" />
          <div className="absolute -bottom-40 right-0 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 pt-20 pb-28 sm:pt-32 sm:pb-40 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink-elev border border-ink-border text-xs text-ink-mute mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-accent" />
            Gratis · Ohne Login · Open Data
          </div>
          <h1 className="font-serif text-5xl sm:text-7xl tracking-tight leading-[1.05] text-white">
            Alles was du über <br />
            <span className="text-lime-accent">deine Wohnung</span> wissen musst
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-ink-mute max-w-2xl mx-auto">
            Mietpreis, Umgebung, ÖV, Lärm, Steuern und deine Rechte —
            eine Adresse reicht.
          </p>

          <div className="mt-10 max-w-3xl mx-auto text-left">
            <AddressSearch />
            <p className="mt-3 text-xs text-ink-dim text-center">
              Alles passiert im Browser. Wir speichern nichts.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Tool explainer */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="text-sm uppercase tracking-[0.2em] text-lime-accent mb-2">
            Was du bekommst
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl">Vier Tools, eine Adresse</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ToolCard
            num="01"
            title="Mietpreis-Check"
            text="Vergleich gegen BFS-Mediane aller 26 Kantone. Fair oder überteuert?"
          />
          <ToolCard
            num="02"
            title="Umgebungs-Analyse"
            text="POIs, ÖV-Anschluss, Schulen, Ärzte – alles auf einer Karte."
          />
          <ToolCard
            num="03"
            title="Lärm & Steuern"
            text="Strassen- und Bahnlärm in dB, Gemeindesteuerfuss, Leerstandsquote."
          />
          <ToolCard
            num="04"
            title="Rechtliche Checks"
            text="Anfangsmiete, Kaution, Kündigung, Referenzzinssatz — konkret."
          />
        </div>
      </section>

      {/* Compare vs Homegate */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="text-sm uppercase tracking-[0.2em] text-lime-accent mb-2">
            Warum FairMiete?
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl">Gratis, was andere für 40 CHF/Monat verlangen</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-ink-elev border border-ink-border p-8">
            <div className="text-sm uppercase tracking-wider text-ink-dim mb-1">Andere Anbieter</div>
            <div className="font-serif text-3xl mb-6">CHF 40 / Monat</div>
            <ul className="space-y-3 text-ink-mute">
              <Row ok={false}>Nur Inserate, keine Bewertung</Row>
              <Row ok={false}>Login, Abo, Kleingedrucktes</Row>
              <Row ok={false}>Vermieter als Kunden</Row>
              <Row ok={false}>Keine Umgebungsdaten</Row>
              <Row ok={false}>Keine Rechtshinweise</Row>
            </ul>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-lime-accent/15 to-lime-accent/5 border border-lime-accent/40 p-8">
            <div className="text-sm uppercase tracking-wider text-lime-accent mb-1">FairMiete.ch</div>
            <div className="font-serif text-3xl mb-6 text-white">Gratis. Immer.</div>
            <ul className="space-y-3 text-white/90">
              <Row ok>Direkte Bewertung: fair oder nicht</Row>
              <Row ok>Kein Login, keine Cookies</Row>
              <Row ok>Unabhängig und neutral</Row>
              <Row ok>Karte, Lärm, ÖV, Steuern</Row>
              <Row ok>Konkrete Rechtstipps</Row>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="rounded-3xl bg-ink-elev border border-ink-border p-10 sm:p-14 text-center">
          <h2 className="font-serif text-3xl sm:text-5xl text-white">
            Bereit? Eine Adresse reicht.
          </h2>
          <p className="mt-4 text-ink-mute max-w-xl mx-auto">
            Keine Registrierung. Keine E-Mail. Kein Abo. Einfach Adresse eingeben und loslegen.
          </p>
          <Link
            href="/analyse"
            className="mt-8 inline-flex items-center px-6 py-3 rounded-xl bg-lime-accent text-ink-bg font-semibold hover:bg-lime-dark transition"
          >
            Jetzt Analyse starten →
          </Link>
        </div>
      </section>
    </div>
  );
}

function ToolCard({ num, title, text }: { num: string; title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-ink-elev border border-ink-border p-6 hover:border-lime-accent/40 transition">
      <div className="text-xs font-mono text-lime-accent mb-3">{num}</div>
      <div className="font-serif text-xl mb-2">{title}</div>
      <p className="text-ink-mute text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function Row({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={`mt-0.5 inline-flex w-5 h-5 rounded-full items-center justify-center text-[11px] font-bold shrink-0 ${
          ok ? "bg-lime-accent text-ink-bg" : "bg-ink-border text-ink-dim"
        }`}
      >
        {ok ? "✓" : "×"}
      </span>
      <span>{children}</span>
    </li>
  );
}
