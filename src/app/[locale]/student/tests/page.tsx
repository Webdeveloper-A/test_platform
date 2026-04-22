import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { isLocale } from "@/lib/i18n";
import { requireRole } from "@/lib/auth";

export default async function StudentTestsPage({ params }: { params: { locale: string } }) {
  requireRole("STUDENT");
  const locale = isLocale(params.locale) ? params.locale : "uz";
  const tests = await prisma.test.findMany({
    where: { isActive: true },
    orderBy: { questionCount: "asc" },
    include: { subject: true },
  });

  return (
    <div className="grid grid-3">
      {tests.map((test) => (
        <div key={test.id} className="card">
          <h2>{test.titleUz}</h2>
          <p className="muted">{test.descriptionUz}</p>
          <div className="small">Fan: {test.subject.titleUz}</div>
          <div className="small">Savollar soni: {test.questionCount}</div>
          <div className="small">Davomiyligi: {test.durationMinutes} daqiqa</div>
          <Link className="btn btn-primary space-top" href={`/${locale}/student/tests/${test.id}`}>
            Testni boshlash
          </Link>
        </div>
      ))}
    </div>
  );
}
