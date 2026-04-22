import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ message: "Ruxsat yo‘q" }, { status: 403 });
  }

  if (session.userId === params.id) {
    return NextResponse.json({ message: "O‘zingizni o‘chira olmaysiz" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ message: "Ruxsat yo‘q" }, { status: 403 });
  }

  const body = (await request.json()) as { password?: string };
  const passwordHash = await bcrypt.hash(body.password || "student123", 10);
  await prisma.user.update({ where: { id: params.id }, data: { passwordHash } });
  return NextResponse.json({ ok: true });
}
