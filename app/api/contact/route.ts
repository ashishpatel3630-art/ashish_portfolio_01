import { NextResponse } from "next/server";

type ContactBody = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Please submit a valid contact form." }, { status: 400 });
  }
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return NextResponse.json({ message: "Please submit a valid contact form." }, { status: 400 });
  }
  const body = payload as ContactBody;

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.replace(/[\r\n]+/g, " ").trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const website = typeof body.website === "string" ? body.website.trim() : "";

  if (website) {
    return NextResponse.json({ message: "Unable to submit this message." }, { status: 400 });
  }
  if (name.length < 2 || name.length > 100 || !isValidEmail(email) || email.length > 254 || subject.length < 3 || subject.length > 140 || message.length < 10 || message.length > 5000) {
    return NextResponse.json({ message: "Check the name, email, subject, and message fields and try again." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || "ashishpatel3630@gmail.com";
  if (!apiKey || !from) {
    return NextResponse.json(
      { message: "Contact email delivery is not configured yet. Please email ashishpatel3630@gmail.com directly." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error("Contact email provider rejected a message.", { status: response.status });
      return NextResponse.json({ message: "The email service could not accept this message. Please try again or email directly." }, { status: 502 });
    }

    return NextResponse.json({ message: "Message delivered." }, { status: 200 });
  } catch (error) {
    console.error("Contact email delivery failed.", error);
    return NextResponse.json({ message: "The email service is temporarily unavailable. Please try again or email directly." }, { status: 502 });
  }
}
