"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SubjectOption = { id: string; titleUz: string; code: string };

type QuestionData = {
  id: string;
  subjectId: string;
  sortOrder: number | null;
  difficulty: string;
  textUz: string;
  textRu: string | null;
  optionAUz: string;
  optionARu: string | null;
  optionBUz: string;
  optionBRu: string | null;
  optionCUz: string;
  optionCRu: string | null;
  optionDUz: string;
  optionDRu: string | null;
  correctOption: string;
  isActive: boolean;
};

export function EditQuestionForm({ question, subjects, locale }: { question: QuestionData; subjects: SubjectOption[]; locale: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    subjectId: question.subjectId,
    sortOrder: String(question.sortOrder || ""),
    difficulty: question.difficulty,
    textUz: question.textUz,
    textRu: question.textRu || "",
    optionAUz: question.optionAUz,
    optionARu: question.optionARu || "",
    optionBUz: question.optionBUz,
    optionBRu: question.optionBRu || "",
    optionCUz: question.optionCUz,
    optionCRu: question.optionCRu || "",
    optionDUz: question.optionDUz,
    optionDRu: question.optionDRu || "",
    correctOption: question.correctOption,
    isActive: question.isActive,
  });

  function updateField(name: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch(`/api/admin/questions/${question.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        sortOrder: form.sortOrder ? Number(form.sortOrder) : null,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || "Xatolik yuz berdi");
      return;
    }
    router.push(`/${locale}/admin/questions`);
    router.refresh();
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Savolni tahrirlash</h2>
      <div className="grid grid-2">
        <div>
          <label className="label">Fan</label>
          <select className="select" value={form.subjectId} onChange={(e) => updateField("subjectId", e.target.value)}>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>{subject.titleUz} ({subject.code})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Tartib raqami</label>
          <input className="input" type="number" min="1" value={form.sortOrder} onChange={(e) => updateField("sortOrder", e.target.value)} />
        </div>
      </div>
      <div className="grid grid-2 space-top">
        <div>
          <label className="label">Murakkablik</label>
          <select className="select" value={form.difficulty} onChange={(e) => updateField("difficulty", e.target.value)}>
            <option value="MEDIUM">O‘rta</option>
            <option value="HARD">Murakkab</option>
            <option value="VERY_HARD">Juda murakkab</option>
          </select>
        </div>
        <label className="row" style={{ marginTop: 30 }}>
          <input type="checkbox" checked={form.isActive} onChange={(e) => updateField("isActive", e.target.checked)} />
          <span>Faol savol</span>
        </label>
      </div>
      <div className="space-top">
        <label className="label">Savol matni (UZ)</label>
        <textarea className="textarea" value={form.textUz} onChange={(e) => updateField("textUz", e.target.value)} />
      </div>
      <div className="space-top">
        <label className="label">Savol matni (RU)</label>
        <textarea className="textarea" value={form.textRu} onChange={(e) => updateField("textRu", e.target.value)} />
      </div>
      <div className="grid grid-2 space-top">
        <div>
          <label className="label">A (UZ)</label>
          <input className="input" value={form.optionAUz} onChange={(e) => updateField("optionAUz", e.target.value)} />
        </div>
        <div>
          <label className="label">A (RU)</label>
          <input className="input" value={form.optionARu} onChange={(e) => updateField("optionARu", e.target.value)} />
        </div>
      </div>
      <div className="grid grid-2 space-top">
        <div>
          <label className="label">B (UZ)</label>
          <input className="input" value={form.optionBUz} onChange={(e) => updateField("optionBUz", e.target.value)} />
        </div>
        <div>
          <label className="label">B (RU)</label>
          <input className="input" value={form.optionBRu} onChange={(e) => updateField("optionBRu", e.target.value)} />
        </div>
      </div>
      <div className="grid grid-2 space-top">
        <div>
          <label className="label">C (UZ)</label>
          <input className="input" value={form.optionCUz} onChange={(e) => updateField("optionCUz", e.target.value)} />
        </div>
        <div>
          <label className="label">C (RU)</label>
          <input className="input" value={form.optionCRu} onChange={(e) => updateField("optionCRu", e.target.value)} />
        </div>
      </div>
      <div className="grid grid-2 space-top">
        <div>
          <label className="label">D (UZ)</label>
          <input className="input" value={form.optionDUz} onChange={(e) => updateField("optionDUz", e.target.value)} />
        </div>
        <div>
          <label className="label">D (RU)</label>
          <input className="input" value={form.optionDRu} onChange={(e) => updateField("optionDRu", e.target.value)} />
        </div>
      </div>
      <div className="space-top">
        <label className="label">To‘g‘ri javob</label>
        <select className="select" value={form.correctOption} onChange={(e) => updateField("correctOption", e.target.value)}>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
      </div>
      {message ? <p className="small muted">{message}</p> : null}
      <div className="row space-top">
        <button className="btn btn-primary" type="submit">Saqlash</button>
        <button className="btn btn-secondary" type="button" onClick={() => router.push(`/${locale}/admin/questions`)}>Orqaga</button>
      </div>
    </form>
  );
}
