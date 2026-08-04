import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "upc_admin_session";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 horas

function getSecretKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("Falta ADMIN_SESSION_SECRET en tu .env.local");
  }
  return new TextEncoder().encode(secret);
}

type SessionPayload = {
  role: "admin";
  expiresAt: string;
};

async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecretKey());
}

async function decrypt(sessionCookie: string | undefined) {
  if (!sessionCookie) return null;
  try {
    const { payload } = await jwtVerify(sessionCookie, getSecretKey(), {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createAdminSession() {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const session = await encrypt({ role: "admin", expiresAt: expiresAt.toISOString() });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME)?.value;
  return decrypt(cookie);
}

export const ADMIN_SESSION_COOKIE = COOKIE_NAME;
