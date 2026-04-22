"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function QuestionRowActions({ locale, questionId }: { locale: string; questionId: string }) {
  const router = useRouter();

  async function removeQuestion() {
    const ok = window.confirm("Savolni o‘chirishni tasdiqlaysizmi?");
    if (!ok) return;
    const response = await fetch(`/api/admin/questions/${questionId}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      alert(data.message || "O‘chirib bo‘lmadi");
      return;
    }
    router.refresh();
  }

  return (
    <div className="row">
      <Link className="btn btn-ghost" href={`/${locale}/admin/questions/${questionId}/edit`}>Tahrirlash</Link>
      <button className="btn btn-danger" type="button" onClick={removeQuestion}>O‘chirish</button>
    </div>
  );
}
