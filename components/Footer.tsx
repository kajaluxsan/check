import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ink-border mt-20">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row gap-8 text-sm">
        <div className="flex-1">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="inline-flex w-6 h-6 rounded-[8px] bg-accent text-white items-center justify-center text-xs font-bold">
              C
            </span>
            <span className="font-serif text-lg">checkmiete.ch</span>
          </div>
          <p className="text-ink-mute max-w-xs">
            Alles was du über deine Wohnung wissen musst. Gratis, unabhängig,
            ohne Login.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-2 text-[var(--fg)]">Produkt</div>
          <ul className="space-y-1 text-ink-mute">
            <li><Link href="/analyse" className="hover:text-[var(--fg)]">Adress-Analyse</Link></li>
            <li><Link href="/rechner" className="hover:text-[var(--fg)]">Rechner-Tools</Link></li>
            <li><Link href="/ueber" className="hover:text-[var(--fg)]">Über uns</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-border py-4 text-center text-xs text-ink-dim">
        © {new Date().getFullYear()} checkmiete.ch · Keine Rechtsberatung, keine Gewähr.
      </div>
    </footer>
  );
}
