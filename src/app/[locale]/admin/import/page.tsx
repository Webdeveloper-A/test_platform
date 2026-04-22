import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ImportQuestionsForm } from "@/components/admin/ImportQuestionsForm";

export default async function AdminImportPage() {
  requireRole("ADMIN");

  const subjects = await prisma.subject.findMany({
    orderBy: { titleUz: "asc" },
    select: {
      id: true,
      code: true,
      titleUz: true,
      titleRu: true,
    },
  });

  return (
    <div className="grid">
      <div className="card">
        <h2>Bulk import</h2>
        <p className="muted">
          JSON orqali savollarni ommaviy yuklash. Duplicate savollar
          avtomatik tashlab ketiladi.
        </p>
      </div>

      <ImportQuestionsForm
        subjects={subjects.map((subject) => ({
          id: subject.id,
          code: subject.code,
          titleUz: subject.titleUz,
          titleRu: subject.titleRu,
        }))}
      />
    </div>
  );
}