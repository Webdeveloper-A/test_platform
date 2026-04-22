import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const schema = z.object({
  subjectId: z.string().min(1),
  sortOrder: z.number().int().positive().nullable().optional(),
  difficulty: z.enum(["MEDIUM", "HARD", "VERY_HARD"]),
  textUz: z.string().min(5),
  textRu: z.string().optional().nullable(),
  optionAUz: z.string().min(1),
  optionARu: z.string().optional().nullable(),
  optionBUz: z.string().min(1),
  optionBRu: z.string().optional().nullable(),
  optionCUz: z.string().min(1),
  optionCRu: z.string().optional().nullable(),
  optionDUz: z.string().min(1),
  optionDRu: z.string().optional().nullable(),
  correctOption: z.enum(["A", "B", "C", "D"]),
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

  const subject = await prisma.subject.findUnique({ where: { id: parsed.data.subjectId } });
  if (!subject) {
    return NextResponse.json({ message: "Fan topilmadi" }, { status: 404 });
  }

  await prisma.question.update({
    where: { id: params.id },
    data: {
      subjectId: parsed.data.subjectId,
      sortOrder: parsed.data.sortOrder ?? null,
      difficulty: parsed.data.difficulty,
      textUz: parsed.data.textUz,
      textRu: parsed.data.textRu || null,
      optionAUz: parsed.data.optionAUz,
      optionARu: parsed.data.optionARu || null,
      optionBUz: parsed.data.optionBUz,
      optionBRu: parsed.data.optionBRu || null,
      optionCUz: parsed.data.optionCUz,
      optionCRu: parsed.data.optionCRu || null,
      optionDUz: parsed.data.optionDUz,
      optionDRu: parsed.data.optionDRu || null,
      correctOption: parsed.data.correctOption,
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

  await prisma.question.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
