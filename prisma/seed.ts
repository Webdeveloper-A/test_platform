import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry<T>(label: string, fn: () => Promise<T>, maxAttempts = 5): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.warn(`${label} failed (attempt ${attempt}/${maxAttempts})`);
      if (attempt < maxAttempts) {
        await sleep(attempt * 3000);
      }
    }
  }

  throw lastError;
}

async function main() {
  const subject = await withRetry("subject upsert", () =>
    prisma.subject.upsert({
      where: { code: "CUSTOMS_STATS" },
      update: {
        titleUz: "Bojxona statistikasi",
        titleRu: "Таможенная статистика",
        descriptionUz: "Bojxona statistikasi faniga oid savollar banki",
        descriptionRu: "Банк вопросов по таможенной статистике",
      },
      create: {
        code: "CUSTOMS_STATS",
        titleUz: "Bojxona statistikasi",
        titleRu: "Таможенная статистика",
        descriptionUz: "Bojxona statistikasi faniga oid savollar banki",
        descriptionRu: "Банк вопросов по таможенной статистике",
      },
    })
  );

  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const studentPasswordHash = await bcrypt.hash("student123", 10);

  await withRetry("admin upsert", () =>
    prisma.user.upsert({
      where: { username: "admin" },
      update: {
        passwordHash: adminPasswordHash,
        role: "ADMIN",
        fullName: "Administrator",
        isActive: true,
      },
      create: {
        username: "admin",
        passwordHash: adminPasswordHash,
        role: "ADMIN",
        fullName: "Administrator",
        isActive: true,
      },
    })
  );

  await withRetry("student upsert", () =>
    prisma.user.upsert({
      where: { username: "student" },
      update: {
        passwordHash: studentPasswordHash,
        role: "STUDENT",
        fullName: "Test Student",
        isActive: true,
      },
      create: {
        username: "student",
        passwordHash: studentPasswordHash,
        role: "STUDENT",
        fullName: "Test Student",
        isActive: true,
      },
    })
  );

  const existingQuestions = await withRetry("read existing questions", () =>
    prisma.question.findMany({
      where: { subjectId: subject.id },
      select: { textUz: true },
    })
  );

  const existingSet = new Set(existingQuestions.map((q) => q.textUz.trim().toLowerCase()));

  const demoQuestions = [
    {
      sortOrder: 1,
      difficulty: "MEDIUM",
      textUz: "Tashqi savdo aylanmasi qanday aniqlanadi?",
      textRu: "Как определяется внешнеторговый оборот?",
      optionAUz: "Eksport - import",
      optionARu: "Экспорт - импорт",
      optionBUz: "Eksport + import",
      optionBRu: "Экспорт + импорт",
      optionCUz: "Import / eksport",
      optionCRu: "Импорт / экспорт",
      optionDUz: "Faqat eksport",
      optionDRu: "Только экспорт",
      correctOption: "B" as const,
      isActive: true,
    },
    {
      sortOrder: 2,
      difficulty: "HARD",
      textUz: "Alohida indeks 1 dan katta bo‘lsa, bu nimani bildiradi?",
      textRu: "Что означает, если индивидуальный индекс больше 1?",
      optionAUz: "Ko‘rsatkich kamaygan",
      optionARu: "Показатель уменьшился",
      optionBUz: "Ko‘rsatkich o‘zgarmagan",
      optionBRu: "Показатель не изменился",
      optionCUz: "Ko‘rsatkich oshgan",
      optionCRu: "Показатель увеличился",
      optionDUz: "Hisoblash noto‘g‘ri",
      optionDRu: "Расчёт неверный",
      correctOption: "C" as const,
      isActive: true,
    },
    {
      sortOrder: 3,
      difficulty: "VERY_HARD",
      textUz: "Tashqi savdo balansida eksport importdan yuqori bo‘lsa, bu qanday baholanadi?",
      textRu: "Как оценивается состояние торгового баланса, если экспорт выше импорта?",
      optionAUz: "Passiv balans",
      optionARu: "Пассивный баланс",
      optionBUz: "Neytral balans",
      optionBRu: "Нейтральный баланс",
      optionCUz: "Aktiv balans",
      optionCRu: "Активный баланс",
      optionDUz: "Texnik balans",
      optionDRu: "Технический баланс",
      correctOption: "C" as const,
      isActive: true,
    },
  ];

  let importedCount = 0;

  for (const item of demoQuestions) {
    const normalizedText = item.textUz.trim().toLowerCase();

    if (existingSet.has(normalizedText)) {
      continue;
    }

    await withRetry("question create", () =>
      prisma.question.create({
        data: {
          subjectId: subject.id,
          sortOrder: item.sortOrder,
          difficulty: item.difficulty,
          textUz: item.textUz,
          textRu: item.textRu,
          optionAUz: item.optionAUz,
          optionARu: item.optionARu,
          optionBUz: item.optionBUz,
          optionBRu: item.optionBRu,
          optionCUz: item.optionCUz,
          optionCRu: item.optionCRu,
          optionDUz: item.optionDUz,
          optionDRu: item.optionDRu,
          correctOption: item.correctOption,
          isActive: item.isActive,
        },
      })
    );

    existingSet.add(normalizedText);
    importedCount += 1;
  }

  await withRetry("test upsert", () =>
    prisma.test.upsert({
      where: { id: "customs-stats-main-test" },
      update: {
        subjectId: subject.id,
        titleUz: "Bojxona statistikasi asosiy test",
        titleRu: "Основной тест по таможенной статистике",
        descriptionUz: "Random savollar asosidagi asosiy test",
        descriptionRu: "Основной тест со случайными вопросами",
        durationMinutes: 30,
        questionCount: 3,
        randomizeQuestions: true,
        isActive: true,
      },
      create: {
        id: "customs-stats-main-test",
        subjectId: subject.id,
        titleUz: "Bojxona statistikasi asosiy test",
        titleRu: "Основной тест по таможенной статистике",
        descriptionUz: "Random savollar asosidagi asosiy test",
        descriptionRu: "Основной тест со случайными вопросами",
        durationMinutes: 30,
        questionCount: 3,
        randomizeQuestions: true,
        isActive: true,
      },
    })
  );

  console.log(`Seed yakunlandi. Yangi demo savollar: ${importedCount}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });