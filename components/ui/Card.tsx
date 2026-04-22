"use client";

import { ReactNode } from "react";
import { useT } from "@/lib/i18n/context";

interface CardProps {
  title: string;
  icon?: string;
  source?: string;
  loading?: boolean;
  error?: string | null;
  children?: ReactNode;
  className?: string;
  action?: ReactNode;
}

export default function Card({
  title,
  icon,
  source,
  loading,
  error,
  children,
  className = "",
  action,
}: CardProps) {
  const { t } = useT();
  return (
    <section
      className={`rounded-2xl bg-ink-elev border border-ink-border p-4 sm:p-6 ${className}`}
    >
      <header className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          {icon && <span className="text-2xl">{icon}</span>}
          <h3 className="font-serif text-xl">{title}</h3>
        </div>
        {action}
      </header>

      {loading && (
        <div className="py-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-ink-mute text-sm">
            <span className="inline-block w-4 h-4 border-2 border-ink-border border-t-lime-accent rounded-full animate-spin" />
            {t.common.loading}
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="py-6 text-sm text-ink-mute">
          <span className="text-red-400 mr-1">⚠</span>
          {error}
        </div>
      )}

      {!loading && !error && <div>{children}</div>}

      {source && !loading && (
        <div className="mt-4 pt-4 border-t border-ink-border text-xs text-ink-dim">
          {t.common.source}: {source}
        </div>
      )}
    </section>
  );
}

export function Metric({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "good" | "warn" | "bad" | "neutral";
}) {
  const colors = {
    good: "text-lime-accent",
    warn: "text-yellow-400",
    bad: "text-red-400",
    neutral: "text-white",
  };
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-ink-dim">
        {label}
      </div>
      <div className={`text-xl sm:text-2xl font-semibold mt-1 ${colors[tone ?? "neutral"]}`}>
        {value}
      </div>
      {sub && <div className="text-xs text-ink-mute mt-0.5">{sub}</div>}
    </div>
  );
}

export function Pill({
  tone,
  children,
}: {
  tone: "good" | "warn" | "mid" | "bad";
  children: ReactNode;
}) {
  const styles = {
    good: "bg-lime-accent/10 text-lime-accent border-lime-accent/30",
    warn: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    mid: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    bad: "bg-red-500/10 text-red-400 border-red-500/30",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${styles[tone]}`}
    >
      {children}
    </span>
  );
}
