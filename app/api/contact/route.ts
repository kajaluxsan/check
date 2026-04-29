import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/config";

// In-memory rate limit. Resets when the serverless function instance is
// reclaimed. For high-volume deployments swap for Upstash/Redis or Vercel KV.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5;
const ipHits = new Map<string, { count: number; resetAt: number }>();

const MAX_NAME = 100;
const MAX_MESSAGE = 5000;

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || entry.resetAt < now) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count += 1;
  return false;
}

// Strip CR/LF — basic header-injection defence on user-supplied fields used
// in email subject. Resend already handles header building, this is belt-and-braces.
function clean(s: string, max: number): string {
  return s.replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server nicht konfiguriert." },
      { status: 500 },
    );
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte später erneut versuchen." },
      { status: 429 },
    );
  }

  let body: {
    firstName?: string;
    lastName?: string;
    email?: string;
    message?: string;
    // Honeypot — must be empty. Real users don't see it; bots fill it.
    website?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  // Honeypot: silently succeed for bots so they don't retry.
  if (body.website && body.website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const firstName = body.firstName?.trim() ?? "";
  const lastName = body.lastName?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!firstName || !lastName || !email || !message) {
    return NextResponse.json(
      { error: "Alle Felder sind erforderlich." },
      { status: 400 },
    );
  }
  if (firstName.length > MAX_NAME || lastName.length > MAX_NAME) {
    return NextResponse.json({ error: "Name zu lang." }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE) {
    return NextResponse.json({ error: "Nachricht zu lang." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json(
      { error: "Ungültige E-Mail-Adresse." },
      { status: 400 },
    );
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: "checkmiete.ch <noreply@checkmiete.ch>",
    to: CONTACT_EMAIL,
    replyTo: email,
    subject: clean(`Kontakt: ${firstName} ${lastName}`, 200),
    text: [
      `Vorname: ${clean(firstName, MAX_NAME)}`,
      `Nachname: ${clean(lastName, MAX_NAME)}`,
      `E-Mail: ${email}`,
      `IP: ${ip}`,
      "",
      message,
    ].join("\n"),
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return NextResponse.json(
      { error: "E-Mail konnte nicht gesendet werden." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
