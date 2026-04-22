import Link from "next/link";
import { Prisma } from "@prisma/client";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type SearchParams = {
  userId?: string | string[];
  testId?: string | string[];
  subjectId?: string | string[];
  status?: string | string[];
  page?: string | string[];
  pageSize?: string | string[];
};

function takeFirst(value?: string | string[]) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

function toPositiveInt(value: string, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.floor(parsed);
}

function formatDate(value: Date | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("uz-UZ");
}

function formatSeconds(value: number | null) {
  if (!value || value <= 0) return "-";
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function buildQueryString(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });

  return search.toString();
}

export default async function AdminResultsPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: SearchParams;
}) {
  requireRole("ADMIN");

  const selectedUserId = takeFirst(searchParams.userId);
  const selectedTestId = takeFirst(searchParams.testId);
  const selectedSubjectId = takeFirst(searchParams.subjectId);
  const selectedStatus = takeFirst(searchParams.status) || "all";
  const page = toPositiveInt(takeFirst(searchParams.page), 1);
  const pageSizeRaw = toPositiveInt(takeFirst(searchParams.pageSize), 20);
  const pageSize = [20, 50, 100].includes(pageSizeRaw) ? pageSizeRaw : 20;

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

  const [
    subjects,
    tests,
    users,
    totalCount,
    submittedCount,
    activeCount,
    aggregateSubmitted,
    attempts,
  ] = await Promise.all([
    prisma.subject.findMany({
      orderBy: { titleUz: "asc" },
      select: {
        id: true,
        code: true,
        titleUz: true,
      },
    }),
    prisma.test.findMany({
      orderBy: { titleUz: "asc" },
      select: {
        id: true,
        titleUz: true,
        subjectId: true,
      },
    }),
    prisma.user.findMany({
      where: { role: "STUDENT" },
      orderBy: { username: "asc" },
      select: {
        id: true,
        username: true,
        fullName: true,
      },
    }),
    prisma.attempt.count({ where }),
    prisma.attempt.count({
      where: {
        AND: [where, { submittedAt: { not: null } }],
      },
    }),
    prisma.attempt.count({
      where: {
        AND: [where, { submittedAt: null }],
      },
    }),
    prisma.attempt.aggregate({
      where: {
        AND: [where, { submittedAt: { not: null } }],
      },
      _avg: {
        scorePercent: true,
        durationSeconds: true,
      },
      _max: {
        scorePercent: true,
      },
    }),
    prisma.attempt.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
        test: {
          select: {
            id: true,
            titleUz: true,
            subjectId: true,
            subject: {
              select: {
                id: true,
                titleUz: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(page, totalPages);
  const filteredTests = selectedSubjectId
    ? tests.filter((test) => test.subjectId === selectedSubjectId)
    : tests;

  const baseFilterParams = {
    userId: selectedUserId || undefined,
    testId: selectedTestId || undefined,
    subjectId: selectedSubjectId || undefined,
    status: selectedStatus !== "all" ? selectedStatus : undefined,
  };

  const exportHref = `/api/admin/results/export?${buildQueryString(baseFilterParams)}`;

  function pageHref(nextPage: number) {
    return `/${params.locale}/admin/results?${buildQueryString({
      ...baseFilterParams,
      page: nextPage,
      pageSize,
    })}`;
  }

  function pageSizeHref(nextPageSize: number) {
    return `/${params.locale}/admin/results?${buildQueryString({
      ...baseFilterParams,
      page: 1,
      pageSize: nextPageSize,
    })}`;
  }

  const visibleFrom = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const visibleTo = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="grid">
      <form className="card" method="GET">
        <h2>Natijalar filtri</h2>

        <div className="grid grid-4">
          <div>
            <label className="label">Fan</label>
            <select className="select" name="subjectId" defaultValue={selectedSubjectId}>
              <option value="">Barchasi</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.titleUz} ({subject.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Test</label>
            <select className="select" name="testId" defaultValue={selectedTestId}>
              <option value="">Barchasi</option>
              {filteredTests.map((test) => (
                <option key={test.id} value={test.id}>
                  {test.titleUz}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Foydalanuvchi</label>
            <select className="select" name="userId" defaultValue={selectedUserId}>
              <option value="">Barchasi</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username} — {user.fullName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Holat</label>
            <select className="select" name="status" defaultValue={selectedStatus}>
              <option value="all">Barchasi</option>
              <option value="submitted">Yakunlangan</option>
              <option value="active">Faol</option>
            </select>
          </div>
        </div>

        <div className="row space-top">
          <button className="btn btn-primary" type="submit">
            Filtrlash
          </button>
          <Link className="btn btn-secondary" href={`/${params.locale}/admin/results`}>
            Tozalash
          </Link>
          <a className="btn btn-secondary" href={exportHref}>
            CSV export
          </a>
        </div>
      </form>

      <div className="grid grid-4">
        <div className="card">
          <strong>Jami urinishlar</strong>
          <div className="kpi-number">{totalCount}</div>
        </div>
        <div className="card">
          <strong>Yakunlangan</strong>
          <div className="kpi-number">{submittedCount}</div>
        </div>
        <div className="card">
          <strong>Faol</strong>
          <div className="kpi-number">{activeCount}</div>
        </div>
        <div className="card">
          <strong>O‘rtacha ball</strong>
          <div className="kpi-number">
            {(aggregateSubmitted._avg.scorePercent ?? 0).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="grid grid-3">
        <div className="card">
          <h3>Eng yuqori natija</h3>
          <div className="kpi-number">
            {(aggregateSubmitted._max.scorePercent ?? 0).toFixed(1)}%
          </div>
        </div>

        <div className="card">
          <h3>O‘rtacha vaqt</h3>
          <div className="kpi-number">
            {aggregateSubmitted._avg.durationSeconds
              ? formatSeconds(Math.round(aggregateSubmitted._avg.durationSeconds))
              : "-"}
          </div>
        </div>

        <div className="card">
          <h3>Sahifalash</h3>
          <div className="row" style={{ flexWrap: "wrap" }}>
            <Link className="btn btn-secondary" href={pageSizeHref(20)}>
              20
            </Link>
            <Link className="btn btn-secondary" href={pageSizeHref(50)}>
              50
            </Link>
            <Link className="btn btn-secondary" href={pageSizeHref(100)}>
              100
            </Link>
          </div>
          <p className="small muted space-top">
            Ko‘rsatilmoqda: {visibleFrom}-{visibleTo} / {totalCount}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="header">
          <h2>Urinishlar jadvali</h2>
          <div className="row">
            <Link
              className="btn btn-secondary"
              href={pageHref(Math.max(currentPage - 1, 1))}
            >
              Oldingi
            </Link>
            <span className="badge">
              {currentPage} / {totalPages}
            </span>
            <Link
              className="btn btn-secondary"
              href={pageHref(Math.min(currentPage + 1, totalPages))}
            >
              Keyingi
            </Link>
          </div>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Username</th>
                <th>F.I.Sh.</th>
                <th>Fan</th>
                <th>Test</th>
                <th>To‘g‘ri/Jami</th>
                <th>Foiz</th>
                <th>Vaqt</th>
                <th>Holat</th>
                <th>Boshlangan</th>
                <th>Yakunlangan</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt) => (
                <tr key={attempt.id}>
                  <td>{attempt.user.username}</td>
                  <td>{attempt.user.fullName}</td>
                  <td>{attempt.test.subject.titleUz}</td>
                  <td>{attempt.test.titleUz}</td>
                  <td>
                    {attempt.correctCount}/{attempt.totalCount}
                  </td>
                  <td>{attempt.submittedAt ? `${attempt.scorePercent.toFixed(1)}%` : "-"}</td>
                  <td>{attempt.submittedAt ? formatSeconds(attempt.durationSeconds ?? 0) : "-"}</td>
                  <td>{attempt.submittedAt ? "Yakunlangan" : "Faol"}</td>
                  <td>{formatDate(attempt.createdAt)}</td>
                  <td>{formatDate(attempt.submittedAt)}</td>
                </tr>
              ))}

              {!attempts.length ? (
                <tr>
                  <td colSpan={10} className="muted">
                    Mos natija topilmadi.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="row space-top" style={{ justifyContent: "space-between" }}>
          <p className="small muted">
            Ko‘rsatilmoqda: {visibleFrom}-{visibleTo} / {totalCount}
          </p>

          <div className="row">
            <Link
              className="btn btn-secondary"
              href={pageHref(Math.max(currentPage - 1, 1))}
            >
              Oldingi
            </Link>
            <span className="badge">
              {currentPage} / {totalPages}
            </span>
            <Link
              className="btn btn-secondary"
              href={pageHref(Math.min(currentPage + 1, totalPages))}
            >
              Keyingi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}