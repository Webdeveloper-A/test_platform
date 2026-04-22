"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SubjectOption = { id: string; titleUz: string; code: string };

export function CreateQuestionForm({ subjects }: { subjects: SubjectOption[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    subjectId: subjects[0]?.id || "",
    textUz: "",
    textRu: "",
    difficulty: "MEDIUM",
    optionAUz: "",
    optionARu: "",
    optionBUz: "",
    optionBRu: "",
    optionCUz: "",
    optionCRu: "",
    optionDUz: "",
    optionDRu: "",
    correctOption: "A",
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/admin/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || "Xatolik");
      return;
    }
    setMessage("Savol qo‘shildi.");
    setForm((prev) => ({
      ...prev,
      textUz: "",
      textRu: "",
      optionAUz: "",
      optionARu: "",
      optionBUz: "",
      optionBRu: "",
      optionCUz: "",
      optionCRu: "",
      optionDUz: "",
      optionDRu: "",
      correctOption: "A",
    }));
    router.refresh();
  }

  function updateField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Savol qo‘shish</h2>
      <label className="label">Fan</label>
      <select className="select" value={form.subjectId} onChange={(e) => updateField("subjectId", e.target.value)}>
        {subjects.map((subject) => (
          <option key={subject.id} value={subject.id}>{subject.titleUz} ({subject.code})</option>
        ))}
      </select>
      <label className="label space-top">Savol matni (UZ)</label>
      <textarea className="textarea" value={form.textUz} onChange={(e) => updateField("textUz", e.target.value)} />
      <label className="label space-top">Savol matni (RU)</label>
      <textarea className="textarea" value={form.textRu} onChange={(e) => updateField("textRu", e.target.value)} />
      <div className="grid grid-2 space-top">
        <div>
          <label className="label">Murakkablik</label>
          <select className="select" value={form.difficulty} onChange={(e) => updateField("difficulty", e.target.value)}>
            <option value="MEDIUM">O‘rta</option>
            <option value="HARD">Murakkab</option>
            <option value="VERY_HARD">Juda murakkab</option>
          </select>
        </div>
        <div>
          <label className="label">To‘g‘ri javob</label>
          <select className="select" value={form.correctOption} onChange={(e) => updateField("correctOption", e.target.value)}>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>
      </div>
      <div className="grid grid-2 space-top">
        <div><label className="label">A variant (UZ)</label><input className="input" value={form.optionAUz} onChange={(e) => updateField("optionAUz", e.target.value)} /></div>
        <div><label className="label">A variant (RU)</label><input className="input" value={form.optionARu} onChange={(e) => updateField("optionARu", e.target.value)} /></div>
      </div>
      <div className="grid grid-2 space-top">
        <div><label className="label">B variant (UZ)</label><input className="input" value={form.optionBUz} onChange={(e) => updateField("optionBUz", e.target.value)} /></div>
        <div><label className="label">B variant (RU)</label><input className="input" value={form.optionBRu} onChange={(e) => updateField("optionBRu", e.target.value)} /></div>
      </div>
      <div className="grid grid-2 space-top">
        <div><label className="label">C variant (UZ)</label><input className="input" value={form.optionCUz} onChange={(e) => updateField("optionCUz", e.target.value)} /></div>
        <div><label className="label">C variant (RU)</label><input className="input" value={form.optionCRu} onChange={(e) => updateField("optionCRu", e.target.value)} /></div>
      </div>
      <div className="grid grid-2 space-top">
        <div><label className="label">D variant (UZ)</label><input className="input" value={form.optionDUz} onChange={(e) => updateField("optionDUz", e.target.value)} /></div>
        <div><label className="label">D variant (RU)</label><input className="input" value={form.optionDRu} onChange={(e) => updateField("optionDRu", e.target.value)} /></div>
      </div>
      {message ? <p className="small muted">{message}</p> : null}
      <button className="btn btn-primary space-top" type="submit">Saqlash</button>
    </form>
  );
}
