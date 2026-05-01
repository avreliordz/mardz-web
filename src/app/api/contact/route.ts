import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Nombre, email y mensaje son obligatorios." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM;

  if (!apiKey || !to || !from) {
    console.warn(
      "[contact] Missing RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM",
    );
    return NextResponse.json(
      {
        error:
          "Servicio de correo no configurado. Añade variables en Vercel o usa Formspree (README).",
      },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    subject: `[mardz-web] Mensaje de ${name}`,
    text: `De: ${name} <${email}>\n\n${message}`,
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return NextResponse.json(
      { error: "No se pudo enviar el correo." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
