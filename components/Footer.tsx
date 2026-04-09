import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid sm:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 font-bold mb-2">
            <span className="inline-flex w-6 h-6 rounded-md bg-brand-600 text-white items-center justify-center text-xs">
              ✓
            </span>
            check
          </div>
          <p className="text-neutral-600">
            Faire Mietpreise für die Schweiz – basierend auf öffentlichen BFS-Daten.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-2">Produkt</div>
          <ul className="space-y-1 text-neutral-600">
            <li><Link href="/checker" className="hover:text-neutral-900">Mietpreis-Check</Link></li>
            <li><Link href="/alerts" className="hover:text-neutral-900">Preis-Alerts</Link></li>
            <li><Link href="/about" className="hover:text-neutral-900">Datenquellen</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Rechtliches</div>
          <ul className="space-y-1 text-neutral-600">
            <li>Keine Rechtsberatung</li>
            <li>Keine Gewähr</li>
            <li>Daten: © BFS 2023</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-100 py-4 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} check. MVP-Prototyp.
      </div>
    </footer>
  );
}
