import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { error: "Server missing RECAPTCHA_SECRET_KEY" },
        { status: 500 }
      );
    }

    const { token, name, email, topic, message } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Missing reCAPTCHA token" },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA token with Google
    const googleRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${secret}&response=${token}`,
      }
    );

    const data = await googleRes.json();

    if (!data.success) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM;
    const contactTo = process.env.CONTACT_TO || "info@phurestudios.com";

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !smtpFrom) {
      return NextResponse.json(
        {
          error:
            "Server missing SMTP settings. Fill SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM.",
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: Number(smtpPort) === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const subject = `Contact form: ${topic || "Contact"}`;
    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Topic: ${topic}`,
      "",
      message,
    ].join("\n");

    await transporter.sendMail({
      from: smtpFrom,
      to: contactTo,
      replyTo: email || undefined,
      subject,
      text,
    });

    return NextResponse.json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error("Error in /api/contact:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
