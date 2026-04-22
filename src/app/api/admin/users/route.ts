import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const schema = z.object({
  fullName: z.string().min(2),
  username: z.string().min(3),
  password: z.string().min(4),
  role: z.enum(["ADMIN", "STUDENT"]),
});

export async function POST(request: Request) {
  const session = getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ message: "Ruxsat yo‘q" }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: "Ma’lumotlar noto‘g‘ri" }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { username: parsed.data.username } });
  if (exists) {
    return NextResponse.json({ message: "Bu login allaqachon mavjud" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = await prisma.user.create({
    data: {
      fullName: parsed.data.fullName,
      username: parsed.data.username,
      passwordHash,
      role: parsed.data.role,
    },
  });

  return NextResponse.json({ ok: true, id: user.id });
}
