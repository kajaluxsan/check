import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full max-w-xl mx-auto px-4 py-20 text-center">
      <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-2">
        404
      </div>
      <h1 className="font-serif text-4xl sm:text-5xl mb-4">
        Seite nicht gefunden
      </h1>
      <p className="text-ink-mute mb-8">
        Die angeforderte Seite existiert nicht oder wurde verschoben.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-6 py-3 rounded-input bg-accent text-white font-semibold hover:bg-accent-hover transition"
      >
        Zur Startseite
      </Link>
    </div>
  );
}
