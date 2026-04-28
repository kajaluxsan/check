"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/context";

export default function UeberPage() {
  const { t } = useT();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
      <div className="mb-12">
        <div className="text-xs uppercase tracking-[0.2em] text-lime-accent mb-2">
          {t.ueber.label}
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl">{t.ueber.title}</h1>
        <p className="text-ink-mute mt-4 text-lg leading-relaxed">{t.ueber.intro}</p>
      </div>

      <section className="mb-12">
        <h2 className="font-serif text-2xl mb-4">{t.ueber.howTitle}</h2>
        <div className="space-y-4">
          <Step num="1" title={t.ueber.step1Title}>{t.ueber.step1Text}</Step>
          <Step num="2" title={t.ueber.step2Title}>{t.ueber.step2Text}</Step>
          <Step num="3" title={t.ueber.step3Title}>{t.ueber.step3Text}</Step>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-serif text-2xl mb-4">{t.ueber.promiseTitle}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Promise title={t.ueber.free}>{t.ueber.freeText}</Promise>
          <Promise title={t.ueber.noLogin}>{t.ueber.noLoginText}</Promise>
          <Promise title={t.ueber.independent}>{t.ueber.independentText}</Promise>
          <Promise title={t.ueber.transparent}>{t.ueber.transparentText}</Promise>
        </div>
      </section>

      <section className="mb-12 space-y-4">
        <h2 className="font-serif text-2xl">{t.ueber.importantTitle}</h2>
        <ul className="space-y-2 text-ink-mute">
          <li>&bull; {t.ueber.important1}</li>
          <li>&bull; {t.ueber.important2}</li>
          <li>&bull; {t.ueber.important3}</li>
        </ul>
      </section>

      <div className="rounded-3xl bg-gradient-to-br from-lime-accent/15 to-lime-accent/5 border border-lime-accent/40 p-10 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl text-white">{t.ueber.ctaTitle}</h2>
        <p className="mt-3 text-ink-mute">{t.ueber.ctaSub}</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center px-6 py-3 rounded-xl bg-lime-accent text-ink-bg font-semibold hover:bg-lime-dark"
        >
          {t.common.toAnalysis}
        </Link>
      </div>

      <details className="mt-16 text-sm">
        <summary className="text-ink-dim cursor-pointer hover:text-ink-mute transition">
          {t.ueber.sourcesTitle}
        </summary>
        <div className="mt-4 rounded-2xl bg-ink-elev border border-ink-border p-5 text-ink-mute space-y-2">
          <p>{t.ueber.src1}</p>
          <p>{t.ueber.src2}</p>
          <p>{t.ueber.src3}</p>
          <p>{t.ueber.src4}</p>
          <p>{t.ueber.src5}</p>
          <p>{t.ueber.src6}</p>
          <p className="pt-2 text-ink-dim text-xs">{t.ueber.srcNote}</p>
        </div>
      </details>
    </div>
  );
}

function Step({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-8 h-8 rounded-full bg-lime-accent text-ink-bg flex items-center justify-center font-bold text-sm">
        {num}
      </div>
      <div>
        <div className="font-semibold text-white">{title}</div>
        <div className="text-ink-mute text-sm mt-0.5">{children}</div>
      </div>
    </div>
  );
}

function Promise({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-ink-elev border border-ink-border p-5">
      <div className="font-semibold text-white mb-1">{title}</div>
      <div className="text-sm text-ink-mute">{children}</div>
    </div>
  );
}
