import Link from "next/link";

export default function UeberPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-12">
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-2">Über uns</div>
        <h1 className="font-serif text-4xl sm:text-5xl">Faire Mieten für alle.</h1>
        <p className="text-ink-mute mt-4 text-lg leading-relaxed">
          checkmiete.ch hilft dir, deine Wohnung objektiv einzuschätzen.
          Mietpreis, Umgebung, ÖV, Lärm, Steuern und deine Rechte als
          Mieterin oder Mieter — alles aus einer einzigen Adresse.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="font-serif text-2xl mb-4">Wie es funktioniert</h2>
        <div className="space-y-4">
          <Step num="1" title="Adresse eingeben">Gib deine Adresse, die Zimmerzahl und die monatliche Nettomiete ein.</Step>
          <Step num="2" title="Analyse erhalten">checkmiete analysiert sechs Aspekte deiner Wohnung — von der Preisfairness bis zum nächsten ÖV-Anschluss.</Step>
          <Step num="3" title="Handeln">Auf Basis der Ergebnisse kannst du verhandeln, anfechten oder einfach sicher sein, dass dein Preis stimmt.</Step>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-serif text-2xl mb-4">Unser Versprechen</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Promise title="Gratis">Kein Abo, kein Premium, keine versteckten Kosten. Heute nicht, morgen nicht.</Promise>
          <Promise title="Ohne Login">Keine Registrierung, keine E-Mail, keine Cookies. Einfach nutzen.</Promise>
          <Promise title="Unabhängig">Wir sind kein Vermieter-Portal. Wir verdienen nichts an Inseraten.</Promise>
          <Promise title="Transparent">Alle Daten stammen aus öffentlichen Quellen. Jede Karte zeigt ihre Quelle.</Promise>
        </div>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="font-serif text-2xl">Wichtig zu wissen</h2>
        <ul className="space-y-2 text-ink-mute">
          <li>• checkmiete ist keine Rechtsberatung. Für verbindliche Auskünfte wende dich an den Mieterverband.</li>
          <li>• Wir vermieten keine Wohnungen und sind kein Immobilienportal.</li>
          <li>• Die Ergebnisse dienen der Orientierung — keine Garantie auf Vollständigkeit.</li>
        </ul>
      </section>

      <div className="rounded-[24px] bg-accent-soft border border-accent-border p-10 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl">Probier&apos;s aus.</h2>
        <p className="mt-3 text-ink-mute">Eine Adresse reicht — 30 Sekunden.</p>
        <Link href="/" className="mt-6 inline-flex items-center px-6 py-3 rounded-input bg-accent text-white font-semibold hover:bg-accent-hover transition">Zur Analyse →</Link>
      </div>

      <details className="mt-16 text-sm">
        <summary className="text-ink-dim cursor-pointer hover:text-ink-mute transition">Datenquellen & Hinweise</summary>
        <div className="mt-4 rounded-card bg-ink-elev border border-ink-border p-5 text-ink-mute space-y-2">
          <p>Mietpreise: BFS Strukturerhebung (opendata.swiss)</p>
          <p>Karte & POIs: OpenStreetMap / Overpass API</p>
          <p>ÖV: transport.opendata.ch (SBB-Fahrplandaten)</p>
          <p>Lärm: geo.admin.ch / BAFU Lärmkartierung</p>
          <p>Gebäude: GWR (Eidg. Gebäude- und Wohnungsregister)</p>
          <p>Steuern: ESTV / BFS Aggregate</p>
          <p>Recht: OR Art. 253 ff., BWO Referenzzinssatz</p>
          <p className="pt-2 text-ink-dim text-xs">Alle Daten sind öffentlich zugänglich. checkmiete speichert keine personenbezogenen Daten. Alle Berechnungen laufen lokal im Browser.</p>
        </div>
      </details>
    </div>
  );
}

function Step({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">{num}</div>
      <div>
        <div className="font-semibold text-[var(--fg)]">{title}</div>
        <div className="text-ink-mute text-sm mt-0.5">{children}</div>
      </div>
    </div>
  );
}

function Promise({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-card bg-ink-elev border border-ink-border p-5 shadow-card">
      <div className="font-semibold text-[var(--fg)] mb-1">{title}</div>
      <div className="text-sm text-ink-mute">{children}</div>
    </div>
  );
}
