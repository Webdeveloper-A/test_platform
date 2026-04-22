import { prisma } from "@/lib/prisma";

export async function getDashboardCounts() {
  const [users, questions, tests, attempts] = await Promise.all([
    prisma.user.count(),
    prisma.question.count({ where: { isActive: true } }),
    prisma.test.count({ where: { isActive: true } }),
    prisma.attempt.count(),
  ]);

  return { users, questions, tests, attempts };
}
