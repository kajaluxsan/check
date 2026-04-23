import Link from "next/link";

export default function MietrechtPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-ink-elev border border-ink-border text-xs text-ink-mute mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        In Arbeit
      </div>
      <h1 className="font-serif text-4xl sm:text-5xl mb-4">
        Mietrecht-Ratgeber kommt bald
      </h1>
      <p className="text-ink-mute mb-8 max-w-xl mx-auto">
        Wir arbeiten an gut aufbereiteten Antworten zu den häufigsten Fragen:
        Anfangsmiete anfechten, Mängel melden, Kaution zurückfordern, Kündigung
        korrekt einreichen und mehr.
      </p>
      <p className="text-sm text-ink-dim mb-8">
        Bis dahin findest du die wichtigsten Schnell-Infos direkt in der
        Adress-Analyse.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-6 py-3 rounded-input bg-accent text-white font-semibold hover:bg-accent-hover transition"
      >
        Zur Analyse →
      </Link>
    </div>
  );
}
