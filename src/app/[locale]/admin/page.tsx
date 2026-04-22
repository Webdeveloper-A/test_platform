import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage({ params }: { params: { locale: string } }) {
  requireRole("ADMIN");

  const [usersCount, questionsCount, testsCount, attemptsCount] = await Promise.all([
    prisma.user.count(),
    prisma.question.count(),
    prisma.test.count(),
    prisma.attempt.count(),
  ]);

  return (
    <div className="grid">
      <div className="grid grid-4">
        <div className="card">
          <strong>Foydalanuvchilar</strong>
          <div className="kpi-number">{usersCount}</div>
        </div>
        <div className="card">
          <strong>Savollar</strong>
          <div className="kpi-number">{questionsCount}</div>
        </div>
        <div className="card">
          <strong>Testlar</strong>
          <div className="kpi-number">{testsCount}</div>
        </div>
        <div className="card">
          <strong>Urinishlar</strong>
          <div className="kpi-number">{attemptsCount}</div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2>Tezkor boshqaruv</h2>
          <div className="grid">
            <Link className="btn btn-secondary" href={`/${params.locale}/admin/users`}>
              Userlar
            </Link>
            <Link className="btn btn-secondary" href={`/${params.locale}/admin/subjects`}>
              Fanlar
            </Link>
            <Link className="btn btn-secondary" href={`/${params.locale}/admin/questions`}>
              Savollar banki
            </Link>
            <Link className="btn btn-secondary" href={`/${params.locale}/admin/tests`}>
              Testlar
            </Link>
            <Link className="btn btn-primary" href={`/${params.locale}/admin/import`}>
              Bulk import
            </Link>
          </div>
        </div>

        <div className="card">
          <h2>Izoh</h2>
          <p className="muted">
            100+ savollarni qo‘lda kiritish o‘rniga JSON importdan foydalan.
            Duplicate savollar avtomatik skip qilinadi.
          </p>
        </div>
      </div>
    </div>
  );
}