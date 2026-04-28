"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n/context";

export default function KontaktPage() {
  const { t } = useT();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !message.trim()) {
      setError(t.contact.required);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t.contact.emailInvalid);
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, message }),
      });
      if (!res.ok) {
        setError(t.contact.sendError);
        return;
      }
      setSent(true);
    } catch {
      setError(t.contact.sendError);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 sm:px-6 lg:px-10 py-20 text-center">
        <div className="inline-flex w-16 h-16 rounded-full bg-lime-accent/15 text-lime-accent items-center justify-center text-3xl mb-4">
          ✓
        </div>
        <h1 className="font-serif text-3xl">{t.contact.sent}</h1>
        <p className="text-ink-mute mt-3">{t.contact.sentSub}</p>
        <button
          onClick={() => {
            setSent(false);
            setFirstName("");
            setLastName("");
            setEmail("");
            setMessage("");
          }}
          className="mt-6 inline-flex items-center px-5 py-2.5 rounded-lg bg-ink-elev border border-ink-border text-ink-mute font-medium hover:text-white transition"
        >
          {t.contact.another}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
      <div className="mb-8">
        <h1 className="font-serif text-4xl sm:text-5xl">{t.contact.title}</h1>
        <p className="text-ink-mute mt-3 text-lg">{t.contact.subtitle}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-ink-elev border border-ink-border p-6 sm:p-8 space-y-5"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={t.contact.firstName}>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t.contact.placeholderFirst}
              className="input"
            />
          </Field>
          <Field label={t.contact.lastName}>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t.contact.placeholderLast}
              className="input"
            />
          </Field>
        </div>

        <Field label={t.contact.email}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.contact.placeholderEmail}
            className="input"
          />
        </Field>

        <Field label={t.contact.message}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t.contact.placeholderMessage}
            rows={5}
            className="input resize-none"
          />
        </Field>

        {error && (
          <div className="text-sm text-red-400">{error}</div>
        )}

        <button
          type="submit"
          disabled={sending}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-lime-accent text-ink-bg font-semibold hover:bg-lime-dark disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {sending ? t.contact.sending : t.contact.send}
        </button>
      </form>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.75rem 0.875rem;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--fg);
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus {
          border-color: var(--accent);
        }
        .input::placeholder {
          color: var(--fg-dim);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-wide text-ink-dim mb-1.5">
        {label}
      </div>
      {children}
    </label>
  );
}
