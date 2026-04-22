"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateSubjectForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    code: "",
    titleUz: "",
    titleRu: "",
    descriptionUz: "",
    descriptionRu: "",
  });
  const [message, setMessage] = useState("");

  function updateField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || "Xatolik yuz berdi");
      return;
    }
    setForm({ code: "", titleUz: "", titleRu: "", descriptionUz: "", descriptionRu: "" });
    setMessage("Fan yaratildi.");
    router.refresh();
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Fan qo‘shish</h2>
      <div className="grid grid-2">
        <div>
          <label className="label">Kod</label>
          <input className="input" value={form.code} onChange={(e) => updateField("code", e.target.value.toUpperCase())} placeholder="CUSTOMS_STATS" />
        </div>
        <div>
          <label className="label">Fan nomi (UZ)</label>
          <input className="input" value={form.titleUz} onChange={(e) => updateField("titleUz", e.target.value)} />
        </div>
      </div>
      <div className="grid grid-2 space-top">
        <div>
          <label className="label">Fan nomi (RU)</label>
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
      {message ? <p className="small muted">{message}</p> : null}
      <button className="btn btn-primary space-top" type="submit">Saqlash</button>
    </form>
  );
}
