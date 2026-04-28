"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/context";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";

export default function Nav() {
  const { t } = useT();

  const links = [
    { href: "/analyse", label: t.nav.analyse },
    { href: "/rechner", label: t.nav.rechner },
    { href: "/mietrecht", label: t.nav.mietrecht },
    { href: "/ueber", label: t.nav.about },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-ink-border bg-ink-bg/80 backdrop-blur">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 h-14 sm:h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex w-8 h-8 rounded-lg bg-lime-accent text-ink-bg items-center justify-center font-bold">
            C
          </span>
          <span className="font-serif text-xl tracking-tight">checkmiete</span>
          <span className="text-ink-dim text-sm hidden sm:inline">.ch</span>
        </Link>
        <div className="flex items-center gap-1">
          <nav className="flex items-center gap-1 text-sm">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2 rounded-md text-ink-mute hover:text-white hover:bg-ink-elev transition"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
