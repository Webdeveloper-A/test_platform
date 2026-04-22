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

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ message: "Ruxsat yo‘q" }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: "Ma’lumotlar noto‘g‘ri" }, { status: 400 });
  }

  const duplicate = await prisma.subject.findFirst({ where: { code: parsed.data.code, NOT: { id: params.id } } });
  if (duplicate) {
    return NextResponse.json({ message: "Bu kod bilan boshqa fan mavjud" }, { status: 409 });
  }

  await prisma.subject.update({
    where: { id: params.id },
    data: {
      code: parsed.data.code,
      titleUz: parsed.data.titleUz,
      titleRu: parsed.data.titleRu || null,
      descriptionUz: parsed.data.descriptionUz || null,
      descriptionRu: parsed.data.descriptionRu || null,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ message: "Ruxsat yo‘q" }, { status: 403 });
  }

  const subject = await prisma.subject.findUnique({
    where: { id: params.id },
    include: { _count: { select: { questions: true, tests: true } } },
  });

  if (!subject) {
    return NextResponse.json({ message: "Fan topilmadi" }, { status: 404 });
  }

  if (subject.code === "CUSTOMS_STATS") {
    return NextResponse.json({ message: "Asosiy seed fanni o‘chirish tavsiya etilmaydi" }, { status: 400 });
  }

  await prisma.subject.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
