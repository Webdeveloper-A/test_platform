import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "node:crypto";
const COOKIE_NAME = "ctp_session";

export type UserRole = "ADMIN" | "STUDENT";

type SessionPayload = {
  userId: string;
  username: string;
  fullName: string;
  role: UserRole;
};

function getSecret() {
  return process.env.SESSION_SECRET || "change-this-secret";
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function encodeSession(payload: SessionPayload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function decodeSession(value?: string | null): SessionPayload | null {
  if (!value) return null;
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return null;
  const expected = sign(encoded);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
  } catch {
    return null;
  }
}

export function setSessionCookie(payload: SessionPayload) {
  cookies().set(COOKIE_NAME, encodeSession(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSessionCookie() {
  cookies().delete(COOKIE_NAME);
}

export function getSession() {
  return decodeSession(cookies().get(COOKIE_NAME)?.value);
}

export function requireSession() {
  const session = getSession();
  if (!session) {
    redirect("/uz/login");
  }
  return session;
}

export function requireRole(role: UserRole) {
  const session = requireSession();
  if (session.role !== role) {
    const target = session.role === "ADMIN" ? "/uz/admin" : "/uz/student";
    redirect(target);
  }
  return session;
}
