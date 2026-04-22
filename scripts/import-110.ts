import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

type Difficulty = "MEDIUM" | "HARD" | "VERY_HARD";
type CorrectOption = "A" | "B" | "C" | "D";

function normalizeText(value: string) {
  return value
    .replace(/\r/g, "")
    .replace(/\u00A0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function cleanQuestionText(value: string) {
  return normalizeText(
    value
      .replace(/\bPPTga ko['‘]ra,?\s*/gi, "")
      .replace(/\bPPTga ko['‘]ra\s*/gi, "")
  );
}

function difficultyByIndex(index: number): Difficulty {
  if (index <= 40) return "MEDIUM";
  if (index <= 80) return "HARD";
  return "VERY_HARD";
}

function findLabelIndex(text: string, label: "A" | "B" | "C" | "D") {
  const patterns = [
    new RegExp(`\\n${label}\\)\\s*`, "m"),
    new RegExp(`^${label}\\)\\s*`, "m"),
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(text);
    if (match && typeof match.index === "number") {
      return match.index;
    }
  }

  return -1;
}

function extractOptionText(block: string, fromLabel: "A" | "B" | "C" | "D", toIndex: number | null) {
  const startMatch = new RegExp(`(^|\\n)${fromLabel}\\)\\s*`, "m").exec(block);
  if (!startMatch || typeof startMatch.index !== "number") {
    return "";
  }

  const start = startMatch.index + startMatch[0].length;
  const end = toIndex ?? block.length;

  return normalizeText(block.slice(start, end));
}

async function main() {
  const filePath = path.join(process.cwd(), "uploads", "bojxona-110-raw.txt");

  if (!fs.existsSync(filePath)) {
    throw new Error(`Fayl topilmadi: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8").replace(/\r/g, "");
  const answerKeyIndex = raw.indexOf("JAVOBLAR KALITI");

  if (answerKeyIndex === -1) {
    throw new Error("JAVOBLAR KALITI topilmadi.");
  }

  const questionsPart = raw.slice(0, answerKeyIndex).trim();
  const answersPart = raw.slice(answerKeyIndex).trim();

  const answerMap = new Map<number, CorrectOption>();
  const answerRegex = /(\d+)\s*[–-]\s*([ABCD])/g;
  let answerMatch: RegExpExecArray | null;

  while ((answerMatch = answerRegex.exec(answersPart)) !== null) {
    answerMap.set(Number(answerMatch[1]), answerMatch[2] as CorrectOption);
  }

  const blocks = questionsPart
    .split(/\n(?=\d+-test\b)/)
    .map((item) => item.trim())
    .filter(Boolean);

  const parsedQuestions: Array<{
    sortOrder: number;
    difficulty: Difficulty;
    textUz: string;
    optionAUz: string;
    optionBUz: string;
    optionCUz: string;
    optionDUz: string;
    correctOption: CorrectOption;
  }> = [];

  for (const block of blocks) {
    const numberMatch = block.match(/^(\d+)-test\b/m);
    if (!numberMatch) continue;

    const index = Number(numberMatch[1]);
    const content = block.replace(/^\d+-test\b\s*/m, "").trim();

    const aIndex = findLabelIndex(content, "A");
    const bIndex = findLabelIndex(content, "B");
    const cIndex = findLabelIndex(content, "C");
    const dIndex = findLabelIndex(content, "D");

    if ([aIndex, bIndex, cIndex, dIndex].some((v) => v === -1)) {
      console.warn(`Parse bo‘lmadi: ${index}-test`);
      continue;
    }

    const questionText = cleanQuestionText(content.slice(0, aIndex));
    const optionA = extractOptionText(content, "A", bIndex);
    const optionB = extractOptionText(content, "B", cIndex);
    const optionC = extractOptionText(content, "C", dIndex);
    const optionD = extractOptionText(content, "D", null);
    const correctOption = answerMap.get(index);

    if (!questionText || !optionA || !optionB || !optionC || !optionD || !correctOption) {
      console.warn(`To‘liq parse bo‘lmadi: ${index}-test`);
      continue;
    }

    parsedQuestions.push({
      sortOrder: index,
      difficulty: difficultyByIndex(index),
      textUz: questionText,
      optionAUz: optionA,
      optionBUz: optionB,
      optionCUz: optionC,
      optionDUz: optionD,
      correctOption,
    });
  }

  if (!parsedQuestions.length) {
    throw new Error("Hech qanday savol parse bo‘lmadi.");
  }

  const subject = await prisma.subject.upsert({
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
  });

  const existingQuestions = await prisma.question.findMany({
    where: { subjectId: subject.id },
    select: { textUz: true },
  });

  const existingSet = new Set(
    existingQuestions.map((q) => normalizeText(q.textUz).toLowerCase())
  );

  let created = 0;
  let skipped = 0;

  for (const item of parsedQuestions) {
    const key = normalizeText(item.textUz).toLowerCase();

    if (existingSet.has(key)) {
      skipped += 1;
      continue;
    }

    await prisma.question.create({
      data: {
        subjectId: subject.id,
        sortOrder: item.sortOrder,
        difficulty: item.difficulty,
        textUz: item.textUz,
        textRu: null,
        optionAUz: item.optionAUz,
        optionARu: null,
        optionBUz: item.optionBUz,
        optionBRu: null,
        optionCUz: item.optionCUz,
        optionCRu: null,
        optionDUz: item.optionDUz,
        optionDRu: null,
        correctOption: item.correctOption,
        isActive: true,
      },
    });

    existingSet.add(key);
    created += 1;
  }

  const totalActiveQuestions = await prisma.question.count({
    where: {
      subjectId: subject.id,
      isActive: true,
    },
  });

  await prisma.test.upsert({
    where: { id: "customs-stats-main-test" },
    update: {
      subjectId: subject.id,
      titleUz: "Bojxona statistikasi asosiy test",
      titleRu: "Основной тест по таможенной статистике",
      descriptionUz: "110 ta savoldan random shaklda chiqadigan asosiy test",
      descriptionRu: "Основной тест на 110 вопросов со случайной выборкой",
      durationMinutes: 90,
      questionCount: totalActiveQuestions,
      randomizeQuestions: true,
      isActive: true,
    },
    create: {
      id: "customs-stats-main-test",
      subjectId: subject.id,
      titleUz: "Bojxona statistikasi asosiy test",
      titleRu: "Основной тест по таможенной статистике",
      descriptionUz: "110 ta savoldan random shaklda chiqadigan asosiy test",
      descriptionRu: "Основной тест на 110 вопросов со случайной выборкой",
      durationMinutes: 90,
      questionCount: totalActiveQuestions,
      randomizeQuestions: true,
      isActive: true,
    },
  });

  console.log(`Parse qilingan savollar: ${parsedQuestions.length}`);
  console.log(`Yangi qo‘shilgan: ${created}`);
  console.log(`Skip qilingan: ${skipped}`);
  console.log(`Jami faol savollar: ${totalActiveQuestions}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });