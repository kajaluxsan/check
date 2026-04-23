import { type LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface CardProps {
  title: string;
  icon?: LucideIcon;
  source?: string;
  loading?: boolean;
  error?: string | null;
  children?: ReactNode;
  className?: string;
  action?: ReactNode;
}

export default function Card({
  title,
  icon: Icon,
  source,
  loading,
  error,
  children,
  className = "",
  action,
}: CardProps) {
  return (
    <section
      className={`rounded-card bg-ink-elev border border-ink-border p-6 shadow-card ${className}`}
    >
      <header className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-9 h-9 rounded-input bg-accent-soft flex items-center justify-center">
              <Icon className="w-[18px] h-[18px] text-accent" />
            </div>
          )}
          <h3 className="font-serif text-xl">{title}</h3>
        </div>
        {action}
      </header>

      {loading && (
        <div className="py-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-ink-mute text-sm">
            <span className="inline-block w-4 h-4 border-2 border-ink-border border-t-accent rounded-full animate-spin" />
            Lade Daten …
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="py-6 text-sm text-ink-mute">
          <span className="text-status-bad mr-1">⚠</span>
          {error}
        </div>
      )}

      {!loading && !error && <div>{children}</div>}

      {source && !loading && (
        <div className="mt-5 pt-4 border-t border-ink-border">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-dim">
            Quelle: {source}
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
    good: "text-status-good",
    warn: "text-status-warn",
    bad: "text-status-bad",
    neutral: "text-[var(--fg)]",
  };
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-dim">
        {label}
      </div>
      <div className={`text-2xl font-semibold mt-1 ${colors[tone ?? "neutral"]}`}>
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
    good: "bg-[color:var(--good)]/10 text-status-good border-[color:var(--good)]/30",
    warn: "bg-[color:var(--warn)]/10 text-status-warn border-[color:var(--warn)]/30",
    mid: "bg-[color:var(--mid)]/10 text-[var(--mid)] border-[color:var(--mid)]/30",
    bad: "bg-[color:var(--bad)]/10 text-status-bad border-[color:var(--bad)]/30",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-pill text-xs font-medium border ${styles[tone]}`}
    >
      {children}
    </span>
  );
}
