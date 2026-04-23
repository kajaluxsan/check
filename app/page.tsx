import Link from "next/link";
import { Check, X } from "lucide-react";
import AddressSearch from "@/components/AddressSearch";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-20 w-[700px] h-[700px] rounded-full bg-accent-soft blur-3xl" />
          <div className="absolute -bottom-40 right-0 w-[500px] h-[500px] rounded-full bg-accent-soft blur-3xl opacity-50" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 pt-20 pb-28 sm:pt-32 sm:pb-40 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-ink-elev border border-ink-border text-xs text-ink-mute mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Gratis · Ohne Login · Open Data
          </div>
          <h1 className="font-serif text-5xl sm:text-7xl tracking-tight leading-[1.05]">
            Alles was du über <br />
            <span className="text-accent italic">deine Wohnung</span> wissen musst
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-ink-mute max-w-2xl mx-auto">
            Mietpreis, Umgebung, ÖV, Lärm, Steuern und deine Rechte —
            <span className="italic"> in Sekunden.</span>
          </p>

          <div className="mt-10 max-w-3xl mx-auto text-left">
            <AddressSearch />
            <p className="mt-3 text-xs text-ink-dim text-center">
              Alles passiert im Browser. Wir speichern nichts.
            </p>
          </div>

          {/* Trust strip */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-mono uppercase tracking-[0.15em] text-ink-dim">
            <span>BFS</span>
            <span className="w-px h-3 bg-ink-border" />
            <span>OpenStreetMap</span>
            <span className="w-px h-3 bg-ink-border" />
            <span>geo.admin.ch</span>
            <span className="w-px h-3 bg-ink-border" />
            <span>BWO</span>
          </div>
        </div>
      </section>

      {/* 4 Tool explainer */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-2">
            Was du bekommst
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl">Vier Tools, eine Adresse</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ToolCard num="01" title="Mietpreis-Check" text="Vergleich gegen BFS-Mediane aller 26 Kantone. Fair oder überteuert?" />
          <ToolCard num="02" title="Umgebungs-Analyse" text="POIs, ÖV-Anschluss, Schulen, Ärzte – alles auf einer Karte." />
          <ToolCard num="03" title="Lärm & Steuern" text="Strassen- und Bahnlärm, Gemeindesteuerfuss, Leerstandsquote." />
          <ToolCard num="04" title="Rechtliche Checks" text="Anfangsmiete, Kaution, Kündigung, Referenzzinssatz — konkret." />
        </div>
      </section>

      {/* Compare */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-2">
            Warum checkmiete?
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl">Gratis, was andere für <span className="font-mono">40 CHF</span>/Monat verlangen</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-card bg-ink-elev border border-ink-border p-8">
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-ink-dim mb-1">Andere Anbieter</div>
            <div className="font-serif text-4xl mb-6">
              <span className="font-mono">CHF 40</span> / Monat
            </div>
            <ul className="space-y-3 text-ink-mute">
              <CompareRow ok={false}>Nur Inserate, keine Bewertung</CompareRow>
              <CompareRow ok={false}>Login, Abo, Kleingedrucktes</CompareRow>
              <CompareRow ok={false}>Vermieter als Kunden</CompareRow>
              <CompareRow ok={false}>Keine Umgebungsdaten</CompareRow>
              <CompareRow ok={false}>Keine Rechtshinweise</CompareRow>
            </ul>
          </div>
          <div className="rounded-card bg-accent-soft border border-accent-border p-8">
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-accent mb-1">checkmiete.ch</div>
            <div className="font-serif text-4xl mb-6">Gratis. Immer.</div>
            <ul className="space-y-3">
              <CompareRow ok>Direkte Bewertung: fair oder nicht</CompareRow>
              <CompareRow ok>Kein Login, keine Cookies</CompareRow>
              <CompareRow ok>Unabhängig und neutral</CompareRow>
              <CompareRow ok>Karte, Lärm, ÖV, Steuern</CompareRow>
              <CompareRow ok>Konkrete Rechtstipps</CompareRow>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="rounded-[24px] bg-ink-elev border border-ink-border p-10 sm:p-14 text-center shadow-card">
          <h2 className="font-serif text-3xl sm:text-5xl">
            Bereit? Eine Adresse reicht.
          </h2>
          <p className="mt-4 text-ink-mute max-w-xl mx-auto">
            Keine Registrierung. Keine E-Mail. Kein Abo. Einfach Adresse eingeben und loslegen.
          </p>
          <Link
            href="/analyse"
            className="mt-8 inline-flex items-center px-6 py-3 rounded-input bg-accent text-white font-semibold hover:bg-accent-hover transition"
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
    <div className="rounded-card bg-ink-elev border border-ink-border p-6 hover:border-accent-border transition shadow-card">
      <div className="font-mono text-xs text-accent mb-3">{num}</div>
      <div className="font-serif text-xl mb-2">{title}</div>
      <p className="text-ink-mute text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function CompareRow({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={`mt-0.5 inline-flex w-5 h-5 rounded-full items-center justify-center shrink-0 ${
          ok ? "bg-status-good text-white" : "bg-ink-border text-ink-dim"
        }`}
      >
        {ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      </span>
      <span>{children}</span>
    </li>
  );
}
