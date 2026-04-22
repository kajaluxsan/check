"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/context";

export default function Footer() {
  const { t } = useT();

  return (
    <footer className="border-t border-ink-border mt-20">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 py-10 flex flex-col sm:flex-row gap-8 text-sm">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex w-6 h-6 rounded-md bg-lime-accent text-ink-bg items-center justify-center text-xs font-bold">
              C
            </span>
            <span className="font-serif text-lg">checkmiete.ch</span>
          </div>
          <p className="text-ink-mute">{t.footer.tagline}</p>
        </div>
        <div>
          <div className="font-semibold mb-2 text-white">{t.footer.product}</div>
          <ul className="space-y-1 text-ink-mute">
            <li><Link href="/analyse" className="hover:text-white">{t.footer.addressAnalysis}</Link></li>
            <li><Link href="/rechner" className="hover:text-white">{t.footer.calculatorTools}</Link></li>
            <li><Link href="/ueber" className="hover:text-white">{t.footer.about}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-border py-4 text-center text-xs text-ink-dim">
        &copy; {new Date().getFullYear()} checkmiete.ch &middot; {t.footer.disclaimer}
      </div>
    </footer>
  );
}
