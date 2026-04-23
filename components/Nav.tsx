import Link from "next/link";

const LINKS = [
  { href: "/analyse", label: "Analyse" },
  { href: "/rechner", label: "Rechner" },
  { href: "/mietrecht", label: "Mietrecht" },
  { href: "/ueber", label: "Über uns" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-border bg-ink-bg/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="inline-flex w-8 h-8 rounded-input bg-accent text-white items-center justify-center font-bold text-sm">
            C
          </span>
          <span className="font-serif text-xl tracking-tight">checkmiete</span>
          <span className="text-ink-dim text-sm hidden sm:inline">.ch</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-2 rounded-input text-ink-mute hover:text-[var(--fg)] hover:bg-ink-elev transition"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
