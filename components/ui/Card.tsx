"use client";

import { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { useT } from "@/lib/i18n/context";

interface CardProps {
  title: string;
  /** Either a Lucide icon component (preferred) or a legacy emoji string. */
  icon?: LucideIcon | string;
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

  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === "string") {
      return <span className="text-2xl">{icon}</span>;
    }
    const Icon = icon;
    return (
      <div className="w-9 h-9 rounded-input bg-accent-soft flex items-center justify-center">
        <Icon className="w-[18px] h-[18px] text-[var(--accent)]" />
      </div>
    );
  };

  return (
    <section
      className={`rounded-card bg-ink-elev border border-ink-border p-4 sm:p-6 shadow-card ${className}`}
    >
      <header className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          {renderIcon()}
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
        <div className="mt-5 pt-4 border-t border-ink-border">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-dim">
            {t.common.source}: {source}
          </span>
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
      <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-dim">
        {label}
      </div>
      <div
        className={`text-xl sm:text-2xl font-semibold mt-1 ${colors[tone ?? "neutral"]}`}
      >
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
      className={`inline-flex items-center px-3 py-1 rounded-pill text-xs font-medium border ${styles[tone]}`}
    >
      {children}
    </span>
  );
}
