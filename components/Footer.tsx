import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ink-border mt-20">
      <div className="max-w-6xl mx-auto px-4 py-10 grid sm:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex w-6 h-6 rounded-md bg-lime-accent text-ink-bg items-center justify-center text-xs font-bold">
              F
            </span>
            <span className="font-serif text-lg">FairMiete.ch</span>
          </div>
          <p className="text-ink-mute">
            Alles was du über deine Wohnung wissen musst. Gratis, unabhängig,
            ohne Login.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-2 text-white">Produkt</div>
          <ul className="space-y-1 text-ink-mute">
            <li><Link href="/analyse" className="hover:text-white">Adress-Analyse</Link></li>
            <li><Link href="/rechner" className="hover:text-white">Rechner-Tools</Link></li>
            <li><Link href="/ueber" className="hover:text-white">Über uns</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2 text-white">Datenquellen</div>
          <ul className="space-y-1 text-ink-mute">
            <li>BFS · Strukturerhebung</li>
            <li>OpenStreetMap · Overpass</li>
            <li>transport.opendata.ch</li>
            <li>geo.admin.ch · BAFU</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-border py-4 text-center text-xs text-ink-dim">
        © {new Date().getFullYear()} FairMiete.ch · Keine Rechtsberatung, keine Gewähr.
      </div>
    </footer>
  );
}
