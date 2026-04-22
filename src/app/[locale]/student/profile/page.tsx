import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPercent } from "@/lib/utils";

export default async function StudentProfilePage() {
  const session = requireRole("STUDENT");
  const [attemptCount, bestAttempt, lastAttempt] = await Promise.all([
    prisma.attempt.count({ where: { userId: session.userId } }),
    prisma.attempt.findFirst({ where: { userId: session.userId, submittedAt: { not: null } }, orderBy: { scorePercent: "desc" } }),
    prisma.attempt.findFirst({ where: { userId: session.userId }, orderBy: { createdAt: "desc" }, include: { test: true } }),
  ]);

  return (
    <div className="grid grid-2">
      <div className="card">
        <h2>Shaxsiy profil</h2>
        <p><strong>F.I.Sh.:</strong> {session.fullName}</p>
        <p><strong>Login:</strong> {session.username}</p>
        <p><strong>Rol:</strong> {session.role}</p>
      </div>
      <div className="card">
        <h2>Statistika</h2>
        <p><strong>Jami urinishlar:</strong> {attemptCount}</p>
        <p><strong>Eng yaxshi natija:</strong> {bestAttempt ? formatPercent(bestAttempt.scorePercent) : "0%"}</p>
        <p><strong>Oxirgi test:</strong> {lastAttempt?.test.titleUz || "-"}</p>
      </div>
    </div>
  );
}
