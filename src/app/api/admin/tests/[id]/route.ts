import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const schema = z.object({
  titleUz: z.string().min(2),
  titleRu: z.string().optional().nullable(),
  descriptionUz: z.string().optional().nullable(),
  descriptionRu: z.string().optional().nullable(),
  durationMinutes: z.number().int().min(1).max(300),
  questionCount: z.number().int().min(1).max(500),
  randomizeQuestions: z.boolean(),
  isActive: z.boolean(),
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

  await prisma.test.update({
    where: { id: params.id },
    data: {
      titleUz: parsed.data.titleUz,
      titleRu: parsed.data.titleRu || null,
      descriptionUz: parsed.data.descriptionUz || null,
      descriptionRu: parsed.data.descriptionRu || null,
      durationMinutes: parsed.data.durationMinutes,
      questionCount: parsed.data.questionCount,
      randomizeQuestions: parsed.data.randomizeQuestions,
      isActive: parsed.data.isActive,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ message: "Ruxsat yo‘q" }, { status: 403 });
  }

  await prisma.test.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
