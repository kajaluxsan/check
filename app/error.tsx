"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-20 text-center">
      <div className="font-mono text-xs uppercase tracking-[0.2em] text-status-bad mb-2">
        Fehler
      </div>
      <h1 className="font-serif text-4xl sm:text-5xl mb-4">
        Etwas ist schiefgelaufen.
      </h1>
      <p className="text-ink-mute mb-8">
        Probier es nochmal, oder lade die Seite neu.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={reset}
          className="inline-flex items-center px-5 py-2.5 rounded-input bg-accent text-white font-medium hover:bg-accent-hover transition"
        >
          Erneut versuchen
        </button>
        <Link
          href="/"
          className="inline-flex items-center px-5 py-2.5 rounded-input bg-ink-elev border border-ink-border text-ink-mute font-medium hover:text-[var(--fg)] transition"
        >
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}
