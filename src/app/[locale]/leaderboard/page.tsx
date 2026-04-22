import { prisma } from "@/lib/prisma";
import { formatPercent } from "@/lib/utils";

export default async function LeaderboardPage() {
  const attempts = await prisma.attempt.findMany({
    where: { submittedAt: { not: null } },
    include: { user: true },
    orderBy: [{ scorePercent: "desc" }, { correctCount: "desc" }, { createdAt: "asc" }],
    take: 100,
  });

  const bestByUser = new Map<string, { fullName: string; username: string; scorePercent: number; correctCount: number; totalCount: number }>();

  for (const attempt of attempts) {
    const current = bestByUser.get(attempt.userId);
    if (!current || attempt.scorePercent > current.scorePercent) {
      bestByUser.set(attempt.userId, {
        fullName: attempt.user.fullName,
        username: attempt.user.username,
        scorePercent: attempt.scorePercent,
        correctCount: attempt.correctCount,
        totalCount: attempt.totalCount,
      });
    }
  }

  const rows = [...bestByUser.values()].sort((a, b) => b.scorePercent - a.scorePercent);

  return (
    <div className="container">
      <div className="card">
        <h1 className="page-title">Reyting</h1>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>F.I.Sh.</th>
                <th>Login</th>
                <th>Natija</th>
                <th>To‘g‘ri</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.username}>
                  <td>{index + 1}</td>
                  <td>{row.fullName}</td>
                  <td>{row.username}</td>
                  <td>{formatPercent(row.scorePercent)}</td>
                  <td>{row.correctCount}/{row.totalCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
