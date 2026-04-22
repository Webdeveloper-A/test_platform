import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type UserRole = "ADMIN" | "STUDENT";

export type SessionUser = {
  userId: string;
  username: string;
  fullName: string;
  role: UserRole;
};

const COOKIE_NAME = "ctp_session";

function encodeSession(data: SessionUser) {
  return Buffer.from(JSON.stringify(data), "utf-8").toString("base64");
}

function decodeSession(value: string): SessionUser | null {
  try {
    const parsed = JSON.parse(
      Buffer.from(value, "base64").toString("utf-8")
    ) as SessionUser;

    if (
      !parsed ||
      typeof parsed.userId !== "string" ||
      typeof parsed.username !== "string" ||
      typeof parsed.fullName !== "string" ||
      (parsed.role !== "ADMIN" && parsed.role !== "STUDENT")
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function normalizeUserRole(role: string): UserRole {
  return role === "ADMIN" ? "ADMIN" : "STUDENT";
}

export function setSession(session: SessionUser) {
  const isProd = process.env.NODE_ENV === "production";

  cookies().set(COOKIE_NAME, encodeSession(session), {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export function getSession(): SessionUser | null {
  const raw = cookies().get(COOKIE_NAME)?.value;
  if (!raw) return null;
  return decodeSession(raw);
}

export function clearSession() {
  const isProd = process.env.NODE_ENV === "production";

  cookies().set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    expires: new Date(0)
  });
}

export function requireAuth() {
  const session = getSession();
  if (!session) {
    redirect("/uz/login");
  }
  return session;
}

export function requireRole(role: UserRole) {
  const session = getSession();

  if (!session) {
    redirect("/uz/login");
  }

  if (session.role !== role) {
    redirect(session.role === "ADMIN" ? "/uz/admin" : "/uz/student");
  }

  return session;
}