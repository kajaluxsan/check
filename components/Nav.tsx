import Link from "next/link";

export default function Nav() {
  return (
    <header className="border-b border-neutral-200 bg-white/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="inline-flex w-8 h-8 rounded-lg bg-brand-600 text-white items-center justify-center">
            ✓
          </span>
          <span>check</span>
          <span className="text-neutral-400 font-normal text-sm hidden sm:inline">
            · Fair Rent Switzerland
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2 text-sm">
          <Link
            href="/checker"
            className="px-3 py-2 rounded-md text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
          >
            Checker
          </Link>
          <Link
            href="/alerts"
            className="px-3 py-2 rounded-md text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
          >
            Alerts
          </Link>
          <Link
            href="/about"
            className="px-3 py-2 rounded-md text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
          >
            Über uns
          </Link>
          <Link
            href="/checker"
            className="ml-2 inline-flex items-center px-4 py-2 rounded-md bg-brand-600 text-white font-medium hover:bg-brand-700"
          >
            Jetzt prüfen
          </Link>
        </nav>
      </div>
    </header>
  );
}
