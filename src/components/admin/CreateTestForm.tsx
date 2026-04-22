"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SubjectOption = {
  id: string;
  code: string;
  titleUz: string;
};

export function CreateTestForm({ subjects }: { subjects: SubjectOption[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    subjectId: subjects[0]?.id || "",
    titleUz: "",
    titleRu: "",
    descriptionUz: "",
    descriptionRu: "",
    durationMinutes: "30",
    questionCount: "25",
    randomizeQuestions: true,
  });

  function updateField(name: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/admin/tests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        durationMinutes: Number(form.durationMinutes),
        questionCount: Number(form.questionCount),
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || "Xatolik yuz berdi");
      return;
    }
    setMessage("Test yaratildi.");
    setForm((prev) => ({ ...prev, titleUz: "", titleRu: "", descriptionUz: "", descriptionRu: "" }));
    router.refresh();
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Test yaratish</h2>
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
          <label className="label">Nomi (UZ)</label>
          <input className="input" value={form.titleUz} onChange={(e) => updateField("titleUz", e.target.value)} />
        </div>
      </div>
      <div className="grid grid-2 space-top">
        <div>
          <label className="label">Nomi (RU)</label>
          <input className="input" value={form.titleRu} onChange={(e) => updateField("titleRu", e.target.value)} />
        </div>
        <div>
          <label className="label">Tavsif (UZ)</label>
          <input className="input" value={form.descriptionUz} onChange={(e) => updateField("descriptionUz", e.target.value)} />
        </div>
      </div>
      <div className="space-top">
        <label className="label">Tavsif (RU)</label>
        <input className="input" value={form.descriptionRu} onChange={(e) => updateField("descriptionRu", e.target.value)} />
      </div>
      <div className="grid grid-2 space-top">
        <div>
          <label className="label">Davomiyligi (daq.)</label>
          <input className="input" type="number" min="1" value={form.durationMinutes} onChange={(e) => updateField("durationMinutes", e.target.value)} />
        </div>
        <div>
          <label className="label">Savollar soni</label>
          <input className="input" type="number" min="1" value={form.questionCount} onChange={(e) => updateField("questionCount", e.target.value)} />
        </div>
      </div>
      <label className="row space-top">
        <input type="checkbox" checked={form.randomizeQuestions} onChange={(e) => updateField("randomizeQuestions", e.target.checked)} />
        <span>Savollarni random chiqarish</span>
      </label>
      {message ? <p className="small muted">{message}</p> : null}
      <button className="btn btn-primary space-top" type="submit">Saqlash</button>
    </form>
  );
}
