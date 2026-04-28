import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/config";

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server nicht konfiguriert." },
      { status: 500 },
    );
  }

  let body: {
    firstName?: string;
    lastName?: string;
    email?: string;
    message?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const { firstName, lastName, email, message } = body;

  if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "Alle Felder sind erforderlich." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
    subject: `Kontakt: ${firstName} ${lastName}`,
    text: [
      `Vorname: ${firstName}`,
      `Nachname: ${lastName}`,
      `E-Mail: ${email}`,
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
