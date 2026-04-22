import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TestRunner } from "@/components/test/TestRunner";
import { requireRole } from "@/lib/auth";

export default async function StudentTestPage({
  params,
}: {
  params: { locale: string; testId: string };
}) {
  requireRole("STUDENT");
  const test = await prisma.test.findUnique({
    where: { id: params.testId },
  });

  if (!test || !test.isActive) {
    notFound();
  }

  return (
    <TestRunner
      locale={params.locale}
      testId={test.id}
      testTitle={test.titleUz}
      durationMinutes={test.durationMinutes}
    />
  );
}
