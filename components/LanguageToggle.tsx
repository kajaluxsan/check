"use client";

import { useEffect, useState } from "react";
import { useT, type Locale } from "@/lib/i18n/context";

const OPTIONS: { value: Locale; label: string }[] = [
  { value: "de", label: "DE" },
  { value: "fr", label: "FR" },
  { value: "it", label: "IT" },
  { value: "en", label: "EN" },
];

export default function LanguageToggle() {
  const { locale, setLocale } = useT();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = () => setOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [open]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-semibold text-ink-mute hover:text-white hover:bg-ink-elev transition"
        aria-label="Sprache / Language"
      >
        {locale.toUpperCase()}
      </button>

      {open && (
        <div
          className="absolute right-0 top-10 z-50 rounded-xl bg-ink-elev border border-ink-border shadow-lg py-1 min-w-[100px]"
          onClick={(e) => e.stopPropagation()}
        >
          {OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                setLocale(o.value);
                setOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-sm transition ${
                locale === o.value
                  ? "text-lime-accent"
                  : "text-ink-mute hover:text-white hover:bg-ink-elev2"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
