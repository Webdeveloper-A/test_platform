import { Prisma } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function csvEscape(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function formatDate(value: Date | null) {
  if (!value) return "";
  return new Date(value).toLocaleString("uz-UZ");
}

function formatSeconds(value: number | null) {
  if (!value || value <= 0) return "";
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export async function GET(request: Request) {
  const session = getSession();

  if (!session || session.role !== "ADMIN") {
    return new Response("Ruxsat yo‘q", { status: 403 });
  }

  const { searchParams } = new URL(request.url);

  const selectedUserId = searchParams.get("userId") || "";
  const selectedTestId = searchParams.get("testId") || "";
  const selectedSubjectId = searchParams.get("subjectId") || "";
  const selectedStatus = searchParams.get("status") || "all";

  const where: Prisma.AttemptWhereInput = {};

  if (selectedUserId) {
    where.userId = selectedUserId;
  }

  if (selectedTestId) {
    where.testId = selectedTestId;
  }

  if (selectedSubjectId) {
    where.test = {
      is: {
        subjectId: selectedSubjectId,
      },
    };
  }

  if (selectedStatus === "submitted") {
    where.submittedAt = { not: null };
  } else if (selectedStatus === "active") {
    where.submittedAt = null;
  }

  const attempts = await prisma.attempt.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          username: true,
          fullName: true,
        },
      },
      test: {
        select: {
          titleUz: true,
          subject: {
            select: {
              titleUz: true,
            },
          },
        },
      },
    },
  });

  const headers = [
    "Username",
    "F.I.Sh.",
    "Fan",
    "Test",
    "To'g'ri",
    "Jami",
    "Foiz",
    "Vaqt",
    "Holat",
    "Boshlangan",
    "Yakunlangan",
  ];

  const rows = attempts.map((attempt) => [
    attempt.user.username,
    attempt.user.fullName ?? "",
    attempt.test.subject.titleUz,
    attempt.test.titleUz,
    attempt.correctCount,
    attempt.totalCount,
    attempt.submittedAt ? Number(attempt.scorePercent ?? 0).toFixed(1) : "",
    attempt.submittedAt ? formatSeconds(attempt.durationSeconds ?? 0) : "",
    attempt.submittedAt ? "Yakunlangan" : "Faol",
    formatDate(attempt.createdAt),
    formatDate(attempt.submittedAt),
  ]);

  const csv = [
    headers.map(csvEscape).join(","),
    ...rows.map((row) => row.map(csvEscape).join(",")),
  ].join("\n");

  const filename = `results-export-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`;

  return new Response(`\uFEFF${csv}`, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}