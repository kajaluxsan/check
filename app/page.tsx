"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/context";
import AddressSearch from "@/components/AddressSearch";

export default function HomePage() {
  const { t } = useT();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-20 w-[700px] h-[700px] rounded-full bg-lime-accent/10 blur-3xl" />
          <div className="absolute -bottom-40 right-0 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-3xl" />
        </div>

        <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-10 pt-20 pb-28 sm:pt-32 sm:pb-40 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink-elev border border-ink-border text-xs text-ink-mute mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-accent" />
            {t.home.badge}
          </div>
          <h1 className="font-serif text-5xl sm:text-7xl tracking-tight leading-[1.05] text-white">
            {t.home.heroTitle1} <br />
            <span className="text-lime-accent">{t.home.heroTitle2}</span> {t.home.heroTitle3}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-ink-mute max-w-2xl mx-auto">
            {t.home.heroSub}
          </p>

          <div className="mt-10 max-w-3xl mx-auto text-left">
            <AddressSearch />
            <p className="mt-3 text-xs text-ink-dim text-center">
              {t.home.heroBrowser}
            </p>
          </div>
        </div>
      </section>

      {/* 4 Tool explainer */}
      <section className="w-full mx-auto px-4 sm:px-6 lg:px-10 py-20">
        <div className="text-center mb-12">
          <div className="text-sm uppercase tracking-[0.2em] text-lime-accent mb-2">
            {t.home.toolsLabel}
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl">{t.home.toolsTitle}</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ToolCard num="01" title={t.home.tool1Title} text={t.home.tool1Text} />
          <ToolCard num="02" title={t.home.tool2Title} text={t.home.tool2Text} />
          <ToolCard num="03" title={t.home.tool3Title} text={t.home.tool3Text} />
          <ToolCard num="04" title={t.home.tool4Title} text={t.home.tool4Text} />
        </div>
      </section>

      {/* Compare vs Homegate */}
      <section className="w-full mx-auto px-4 sm:px-6 lg:px-10 py-20">
        <div className="text-center mb-12">
          <div className="text-sm uppercase tracking-[0.2em] text-lime-accent mb-2">
            {t.home.whyLabel}
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl">{t.home.whyTitle}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-ink-elev border border-ink-border p-8">
            <div className="text-sm uppercase tracking-wider text-ink-dim mb-1">{t.home.othersLabel}</div>
            <div className="font-serif text-3xl mb-6">{t.home.othersPrice}</div>
            <ul className="space-y-3 text-ink-mute">
              <Row ok={false}>{t.home.others1}</Row>
              <Row ok={false}>{t.home.others2}</Row>
              <Row ok={false}>{t.home.others3}</Row>
              <Row ok={false}>{t.home.others4}</Row>
              <Row ok={false}>{t.home.others5}</Row>
            </ul>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-lime-accent/15 to-lime-accent/5 border border-lime-accent/40 p-8">
            <div className="text-sm uppercase tracking-wider text-lime-accent mb-1">{t.home.usLabel}</div>
            <div className="font-serif text-3xl mb-6 text-white">{t.home.usPrice}</div>
            <ul className="space-y-3 text-white/90">
              <Row ok>{t.home.us1}</Row>
              <Row ok>{t.home.us2}</Row>
              <Row ok>{t.home.us3}</Row>
              <Row ok>{t.home.us4}</Row>
              <Row ok>{t.home.us5}</Row>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full mx-auto px-4 sm:px-6 lg:px-10 py-20">
        <div className="rounded-3xl bg-ink-elev border border-ink-border p-10 sm:p-14 text-center">
          <h2 className="font-serif text-3xl sm:text-5xl text-white">
            {t.home.ctaTitle}
          </h2>
          <p className="mt-4 text-ink-mute max-w-xl mx-auto">
            {t.home.ctaSub}
          </p>
          <Link
            href="/analyse"
            className="mt-8 inline-flex items-center px-6 py-3 rounded-xl bg-lime-accent text-ink-bg font-semibold hover:bg-lime-dark transition"
          >
            {t.common.startAnalysis}
          </Link>
        </div>
      </section>
    </div>
  );
}

function ToolCard({ num, title, text }: { num: string; title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-ink-elev border border-ink-border p-6 hover:border-lime-accent/40 transition">
      <div className="text-xs font-mono text-lime-accent mb-3">{num}</div>
      <div className="font-serif text-xl mb-2">{title}</div>
      <p className="text-ink-mute text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function Row({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={`mt-0.5 inline-flex w-5 h-5 rounded-full items-center justify-center text-[11px] font-bold shrink-0 ${
          ok ? "bg-lime-accent text-ink-bg" : "bg-ink-border text-ink-dim"
        }`}
      >
        {ok ? "\u2713" : "\u00d7"}
      </span>
      <span>{children}</span>
    </li>
  );
}
