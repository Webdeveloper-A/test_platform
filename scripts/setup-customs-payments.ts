import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SUBJECT_CODE = "CUSTOMS_PAYMENTS";

async function main() {
  const subject = await prisma.subject.upsert({
    where: { code: SUBJECT_CODE },
    update: {
      titleUz: "Bojxona to‘lovlari",
      titleRu: "Таможенные платежи",
      descriptionUz: "Bojxona to‘lovlari faniga oid savollar banki",
      descriptionRu: "Банк вопросов по таможенным платежам",
    },
    create: {
      code: SUBJECT_CODE,
      titleUz: "Bojxona to‘lovlari",
      titleRu: "Таможенные платежи",
      descriptionUz: "Bojxona to‘lovlari faniga oid savollar banki",
      descriptionRu: "Банк вопросов по таможенным платежам",
    },
  });

  await prisma.test.upsert({
    where: { id: "customs-payments-30" },
    update: {
      subjectId: subject.id,
      titleUz: "Bojxona to‘lovlari — 30 ta savol",
      titleRu: "Таможенные платежи — 30 вопросов",
      descriptionUz: "30 ta random savoldan iborat test varianti",
      descriptionRu: "Тестовый вариант из 30 случайных вопросов",
      durationMinutes: 30,
      questionCount: 30,
      randomizeQuestions: true,
      isActive: true,
    },
    create: {
      id: "customs-payments-30",
      subjectId: subject.id,
      titleUz: "Bojxona to‘lovlari — 30 ta savol",
      titleRu: "Таможенные платежи — 30 вопросов",
      descriptionUz: "30 ta random savoldan iborat test varianti",
      descriptionRu: "Тестовый вариант из 30 случайных вопросов",
      durationMinutes: 30,
      questionCount: 30,
      randomizeQuestions: true,
      isActive: true,
    },
  });

  await prisma.test.upsert({
    where: { id: "customs-payments-50" },
    update: {
      subjectId: subject.id,
      titleUz: "Bojxona to‘lovlari — 50 ta savol",
      titleRu: "Таможенные платежи — 50 вопросов",
      descriptionUz: "50 ta random savoldan iborat test varianti",
      descriptionRu: "Тестовый вариант из 50 случайных вопросов",
      durationMinutes: 50,
      questionCount: 50,
      randomizeQuestions: true,
      isActive: true,
    },
    create: {
      id: "customs-payments-50",
      subjectId: subject.id,
      titleUz: "Bojxona to‘lovlari — 50 ta savol",
      titleRu: "Таможенные платежи — 50 вопросов",
      descriptionUz: "50 ta random savoldan iborat test varianti",
      descriptionRu: "Тестовый вариант из 50 случайных вопросов",
      durationMinutes: 50,
      questionCount: 50,
      randomizeQuestions: true,
      isActive: true,
    },
  });

  await prisma.test.upsert({
    where: { id: "customs-payments-100" },
    update: {
      subjectId: subject.id,
      titleUz: "Bojxona to‘lovlari — 100 ta savol",
      titleRu: "Таможенные платежи — 100 вопросов",
      descriptionUz: "100 ta random savoldan iborat test varianti",
      descriptionRu: "Тестовый вариант из 100 случайных вопросов",
      durationMinutes: 90,
      questionCount: 100,
      randomizeQuestions: true,
      isActive: true,
    },
    create: {
      id: "customs-payments-100",
      subjectId: subject.id,
      titleUz: "Bojxona to‘lovlari — 100 ta savol",
      titleRu: "Таможенные платежи — 100 вопросов",
      descriptionUz: "100 ta random savoldan iborat test varianti",
      descriptionRu: "Тестовый вариант из 100 случайных вопросов",
      durationMinutes: 90,
      questionCount: 100,
      randomizeQuestions: true,
      isActive: true,
    },
  });

  const subjectTests = await prisma.test.findMany({
    where: { subjectId: subject.id },
    orderBy: { questionCount: "asc" },
    select: {
      id: true,
      titleUz: true,
      questionCount: true,
      randomizeQuestions: true,
      isActive: true,
    },
  });

  console.log("Fan yaratildi yoki yangilandi:", subject.titleUz);
  console.table(subjectTests);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });