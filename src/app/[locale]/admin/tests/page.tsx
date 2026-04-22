import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { CreateTestForm } from "@/components/admin/CreateTestForm";
import { TestRowActions } from "@/components/admin/TestRowActions";

export default async function AdminTestsPage() {
  requireRole("ADMIN");
  const [subjects, tests] = await Promise.all([
    prisma.subject.findMany({ orderBy: { titleUz: "asc" } }),
    prisma.test.findMany({ orderBy: { createdAt: "desc" }, include: { subject: true } }),
  ]);

  return (
    <div className="grid grid-2">
      <CreateTestForm subjects={subjects.map((subject) => ({ id: subject.id, titleUz: subject.titleUz, code: subject.code }))} />
      <div className="card">
        <h2>Testlar</h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Nomi</th>
                <th>Fan</th>
                <th>Savollar</th>
                <th>Vaqt</th>
                <th>Holat</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id}>
                  <td>
                    <strong>{test.titleUz}</strong>
                    <div className="small muted">{test.titleRu || "-"}</div>
                  </td>
                  <td>{test.subject.titleUz}</td>
                  <td>{test.questionCount}</td>
                  <td>{test.durationMinutes} daq.</td>
                  <td>{test.isActive ? "Faol" : "Nofaol"}</td>
                  <td><TestRowActions test={test} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
