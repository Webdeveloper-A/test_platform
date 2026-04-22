import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SUBJECT_CODE = "CUSTOMS_STATS";

const DEMO_QUESTIONS_TO_REMOVE = [
  "Tashqi savdo aylanmasi qanday aniqlanadi?",
  "Alohida indeks 1 dan katta bo‘lsa, bu nimani bildiradi?",
  "Tashqi savdo balansida eksport importdan yuqori bo‘lsa, bu qanday baholanadi?"
];

async function main() {
  const subject = await prisma.subject.findUnique({
    where: { code: SUBJECT_CODE }
  });

  if (!subject) {
    throw new Error(`Fan topilmadi: ${SUBJECT_CODE}`);
  }

  // 1) Seeddagi 3 ta demo savolni o‘chiramiz
  const deleteResult = await prisma.question.deleteMany({
    where: {
      subjectId: subject.id,
      textUz: {
        in: DEMO_QUESTIONS_TO_REMOVE
      }
    }
  });

  // 2) Jami faol savollar sonini tekshiramiz
  const activeQuestionsCount = await prisma.question.count({
    where: {
      subjectId: subject.id,
      isActive: true
    }
  });

  if (activeQuestionsCount < 100) {
    throw new Error(
      `Faol savollar soni yetarli emas. Hozir: ${activeQuestionsCount}. Kamida 100 ta kerak.`
    );
  }

  // 3) Eski asosiy testni nofaol qilamiz, chalkashmasin
  await prisma.test.updateMany({
    where: {
      subjectId: subject.id,
      id: "customs-stats-main-test"
    },
    data: {
      isActive: false
    }
  });

  // 4) 30 talik variant
  await prisma.test.upsert({
    where: { id: "customs-stats-30" },
    update: {
      subjectId: subject.id,
      titleUz: "Bojxona statistikasi — 30 ta savol",
      titleRu: "Таможенная статистика — 30 вопросов",
      descriptionUz: "30 ta random savoldan iborat test varianti",
      descriptionRu: "Тестовый вариант из 30 случайных вопросов",
      durationMinutes: 30,
      questionCount: 30,
      randomizeQuestions: true,
      isActive: true
    },
    create: {
      id: "customs-stats-30",
      subjectId: subject.id,
      titleUz: "Bojxona statistikasi — 30 ta savol",
      titleRu: "Таможенная статистика — 30 вопросов",
      descriptionUz: "30 ta random savoldan iborat test varianti",
      descriptionRu: "Тестовый вариант из 30 случайных вопросов",
      durationMinutes: 30,
      questionCount: 30,
      randomizeQuestions: true,
      isActive: true
    }
  });

  // 5) 50 talik variant
  await prisma.test.upsert({
    where: { id: "customs-stats-50" },
    update: {
      subjectId: subject.id,
      titleUz: "Bojxona statistikasi — 50 ta savol",
      titleRu: "Таможенная статистика — 50 вопросов",
      descriptionUz: "50 ta random savoldan iborat test varianti",
      descriptionRu: "Тестовый вариант из 50 случайных вопросов",
      durationMinutes: 50,
      questionCount: 50,
      randomizeQuestions: true,
      isActive: true
    },
    create: {
      id: "customs-stats-50",
      subjectId: subject.id,
      titleUz: "Bojxona statistikasi — 50 ta savol",
      titleRu: "Таможенная статистика — 50 вопросов",
      descriptionUz: "50 ta random savoldan iborat test varianti",
      descriptionRu: "Тестовый вариант из 50 случайных вопросов",
      durationMinutes: 50,
      questionCount: 50,
      randomizeQuestions: true,
      isActive: true
    }
  });

  // 6) 100 talik variant
  await prisma.test.upsert({
    where: { id: "customs-stats-100" },
    update: {
      subjectId: subject.id,
      titleUz: "Bojxona statistikasi — 100 ta savol",
      titleRu: "Таможенная статистика — 100 вопросов",
      descriptionUz: "100 ta random savoldan iborat test varianti",
      descriptionRu: "Тестовый вариант из 100 случайных вопросов",
      durationMinutes: 90,
      questionCount: 100,
      randomizeQuestions: true,
      isActive: true
    },
    create: {
      id: "customs-stats-100",
      subjectId: subject.id,
      titleUz: "Bojxona statistikasi — 100 ta savol",
      titleRu: "Таможенная статистика — 100 вопросов",
      descriptionUz: "100 ta random savoldan iborat test varianti",
      descriptionRu: "Тестовый вариант из 100 случайных вопросов",
      durationMinutes: 90,
      questionCount: 100,
      randomizeQuestions: true,
      isActive: true
    }
  });

  const tests = await prisma.test.findMany({
    where: {
      subjectId: subject.id
    },
    orderBy: {
      titleUz: "asc"
    },
    select: {
      id: true,
      titleUz: true,
      questionCount: true,
      randomizeQuestions: true,
      isActive: true
    }
  });

  console.log("O‘chirilgan demo savollar:", deleteResult.count);
  console.log("Faol savollar soni:", activeQuestionsCount);
  console.log("Yakuniy test variantlari:");
  console.table(tests);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });