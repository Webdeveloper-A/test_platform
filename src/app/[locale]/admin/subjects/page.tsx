import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { CreateSubjectForm } from "@/components/admin/CreateSubjectForm";
import { SubjectRowActions } from "@/components/admin/SubjectRowActions";

export default async function AdminSubjectsPage() {
  requireRole("ADMIN");
  const subjects = await prisma.subject.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { questions: true, tests: true } },
    },
  });

  return (
    <div className="grid grid-2">
      <CreateSubjectForm />
      <div className="card">
        <h2>Fanlar</h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Kod</th>
                <th>Nomi</th>
                <th>Savollar</th>
                <th>Testlar</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.id}>
                  <td>{subject.code}</td>
                  <td>
                    <strong>{subject.titleUz}</strong>
                    <div className="small muted">{subject.titleRu || "-"}</div>
                  </td>
                  <td>{subject._count.questions}</td>
                  <td>{subject._count.tests}</td>
                  <td><SubjectRowActions subject={subject} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
