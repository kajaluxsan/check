"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/config";

type Lang = "de" | "fr" | "it" | "en";

const T: Record<Lang, {
  title: string;
  subtitle: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  send: string;
  sent: string;
  sentSub: string;
  another: string;
  required: string;
  emailInvalid: string;
  placeholderFirst: string;
  placeholderLast: string;
  placeholderEmail: string;
  placeholderMessage: string;
}> = {
  de: {
    title: "Kontakt",
    subtitle: "Hast du Fragen, Feedback oder möchtest zusammenarbeiten? Schreib uns.",
    firstName: "Vorname",
    lastName: "Nachname",
    email: "E-Mail",
    message: "Nachricht",
    send: "Nachricht senden",
    sent: "Nachricht gesendet",
    sentSub: "Wir melden uns so schnell wie möglich bei dir.",
    another: "Weitere Nachricht senden",
    required: "Bitte fülle alle Felder aus.",
    emailInvalid: "Bitte gib eine gültige E-Mail ein.",
    placeholderFirst: "Max",
    placeholderLast: "Muster",
    placeholderEmail: "max@beispiel.ch",
    placeholderMessage: "Deine Nachricht …",
  },
  fr: {
    title: "Contact",
    subtitle: "Tu as des questions, un retour ou tu souhaites collaborer? Écris-nous.",
    firstName: "Prénom",
    lastName: "Nom",
    email: "E-mail",
    message: "Message",
    send: "Envoyer le message",
    sent: "Message envoyé",
    sentSub: "Nous te répondrons dès que possible.",
    another: "Envoyer un autre message",
    required: "Veuillez remplir tous les champs.",
    emailInvalid: "Veuillez entrer un e-mail valide.",
    placeholderFirst: "Jean",
    placeholderLast: "Dupont",
    placeholderEmail: "jean@exemple.ch",
    placeholderMessage: "Ton message …",
  },
  it: {
    title: "Contatto",
    subtitle: "Hai domande, feedback o vuoi collaborare? Scrivici.",
    firstName: "Nome",
    lastName: "Cognome",
    email: "E-mail",
    message: "Messaggio",
    send: "Invia il messaggio",
    sent: "Messaggio inviato",
    sentSub: "Ti risponderemo il prima possibile.",
    another: "Invia un altro messaggio",
    required: "Si prega di compilare tutti i campi.",
    emailInvalid: "Si prega di inserire un'e-mail valida.",
    placeholderFirst: "Marco",
    placeholderLast: "Rossi",
    placeholderEmail: "marco@esempio.ch",
    placeholderMessage: "Il tuo messaggio …",
  },
  en: {
    title: "Contact",
    subtitle: "Have questions, feedback or want to collaborate? Write to us.",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    message: "Message",
    send: "Send message",
    sent: "Message sent",
    sentSub: "We'll get back to you as soon as possible.",
    another: "Send another message",
    required: "Please fill in all fields.",
    emailInvalid: "Please enter a valid email.",
    placeholderFirst: "John",
    placeholderLast: "Doe",
    placeholderEmail: "john@example.com",
    placeholderMessage: "Your message …",
  },
};

const LANG_LABELS: Record<Lang, string> = {
  de: "DE",
  fr: "FR",
  it: "IT",
  en: "EN",
};

export default function KontaktPage() {
  const [lang, setLang] = useState<Lang>("de");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const t = T[lang];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !message.trim()) {
      setError(t.required);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t.emailInvalid);
      return;
    }

    const subject = encodeURIComponent(`checkmiete.ch Kontakt: ${firstName} ${lastName}`);
    const body = encodeURIComponent(
      `Vorname: ${firstName}\nNachname: ${lastName}\nE-Mail: ${email}\n\n${message}`,
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex w-16 h-16 rounded-full bg-accent-soft text-accent items-center justify-center mb-4">
          <Send className="w-7 h-7" />
        </div>
        <h1 className="font-serif text-3xl">{t.sent}</h1>
        <p className="text-ink-mute mt-3">{t.sentSub}</p>
        <button
          onClick={() => {
            setSent(false);
            setFirstName("");
            setLastName("");
            setEmail("");
            setMessage("");
          }}
          className="mt-6 inline-flex items-center px-5 py-2.5 rounded-input bg-ink-elev border border-ink-border text-ink-mute font-medium hover:text-[var(--fg)] transition"
        >
          {t.another}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Language switcher */}
      <div className="flex justify-end mb-6">
        <div className="inline-flex rounded-input border border-ink-border overflow-hidden">
          {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`px-3 py-1.5 text-xs font-mono font-medium transition ${
                lang === l
                  ? "bg-accent text-white"
                  : "bg-ink-elev text-ink-mute hover:text-[var(--fg)]"
              }`}
            >
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="w-10 h-10 rounded-input bg-accent-soft flex items-center justify-center mb-4">
          <Mail className="w-5 h-5 text-accent" />
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl">{t.title}</h1>
        <p className="text-ink-mute mt-3 text-lg">{t.subtitle}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-card bg-ink-elev border border-ink-border p-6 sm:p-8 shadow-card space-y-5"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={t.firstName}>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t.placeholderFirst}
              className="input"
            />
          </Field>
          <Field label={t.lastName}>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t.placeholderLast}
              className="input"
            />
          </Field>
        </div>

        <Field label={t.email}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.placeholderEmail}
            className="input"
          />
        </Field>

        <Field label={t.message}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t.placeholderMessage}
            rows={5}
            className="input resize-none"
          />
        </Field>

        {error && (
          <div className="text-sm text-status-bad">{error}</div>
        )}

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-input bg-accent text-white font-semibold hover:bg-accent-hover transition"
        >
          <Send className="w-4 h-4" />
          {t.send}
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
      <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-dim mb-1.5">
        {label}
      </div>
      {children}
    </label>
  );
}
