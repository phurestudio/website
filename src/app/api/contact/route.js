import { NextResponse } from "next/server";

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

    console.log("Contact form submitted:", { name, email, topic, message });

    return NextResponse.json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error("Error in /api/contact:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}