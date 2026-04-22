"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TestRowActions({
  test,
}: {
  test: {
    id: string;
    titleUz: string;
    titleRu: string | null;
    descriptionUz: string | null;
    descriptionRu: string | null;
    durationMinutes: number;
    questionCount: number;
    randomizeQuestions: boolean;
    isActive: boolean;
  };
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    titleUz: test.titleUz,
    titleRu: test.titleRu || "",
    descriptionUz: test.descriptionUz || "",
    descriptionRu: test.descriptionRu || "",
    durationMinutes: String(test.durationMinutes),
    questionCount: String(test.questionCount),
    randomizeQuestions: test.randomizeQuestions,
    isActive: test.isActive,
  });

  function updateField(name: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function save() {
    const response = await fetch(`/api/admin/tests/${test.id}`, {
      method: "PATCH",
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
    setEditing(false);
    setMessage("Yangilandi.");
    router.refresh();
  }

  async function remove() {
    const ok = window.confirm("Testni o‘chirishni tasdiqlaysizmi?");
    if (!ok) return;
    const response = await fetch(`/api/admin/tests/${test.id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      alert(data.message || "O‘chirib bo‘lmadi");
      return;
    }
    router.refresh();
  }

  if (editing) {
    return (
      <div className="grid" style={{ minWidth: 320 }}>
        <input className="input" value={form.titleUz} onChange={(e) => updateField("titleUz", e.target.value)} />
        <input className="input" value={form.titleRu} onChange={(e) => updateField("titleRu", e.target.value)} />
        <input className="input" value={form.descriptionUz} onChange={(e) => updateField("descriptionUz", e.target.value)} />
        <input className="input" value={form.descriptionRu} onChange={(e) => updateField("descriptionRu", e.target.value)} />
        <div className="grid grid-2">
          <input className="input" type="number" min="1" value={form.durationMinutes} onChange={(e) => updateField("durationMinutes", e.target.value)} />
          <input className="input" type="number" min="1" value={form.questionCount} onChange={(e) => updateField("questionCount", e.target.value)} />
        </div>
        <label className="row"><input type="checkbox" checked={form.randomizeQuestions} onChange={(e) => updateField("randomizeQuestions", e.target.checked)} /> Random</label>
        <label className="row"><input type="checkbox" checked={form.isActive} onChange={(e) => updateField("isActive", e.target.checked)} /> Faol</label>
        {message ? <div className="small muted">{message}</div> : null}
        <div className="row">
          <button className="btn btn-primary" type="button" onClick={save}>Saqlash</button>
          <button className="btn btn-secondary" type="button" onClick={() => setEditing(false)}>Bekor qilish</button>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      {message ? <span className="small muted">{message}</span> : null}
      <button className="btn btn-ghost" type="button" onClick={() => setEditing(true)}>Tahrirlash</button>
      <button className="btn btn-danger" type="button" onClick={remove}>O‘chirish</button>
    </div>
  );
}
