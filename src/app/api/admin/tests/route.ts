import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const schema = z.object({
  subjectId: z.string().min(1),
  titleUz: z.string().min(2),
  titleRu: z.string().optional().nullable(),
  descriptionUz: z.string().optional().nullable(),
  descriptionRu: z.string().optional().nullable(),
  durationMinutes: z.number().int().min(1).max(300),
  questionCount: z.number().int().min(1).max(500),
  randomizeQuestions: z.boolean().default(true),
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

  const subject = await prisma.subject.findUnique({ where: { id: parsed.data.subjectId } });
  if (!subject) {
    return NextResponse.json({ message: "Fan topilmadi" }, { status: 404 });
  }

  const test = await prisma.test.create({
    data: {
      ...parsed.data,
      titleRu: parsed.data.titleRu || null,
      descriptionUz: parsed.data.descriptionUz || null,
      descriptionRu: parsed.data.descriptionRu || null,
    },
  });

  return NextResponse.json({ ok: true, id: test.id });
}
