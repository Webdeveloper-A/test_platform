import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const schema = z.object({
  subjectId: z.string().min(1),
  textUz: z.string().min(5),
  textRu: z.string().optional().nullable(),
  difficulty: z.enum(["MEDIUM", "HARD", "VERY_HARD"]),
  optionAUz: z.string().min(1),
  optionARu: z.string().optional().nullable(),
  optionBUz: z.string().min(1),
  optionBRu: z.string().optional().nullable(),
  optionCUz: z.string().min(1),
  optionCRu: z.string().optional().nullable(),
  optionDUz: z.string().min(1),
  optionDRu: z.string().optional().nullable(),
  correctOption: z.enum(["A", "B", "C", "D"]),
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

  const lastQuestion = await prisma.question.findFirst({
    where: { subjectId: subject.id },
    orderBy: { sortOrder: "desc" },
  });

  const question = await prisma.question.create({
    data: {
      subjectId: subject.id,
      sortOrder: (lastQuestion?.sortOrder || 0) + 1,
      textUz: parsed.data.textUz,
      textRu: parsed.data.textRu || null,
      difficulty: parsed.data.difficulty,
      optionAUz: parsed.data.optionAUz,
      optionARu: parsed.data.optionARu || null,
      optionBUz: parsed.data.optionBUz,
      optionBRu: parsed.data.optionBRu || null,
      optionCUz: parsed.data.optionCUz,
      optionCRu: parsed.data.optionCRu || null,
      optionDUz: parsed.data.optionDUz,
      optionDRu: parsed.data.optionDRu || null,
      correctOption: parsed.data.correctOption,
    },
  });

  return NextResponse.json({ ok: true, id: question.id });
}
