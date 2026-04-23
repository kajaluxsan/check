"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const ITEMS = [
  { href: "/ueber", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function NavDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 px-3 py-2 rounded-input text-ink-mute hover:text-[var(--fg)] hover:bg-ink-elev transition text-sm"
      >
        Mehr
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-44 rounded-input bg-ink-elev border border-ink-border shadow-card overflow-hidden z-50">
          {ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-ink-mute hover:text-[var(--fg)] hover:bg-ink-elev2 transition"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
