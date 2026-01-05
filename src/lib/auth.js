import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { ensureTables, getPool } from "./db";
import { createSessionToken, getSessionCookieName, verifySessionToken } from "./session";

const SESSION_COOKIE = getSessionCookieName();

export async function bootstrapAdminUser() {
  await ensureTables();
  const pool = getPool();
  const [rows] = await pool.query("SELECT id FROM admin_users LIMIT 1");
  if (rows.length) return;

  const username = process.env.ADMIN_BOOTSTRAP_USER;
  const password = process.env.ADMIN_BOOTSTRAP_PASS;
  if (!username || !password) {
    console.warn(
      "No admin users found and ADMIN_BOOTSTRAP_USER/ADMIN_BOOTSTRAP_PASS not set. Please create a user manually."
    );
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO admin_users (username, password_hash) VALUES (?, ?)",
    [username, passwordHash]
  );
}

export async function findAdminByUsername(username) {
  await ensureTables();
  const pool = getPool();
  const [rows] = await pool.query("SELECT id, username, password_hash FROM admin_users WHERE username = ?", [
    username,
  ]);
  if (!rows.length) return null;
  return rows[0];
}

export async function verifyCredentials(username, password) {
  const user = await findAdminByUsername(username);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return null;
  return { id: user.id, username: user.username };
}

export async function createSessionForUser(user) {
  const token = await createSessionToken({
    sub: user.id,
    username: user.username,
  });

  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return token;
}

export function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionFromCookies() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
