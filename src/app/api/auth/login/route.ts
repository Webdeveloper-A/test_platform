import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { normalizeUserRole, setSession } from "@/lib/auth";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Login yoki parol noto‘g‘ri." },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { message: "Foydalanuvchi topilmadi." },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { message: "Login yoki parol noto‘g‘ri." },
        { status: 401 }
      );
    }

    const role = normalizeUserRole(user.role);

    setSession({
      userId: user.id,
      username: user.username,
      fullName: user.fullName ?? "",
      role
    });

    return NextResponse.json({
      ok: true,
      role
    });
  } catch (error) {
    console.error("POST /api/auth/login error:", error);

    return NextResponse.json(
      { message: "Kirishda server xatosi yuz berdi." },
      { status: 500 }
    );
  }
}