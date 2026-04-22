import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { EditQuestionForm } from "@/components/admin/EditQuestionForm";

export default async function EditQuestionPage({ params }: { params: { locale: string; id: string } }) {
  requireRole("ADMIN");
  const [question, subjects] = await Promise.all([
    prisma.question.findUnique({ where: { id: params.id } }),
    prisma.subject.findMany({ orderBy: { titleUz: "asc" } }),
  ]);

  if (!question) {
    notFound();
  }

  return (
    <EditQuestionForm
      locale={params.locale}
      question={question}
      subjects={subjects.map((subject) => ({ id: subject.id, titleUz: subject.titleUz, code: subject.code }))}
    />
  );
}
