import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const bodySchema = z.object({
  items: z.array(z.unknown()).min(1),
  defaultSubjectCode: z.string().optional().nullable(),
});

type NormalizedQuestion = {
  subjectCode: string;
  sortOrder: number | null;
  difficulty: "MEDIUM" | "HARD" | "VERY_HARD";
  textUz: string;
  textRu: string | null;
  optionAUz: string;
  optionARu: string | null;
  optionBUz: string;
  optionBRu: string | null;
  optionCUz: string;
  optionCRu: string | null;
  optionDUz: string;
  optionDRu: string | null;
  correctOption: "A" | "B" | "C" | "D";
  isActive: boolean;
};

function compactText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function canonicalText(value: string) {
  return compactText(value).toLowerCase();
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function nullableString(value: unknown) {
  const result = stringValue(value);
  return result ? result : null;
}

function booleanValue(value: unknown, fallback = true) {
  return typeof value === "boolean" ? value : fallback;
}

function positiveNumberOrNull(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.floor(value);
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      return Math.floor(parsed);
    }
  }
  return null;
}

function normalizeDifficulty(value: unknown): "MEDIUM" | "HARD" | "VERY_HARD" {
  const raw = stringValue(value).toUpperCase();
  if (raw === "HARD") return "HARD";
  if (raw === "VERY_HARD") return "VERY_HARD";
  return "MEDIUM";
}

function normalizeCorrectOption(value: unknown): "A" | "B" | "C" | "D" | null {
  const raw = stringValue(value).toUpperCase();
  if (raw === "A" || raw === "B" || raw === "C" || raw === "D") return raw;
  return null;
}

function getOptionValue(
  source: Record<string, unknown>,
  key: "A" | "B" | "C" | "D",
  lang: "Uz" | "Ru"
) {
  const flatKey = `option${key}${lang}`;
  const nestedKey = lang === "Uz" ? "optionsUz" : "optionsRu";
  const flatValue = source[flatKey];
  const nestedValue = source[nestedKey];

  if (typeof flatValue === "string") {
    return flatValue.trim();
  }

  if (
    nestedValue &&
    typeof nestedValue === "object" &&
    !Array.isArray(nestedValue) &&
    typeof (nestedValue as Record<string, unknown>)[key] === "string"
  ) {
    return ((nestedValue as Record<string, unknown>)[key] as string).trim();
  }

  return "";
}

function normalizeQuestion(
  item: unknown,
  defaultSubjectCode?: string | null
): { ok: true; value: NormalizedQuestion } | { ok: false; reason: string } {
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    return { ok: false, reason: "Savol obyekti noto‘g‘ri formatda." };
  }

  const source = item as Record<string, unknown>;

  const subjectCode = stringValue(source.subjectCode || source.subject || defaultSubjectCode || "")
    .toUpperCase();

  if (!subjectCode) {
    return { ok: false, reason: "subjectCode topilmadi." };
  }

  const textUz = compactText(
    stringValue(source.textUz || source.questionUz || source.question || source.text)
  );

  if (!textUz || textUz.length < 5) {
    return { ok: false, reason: "textUz yetarli emas." };
  }

  const optionAUz = getOptionValue(source, "A", "Uz");
  const optionBUz = getOptionValue(source, "B", "Uz");
  const optionCUz = getOptionValue(source, "C", "Uz");
  const optionDUz = getOptionValue(source, "D", "Uz");

  if (!optionAUz || !optionBUz || !optionCUz || !optionDUz) {
    return { ok: false, reason: "UZ variantlardan biri yo‘q." };
  }

  const correctOption = normalizeCorrectOption(source.correctOption || source.answer);
  if (!correctOption) {
    return { ok: false, reason: "correctOption noto‘g‘ri." };
  }

  return {
    ok: true,
    value: {
      subjectCode,
      sortOrder: positiveNumberOrNull(source.sortOrder),
      difficulty: normalizeDifficulty(source.difficulty),
      textUz,
      textRu: nullableString(source.textRu || source.questionRu),
      optionAUz,
      optionARu: nullableString(getOptionValue(source, "A", "Ru")),
      optionBUz,
      optionBRu: nullableString(getOptionValue(source, "B", "Ru")),
      optionCUz,
      optionCRu: nullableString(getOptionValue(source, "C", "Ru")),
      optionDUz,
      optionDRu: nullableString(getOptionValue(source, "D", "Ru")),
      correctOption,
      isActive: booleanValue(source.isActive, true),
    },
  };
}

