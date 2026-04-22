import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { shuffleArray } from "@/lib/utils";

const schema = z.object({
  testId: z.string().min(1),
});

type OptionKey = "A" | "B" | "C" | "D";

function serializeQuestion(
  question: {
    id: string;
    textUz: string;
    textRu: string | null;
    difficulty: string;
    optionAUz: string;
    optionARu: string | null;
    optionBUz: string;
    optionBRu: string | null;
    optionCUz: string;
    optionCRu: string | null;
    optionDUz: string;
    optionDRu: string | null;
  },
  randomizeOptions: boolean
) {
  const rawOptions = [
    {
      valueKey: "A" as OptionKey,
      textUz: question.optionAUz,
      textRu: question.optionARu,
    },
    {
      valueKey: "B" as OptionKey,
      textUz: question.optionBUz,
      textRu: question.optionBRu,
    },
    {
      valueKey: "C" as OptionKey,
      textUz: question.optionCUz,
      textRu: question.optionCRu,
    },
    {
      valueKey: "D" as OptionKey,
      textUz: question.optionDUz,
      textRu: question.optionDRu,
    },
  ];

  const randomizedOptions = randomizeOptions ? shuffleArray(rawOptions) : rawOptions;
  const displayKeys: OptionKey[] = ["A", "B", "C", "D"];

  return {
    id: question.id,
    textUz: question.textUz,
    textRu: question.textRu,
    difficulty: question.difficulty,
    options: randomizedOptions.map((option, index) => ({
      displayKey: displayKeys[index],
      valueKey: option.valueKey,
      textUz: option.textUz,
      textRu: option.textRu,
    })),
  };
}

export async function POST(request: Request) {
  try {
    const session = getSession();

    if (!session) {
      return NextResponse.json({ message: "Login talab qilinadi." }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: { id: session.userId, isActive: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Sessiya eskirgan. Qayta login qiling." },
        { status: 401 }
      );
    }

    const parsed = schema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ message: "So‘rov noto‘g‘ri." }, { status: 400 });
    }

    const test = await prisma.test.findUnique({
      where: { id: parsed.data.testId },
    });

    if (!test || !test.isActive) {
      return NextResponse.json({ message: "Test topilmadi." }, { status: 404 });
    }

    const totalDurationSeconds = test.durationMinutes * 60;

    const activeAttempt = await prisma.attempt.findFirst({
      where: {
        userId: session.userId,
        testId: test.id,
        completedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });

    if (activeAttempt) {
      const questionIds = JSON.parse(activeAttempt.questionIdsJson || "[]") as string[];

      const resumedQuestionsRaw = await prisma.question.findMany({
        where: {
          id: { in: questionIds },
        },
      });

      const questionMap = new Map(resumedQuestionsRaw.map((q) => [q.id, q]));
const resumedQuestions = questionIds
  .map((id) => questionMap.get(id))
  .filter(
    (
      question
    ): question is NonNullable<ReturnType<typeof questionMap.get>> => question !== undefined
  );

      if (!resumedQuestions.length) {
        return NextResponse.json(
          { message: "Oldingi urinishdagi savollar topilmadi." },
          { status: 400 }
        );
      }

      const elapsedSeconds = Math.floor(
        (Date.now() - new Date(activeAttempt.createdAt).getTime()) / 1000
      );
      const timeLeftSeconds = Math.max(totalDurationSeconds - elapsedSeconds, 0);

      return NextResponse.json({
        attemptId: activeAttempt.id,
        resumed: true,
        durationMinutes: test.durationMinutes,
        timeLeftSeconds,
        questions: resumedQuestions.map((question) =>
          serializeQuestion(question, test.randomizeQuestions)
        ),
      });
    }

    const questionBank = await prisma.question.findMany({
      where: {
        subjectId: test.subjectId,
        isActive: true,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    if (questionBank.length === 0) {
      return NextResponse.json(
        { message: "Bu fan uchun faol savollar topilmadi." },
        { status: 400 }
      );
    }

    const preparedQuestions = test.randomizeQuestions
      ? shuffleArray(questionBank)
      : questionBank;

    const selectedQuestions = preparedQuestions.slice(0, test.questionCount);

    const attempt = await prisma.attempt.create({
      data: {
        userId: session.userId,
        testId: test.id,
        questionIdsJson: JSON.stringify(selectedQuestions.map((q) => q.id)),
        totalCount: selectedQuestions.length,
      },
    });

    return NextResponse.json({
      attemptId: attempt.id,
      resumed: false,
      durationMinutes: test.durationMinutes,
      timeLeftSeconds: totalDurationSeconds,
      questions: selectedQuestions.map((question) =>
        serializeQuestion(question, test.randomizeQuestions)
      ),
    });
  } catch (error) {
    console.error("POST /api/attempts/start error:", error);
    return NextResponse.json(
      { message: "Testni boshlashda server xatosi yuz berdi." },
      { status: 500 }
    );
  }
}