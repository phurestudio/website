import { NextResponse } from "next/server";

const COOKIE_NAME = "admin_token";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const ADMIN_USER = process.env.ADMIN_BOOTSTRAP_USER;
    const ADMIN_PASS = process.env.ADMIN_BOOTSTRAP_PASS;
    const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN;

    if (!ADMIN_USER || !ADMIN_PASS || !ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "Admin login is not configured" },
        { status: 500 }
      );
    }

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const res = NextResponse.json({ success: true });
      res.cookies.set(COOKIE_NAME, ADMIN_TOKEN, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return res;
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (err) {
    console.error("Admin login failed", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
