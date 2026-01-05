import { SignJWT, jwtVerify } from "jose";

const encoder = new TextEncoder();
const COOKIE_NAME = "admin_session";

function getSecretKey() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error("ADMIN_JWT_SECRET is not set");
  }
  return encoder.encode(secret);
}

export function getSessionCookieName() {
  return COOKIE_NAME;
}

export async function createSessionToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifySessionToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch (err) {
    console.error("Session verification failed", err);
    return null;
  }
}
