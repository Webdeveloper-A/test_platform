import { prisma } from "@/lib/prisma";
import { CreateQuestionForm } from "@/components/admin/CreateQuestionForm";
import { QuestionRowActions } from "@/components/admin/QuestionRowActions";
import { requireRole } from "@/lib/auth";

function difficultyLabel(value: string) {
  if (value === "VERY_HARD") return "Juda murakkab";
  if (value === "HARD") return "Murakkab";
  return "O‘rta";
}

export default async function AdminQuestionsPage({ params }: { params: { locale: string } }) {
  requireRole("ADMIN");
  const [questions, subjects] = await Promise.all([
    prisma.question.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      take: 200,
      include: { subject: true },
    }),
    prisma.subject.findMany({ orderBy: { titleUz: "asc" } }),
  ]);

  return (
    <div className="grid grid-2">
      <CreateQuestionForm subjects={subjects.map((subject) => ({ id: subject.id, titleUz: subject.titleUz, code: subject.code }))} />
      <div className="card">
        <h2>Savollar banki</h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Fan</th>
                <th>Savol</th>
                <th>Murakkablik</th>
                <th>Javob</th>
                <th>Holat</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr key={question.id}>
                  <td>{question.sortOrder ?? "-"}</td>
                  <td>{question.subject.titleUz}</td>
                  <td>{question.textUz}</td>
                  <td>{difficultyLabel(question.difficulty)}</td>
                  <td>{question.correctOption}</td>
                  <td>{question.isActive ? "Faol" : "Nofaol"}</td>
                  <td><QuestionRowActions locale={params.locale} questionId={question.id} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
