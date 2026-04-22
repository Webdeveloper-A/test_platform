import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const schema = z.object({
  code: z.string().min(2).max(40).regex(/^[A-Z0-9_]+$/),
  titleUz: z.string().min(2),
  titleRu: z.string().optional().nullable(),
  descriptionUz: z.string().optional().nullable(),
  descriptionRu: z.string().optional().nullable(),
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

  const exists = await prisma.subject.findUnique({ where: { code: parsed.data.code } });
  if (exists) {
    return NextResponse.json({ message: "Bu kod bilan fan allaqachon mavjud" }, { status: 409 });
  }

  const subject = await prisma.subject.create({
    data: {
      code: parsed.data.code,
      titleUz: parsed.data.titleUz,
      titleRu: parsed.data.titleRu || null,
      descriptionUz: parsed.data.descriptionUz || null,
      descriptionRu: parsed.data.descriptionRu || null,
    },
  });

  return NextResponse.json({ ok: true, id: subject.id });
}
