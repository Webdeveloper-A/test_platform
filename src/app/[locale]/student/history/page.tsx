import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime, formatPercent } from "@/lib/utils";

export default async function StudentHistoryPage() {
  const session = requireRole("STUDENT");
  const attempts = await prisma.attempt.findMany({
    where: { userId: session.userId },
    include: { test: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="card">
      <h2>Urinishlar tarixi</h2>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Test</th>
              <th>Natija</th>
              <th>To‘g‘ri</th>
              <th>Vaqt</th>
              <th>Sana</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt) => (
              <tr key={attempt.id}>
                <td>{attempt.test.titleUz}</td>
                <td>{formatPercent(attempt.scorePercent)}</td>
                <td>{attempt.correctCount}/{attempt.totalCount}</td>
                <td>{attempt.durationSeconds ? `${Math.floor(attempt.durationSeconds / 60)} min` : "-"}</td>
                <td>{formatDateTime(attempt.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
