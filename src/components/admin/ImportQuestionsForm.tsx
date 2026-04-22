"use client";

import { useState } from "react";

type SubjectOption = {
  id: string;
  code: string;
  titleUz: string;
  titleRu: string | null;
};

type ImportErrorItem = {
  index: number;
  reason: string;
};

type ImportResult = {
  ok: boolean;
  importedCount: number;
  skippedCount: number;
  errorCount: number;
  imported: Array<{ index: number; textUz: string; subjectCode: string }>;
  skipped: Array<{ index: number; textUz: string; subjectCode: string; reason: string }>;
  errors: ImportErrorItem[];
};

const sampleJson = `[
  {
    "subjectCode": "CUSTOMS_STATS",
    "sortOrder": 111,
    "difficulty": "HARD",
    "textUz": "Bojxona statistikasi ...?",
    "textRu": "Таможенная статистика ...?",
    "optionAUz": "Variant A",
    "optionARu": "Вариант A",
    "optionBUz": "Variant B",
    "optionBRu": "Вариант B",
    "optionCUz": "Variant C",
    "optionCRu": "Вариант C",
    "optionDUz": "Variant D",
    "optionDRu": "Вариант D",
    "correctOption": "B",
    "isActive": true
  }
]`;

export function ImportQuestionsForm({ subjects }: { subjects: SubjectOption[] }) {
  const [payload, setPayload] = useState("");
  const [defaultSubjectCode, setDefaultSubjectCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    setPayload(text);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setResult(null);

    let parsed: unknown;

    try {
      parsed = JSON.parse(payload);
    } catch {
      setMessage("JSON format noto‘g‘ri.");
      return;
    }

    const items = Array.isArray(parsed)
      ? parsed
      : parsed && typeof parsed === "object" && Array.isArray((parsed as { items?: unknown[] }).items)
      ? (parsed as { items: unknown[] }).items
      : null;

    if (!items || items.length === 0) {
      setMessage("Import uchun kamida bitta savol kerak.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/import/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, defaultSubjectCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Importda xatolik yuz berdi.");
        setLoading(false);
        return;
      }

      setResult(data as ImportResult);
      setMessage("Import yakunlandi.");
    } catch {
      setMessage("Server bilan bog‘lanishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Savollarni import qilish</h2>

      <div className="space-top">
        <label className="label">JSON fayl tanlash</label>
        <input type="file" accept=".json,application/json" onChange={handleFileChange} />
      </div>

      <div className="space-top">
        <label className="label">Default fan (ixtiyoriy)</label>
        <select
          className="select"
          value={defaultSubjectCode}
          onChange={(e) => setDefaultSubjectCode(e.target.value)}
        >
          <option value="">JSON ichidagi subjectCode dan foydalanish</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.code}>
              {subject.titleUz} ({subject.code})
            </option>
          ))}
        </select>
      </div>

      <div className="space-top">
        <label className="label">JSON matni</label>
        <textarea
          className="textarea"
          style={{ minHeight: 280 }}
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          placeholder="Bu yerga JSON paste qil..."
        />
      </div>

      <details className="space-top">
        <summary>Namuna format</summary>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            background: "#0f172a",
            color: "#e2e8f0",
            padding: 12,
            borderRadius: 12,
            marginTop: 12,
          }}
        >
          {sampleJson}
        </pre>
      </details>

      {message ? <p className="small muted space-top">{message}</p> : null}

      <button className="btn btn-primary space-top" type="submit" disabled={loading}>
        {loading ? "Import qilinmoqda..." : "Import qilish"}
      </button>

      {result ? (
        <div className="space-top">
          <div className="grid grid-3">
            <div className="card">
              <strong>Qo‘shildi</strong>
              <div className="kpi-number">{result.importedCount}</div>
            </div>
            <div className="card">
              <strong>Skip qilindi</strong>
              <div className="kpi-number">{result.skippedCount}</div>
            </div>
            <div className="card">
              <strong>Xatolar</strong>
              <div className="kpi-number">{result.errorCount}</div>
            </div>
          </div>

          {result.skipped.length ? (
            <div className="card space-top">
              <h3>Skip qilingan savollar</h3>
              <ul>
                {result.skipped.slice(0, 20).map((item) => (
                  <li key={`${item.index}-${item.textUz}`}>
                    #{item.index}: {item.subjectCode} — {item.reason}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {result.errors.length ? (
            <div className="card space-top">
              <h3>Xatolar</h3>
              <ul>
                {result.errors.slice(0, 20).map((item) => (
                  <li key={`${item.index}-${item.reason}`}>
                    #{item.index}: {item.reason}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}