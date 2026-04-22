"use client";

import { useState } from "react";

export function LoginForm({ locale, labels }: { locale: string; labels: Record<string, string> }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, locale }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Login xato");
        return;
      }
      window.location.href = data.redirectTo;
    } catch {
      setError("Server bilan ulanishda xato yuz berdi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ width: "100%", maxWidth: 420 }}>
      <h1 className="page-title">{labels.loginTitle}</h1>
      <p className="muted">Admin yoki foydalanuvchi sifatida tizimga kiring.</p>
      <div className="space-top">
        <label className="label">{labels.username}</label>
        <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="space-top">
        <label className="label">{labels.password}</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {error ? <p style={{ color: "#dc2626" }}>{error}</p> : null}
      <button className="btn btn-primary space-top" type="submit" disabled={loading}>
        {loading ? "..." : labels.signIn}
      </button>
    </form>
  );
}
