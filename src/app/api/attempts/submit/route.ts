import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  attemptId: z.string().min(1),
  answers: z.record(z.string()).default({}),
  totalDurationSeconds: z.number().min(0).optional(),
});

export async function POST(request: Request) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ message: "Login talab qilinadi" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: "So‘rov xato" }, { status: 400 });
  }

  const attempt = await prisma.attempt.findUnique({ where: { id: parsed.data.attemptId } });
  if (!attempt || attempt.userId !== session.userId) {
    return NextResponse.json({ message: "Urinish topilmadi" }, { status: 404 });
  }

  if (attempt.submittedAt) {
    return NextResponse.json(JSON.parse(attempt.resultJson || "{}"));
  }

  const questionIds: string[] = JSON.parse(attempt.questionIdsJson);
  const questions = await prisma.question.findMany({ where: { id: { in: questionIds } } });
  const questionMap = new Map(questions.map((question) => [question.id, question]));

  let correctCount = 0;
  const breakdown = questionIds.map((questionId) => {
    const question = questionMap.get(questionId)!;
    const selectedOption = parsed.data.answers[questionId] || null;
    const isCorrect = selectedOption === question.correctOption;
    if (isCorrect) correctCount += 1;

    return {
      questionId,
      textUz: question.textUz,
      textRu: question.textRu,
      selectedOption,
      correctOption: question.correctOption,
      options: {
        A: { textUz: question.optionAUz, textRu: question.optionARu },
        B: { textUz: question.optionBUz, textRu: question.optionBRu },
        C: { textUz: question.optionCUz, textRu: question.optionCRu },
        D: { textUz: question.optionDUz, textRu: question.optionDRu },
      },
    };
  });

  const totalCount = questionIds.length;
  const scorePercent = totalCount ? (correctCount / totalCount) * 100 : 0;
  const result = {
    correctCount,
    totalCount,
    scorePercent,
    durationSeconds: parsed.data.totalDurationSeconds || 0,
    breakdown,
  };

  await prisma.attempt.update({
    where: { id: attempt.id },
    data: {
      submittedAt: new Date(),
      correctCount,
      totalCount,
      scorePercent,
      durationSeconds: parsed.data.totalDurationSeconds || 0,
      answersJson: JSON.stringify(parsed.data.answers),
      resultJson: JSON.stringify(result),
    },
  });

  return NextResponse.json(result);
}
