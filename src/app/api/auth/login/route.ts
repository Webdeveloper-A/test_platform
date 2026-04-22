import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/auth";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  locale: z.string().optional(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: "Noto‘g‘ri so‘rov" }, { status: 400 });
  }

  const { username, password, locale = "uz" } = parsed.data;
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || !user.isActive) {
    return NextResponse.json({ message: "Login yoki parol noto‘g‘ri" }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({ message: "Login yoki parol noto‘g‘ri" }, { status: 401 });
  }

  setSessionCookie({
    userId: user.id,
    username: user.username,
    fullName: user.fullName,
    role: user.role,
  });

  return NextResponse.json({
    ok: true,
    redirectTo: user.role === "ADMIN" ? `/${locale}/admin` : `/${locale}/student`,
  });
}
