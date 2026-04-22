"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n/context";

type Theme = "system" | "dark" | "light";

const ICONS: Record<Theme, string> = {
  dark: "M",    // moon
  light: "S",   // sun
  system: "A",  // auto
};

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("light", !prefersDark);
  } else {
    root.classList.toggle("light", theme === "light");
  }
}

export default function ThemeToggle() {
  const { t } = useT();
  const [theme, setTheme] = useState<Theme>("dark");
  const [open, setOpen] = useState(false);

  // On mount: read saved preference
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    const initial = saved ?? "dark";
    setTheme(initial);
    applyTheme(initial);

    // Listen for system changes when in system mode
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const current = (localStorage.getItem("theme") ?? "dark") as Theme;
      if (current === "system") applyTheme("system");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  function pick(t: Theme) {
    setTheme(t);
    localStorage.setItem("theme", t);
    applyTheme(t);
    setOpen(false);
  }

  // Close dropdown on outside click
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
        className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-mute hover:text-white hover:bg-ink-elev transition"
        aria-label={t.theme.toggle}
      >
        {theme === "dark" && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
        {theme === "light" && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        )}
        {theme === "system" && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-10 z-50 rounded-xl bg-ink-elev border border-ink-border shadow-lg py-1 min-w-[140px]"
          onClick={(e) => e.stopPropagation()}
        >
          {(["dark", "light", "system"] as Theme[]).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => pick(opt)}
              className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2.5 transition ${
                theme === opt
                  ? "text-lime-accent"
                  : "text-ink-mute hover:text-white hover:bg-ink-elev2"
              }`}
            >
              {opt === "dark" && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
              {opt === "light" && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
              {opt === "system" && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              )}
              {opt === "dark" ? t.theme.dark : opt === "light" ? t.theme.light : t.theme.system}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
