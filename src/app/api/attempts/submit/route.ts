import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  attemptId: z.string().min(1),
  answers: z.record(z.string()).default({}),
});

export async function POST(request: Request) {
  try {
    const session = getSession();

    if (!session) {
      return NextResponse.json({ message: "Login talab qilinadi." }, { status: 401 });
    }

    const parsed = schema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ message: "So‘rov noto‘g‘ri." }, { status: 400 });
    }

    const attempt = await prisma.attempt.findFirst({
      where: {
        id: parsed.data.attemptId,
        userId: session.userId,
      },
      include: {
        test: true,
      },
    });

    if (!attempt) {
      return NextResponse.json({ message: "Urinish topilmadi." }, { status: 404 });
    }

    const questionIds = JSON.parse(attempt.questionIdsJson || "[]") as string[];

    const questionRows = await prisma.question.findMany({
      where: {
        id: { in: questionIds },
      },
    });

    const questionMap = new Map(questionRows.map((q) => [q.id, q]));

    const orderedQuestions = questionIds
      .map((id) => questionMap.get(id))
      .filter((question): question is NonNullable<typeof questionRows[number]> => question !== undefined);

    if (!orderedQuestions.length) {
      return NextResponse.json({ message: "Savollar topilmadi." }, { status: 400 });
    }

    const totalDurationSeconds = attempt.test.durationMinutes * 60;
    const elapsedSeconds = Math.floor(
      (Date.now() - new Date(attempt.createdAt).getTime()) / 1000
    );
    const finalDurationSeconds = Math.min(Math.max(elapsedSeconds, 0), totalDurationSeconds);

    const answers = parsed.data.answers || {};

    const correctCount = orderedQuestions.reduce((count, question) => {
      return answers[question.id] === question.correctOption ? count + 1 : count;
    }, 0);

    const totalCount = orderedQuestions.length;
    const scorePercent = totalCount
      ? Number(((correctCount / totalCount) * 100).toFixed(2))
      : 0;

    if (!attempt.submittedAt) {
      await prisma.attempt.update({
        where: { id: attempt.id },
        data: {
          correctCount,
          scorePercent,
          durationSeconds: finalDurationSeconds,
          submittedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      correctCount,
      totalCount,
      scorePercent,
      durationSeconds: finalDurationSeconds,
      breakdown: orderedQuestions.map((question) => ({
        questionId: question.id,
        textUz: question.textUz,
        textRu: question.textRu,
        selectedOption: answers[question.id] || null,
        correctOption: question.correctOption,
        options: {
          A: { textUz: question.optionAUz, textRu: question.optionARu },
          B: { textUz: question.optionBUz, textRu: question.optionBRu },
          C: { textUz: question.optionCUz, textRu: question.optionCRu },
          D: { textUz: question.optionDUz, textRu: question.optionDRu },
        },
      })),
    });
  } catch (error) {
    console.error("POST /api/attempts/submit error:", error);
    return NextResponse.json(
      { message: "Testni yakunlashda server xatosi yuz berdi." },
      { status: 500 }
    );
  }
}