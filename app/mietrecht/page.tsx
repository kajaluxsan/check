"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/context";

export default function MietrechtPage() {
  const { t } = useT();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-16 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink-elev border border-ink-border text-xs text-ink-mute mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-lime-accent" />
        {t.common.phase2}
      </div>
      <h1 className="font-serif text-4xl sm:text-5xl mb-4">{t.mietrecht.title}</h1>
      <p className="text-ink-mute mb-8 max-w-xl mx-auto">{t.mietrecht.text}</p>
      <p className="text-sm text-ink-dim mb-8">{t.mietrecht.hint}</p>
      <Link
        href="/"
        className="inline-flex items-center px-6 py-3 rounded-xl bg-lime-accent text-ink-bg font-semibold hover:bg-lime-dark"
      >
        {t.common.toAnalysis}
      </Link>
    </div>
  );
}
