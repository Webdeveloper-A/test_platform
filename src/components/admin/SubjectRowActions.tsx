"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SubjectRowActions({
  subject,
}: {
  subject: { id: string; code: string; titleUz: string; titleRu: string | null; descriptionUz: string | null; descriptionRu: string | null };
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    code: subject.code,
    titleUz: subject.titleUz,
    titleRu: subject.titleRu || "",
    descriptionUz: subject.descriptionUz || "",
    descriptionRu: subject.descriptionRu || "",
  });

  function updateField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function save() {
    const response = await fetch(`/api/admin/subjects/${subject.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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
    const ok = window.confirm("Fanni o‘chirsangiz, unga bog‘langan testlar va savollar ham o‘chadi. Davom etasizmi?");
    if (!ok) return;
    const response = await fetch(`/api/admin/subjects/${subject.id}`, { method: "DELETE" });
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
        <input className="input" value={form.code} onChange={(e) => updateField("code", e.target.value.toUpperCase())} />
        <input className="input" value={form.titleUz} onChange={(e) => updateField("titleUz", e.target.value)} />
        <input className="input" value={form.titleRu} onChange={(e) => updateField("titleRu", e.target.value)} />
        <input className="input" value={form.descriptionUz} onChange={(e) => updateField("descriptionUz", e.target.value)} />
        <input className="input" value={form.descriptionRu} onChange={(e) => updateField("descriptionRu", e.target.value)} />
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