export async function POST(request: Request) {
  try {
    const session = getSession();

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ message: "Ruxsat yo‘q" }, { status: 403 });
    }

    const parsedBody = bodySchema.safeParse(await request.json());

    if (!parsedBody.success) {
      return NextResponse.json({ message: "So‘rov formati noto‘g‘ri." }, { status: 400 });
    }

    const { items, defaultSubjectCode } = parsedBody.data;

    const subjects = await prisma.subject.findMany({
      select: { id: true, code: true },
    });

    const subjectMap = new Map(subjects.map((subject) => [subject.code.toUpperCase(), subject.id]));

    const existingQuestions = await prisma.question.findMany({
      select: {
        subjectId: true,
        textUz: true,
        sortOrder: true,
      },
    });

    const existingTextMap = new Map<string, Set<string>>();
    const sortOrderMap = new Map<string, number>();

    for (const row of existingQuestions) {
      const key = row.subjectId;
      const textKey = canonicalText(row.textUz);

      if (!existingTextMap.has(key)) {
        existingTextMap.set(key, new Set());
      }
      existingTextMap.get(key)!.add(textKey);

      const currentMax = sortOrderMap.get(key) || 0;
      sortOrderMap.set(key, Math.max(currentMax, row.sortOrder || 0));
    }

    const imported: Array<{ index: number; textUz: string; subjectCode: string }> = [];
    const skipped: Array<{ index: number; textUz: string; subjectCode: string; reason: string }> = [];
    const errors: Array<{ index: number; reason: string }> = [];

    for (let i = 0; i < items.length; i += 1) {
      const rowNumber = i + 1;
      const normalized = normalizeQuestion(items[i], defaultSubjectCode);

      if (!normalized.ok) {
        errors.push({ index: rowNumber, reason: normalized.reason });
        continue;
      }

      const item = normalized.value;
      const subjectId = subjectMap.get(item.subjectCode);

      if (!subjectId) {
        errors.push({
          index: rowNumber,
          reason: `Fan topilmadi: ${item.subjectCode}`,
        });
        continue;
      }

      const textKey = canonicalText(item.textUz);
      const subjectSet = existingTextMap.get(subjectId) || new Set<string>();

      if (subjectSet.has(textKey)) {
        skipped.push({
          index: rowNumber,
          textUz: item.textUz,
          subjectCode: item.subjectCode,
          reason: "Duplicate savol",
        });
        continue;
      }

      const nextSortOrder =
        item.sortOrder && item.sortOrder > 0
          ? item.sortOrder
          : (sortOrderMap.get(subjectId) || 0) + 1;

      try {
        await prisma.question.create({
          data: {
            subjectId,
            sortOrder: nextSortOrder,
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
        });

        if (!existingTextMap.has(subjectId)) {
          existingTextMap.set(subjectId, new Set());
        }
        existingTextMap.get(subjectId)!.add(textKey);
        sortOrderMap.set(subjectId, Math.max(sortOrderMap.get(subjectId) || 0, nextSortOrder));

        imported.push({
          index: rowNumber,
          textUz: item.textUz,
          subjectCode: item.subjectCode,
        });
      } catch (error) {
        console.error("Import question error:", error);
        errors.push({
          index: rowNumber,
          reason: "Bazaga yozishda xatolik yuz berdi.",
        });
      }
    }

    return NextResponse.json({
      ok: true,
      importedCount: imported.length,
      skippedCount: skipped.length,
      errorCount: errors.length,
      imported,
      skipped,
      errors,
    });
  } catch (error) {
    console.error("POST /api/admin/import/questions error:", error);
    return NextResponse.json(
      { message: "Import jarayonida server xatosi yuz berdi." },
      { status: 500 }
    );
  }
}