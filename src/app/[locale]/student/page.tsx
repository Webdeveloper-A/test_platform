import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPercent } from "@/lib/utils";

export default async function StudentDashboardPage({ params }: { params: { locale: string } }) {
  const session = requireRole("STUDENT");
  const locale = params.locale || "uz";

  const [tests, attempts, bestAttempt] = await Promise.all([
    prisma.test.findMany({ where: { isActive: true }, orderBy: { questionCount: "asc" } }),
    prisma.attempt.findMany({ where: { userId: session.userId }, orderBy: { createdAt: "desc" }, take: 5, include: { test: true } }),
    prisma.attempt.findFirst({ where: { userId: session.userId, submittedAt: { not: null } }, orderBy: { scorePercent: "desc" } }),
  ]);

  return (
    <div className="grid">
      <div className="stat-list">
        <div className="kpi"><div>Faol testlar</div><div className="kpi-number">{tests.length}</div></div>
        <div className="kpi"><div>Urinishlar</div><div className="kpi-number">{attempts.length}</div></div>
        <div className="kpi"><div>Eng yaxshi natija</div><div className="kpi-number">{bestAttempt ? formatPercent(bestAttempt.scorePercent) : "0%"}</div></div>
        <div className="kpi"><div>Oxirgi 5 urinish</div><div className="kpi-number">{attempts.length}</div></div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2>Faol testlar</h2>
          <div className="grid">
            {tests.map((test) => (
              <div key={test.id} className="card">
                <strong>{test.titleUz}</strong>
                <p className="muted">{test.descriptionUz}</p>
                <Link className="btn btn-primary" href={`/${locale}/student/tests/${test.id}`}>
                  Testni boshlash
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>So‘nggi urinishlar</h2>
          <div className="grid">
            {attempts.map((attempt) => (
              <div key={attempt.id} className="card">
                <strong>{attempt.test.titleUz}</strong>
                <div className="muted">{attempt.correctCount}/{attempt.totalCount}</div>
                <div>{formatPercent(attempt.scorePercent)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
