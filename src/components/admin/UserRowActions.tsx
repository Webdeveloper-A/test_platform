"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function UserRowActions({ userId }: { userId: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("student123");

  async function removeUser() {
    const ok = window.confirm("Foydalanuvchini o‘chirishni tasdiqlaysizmi?");
    if (!ok) return;
    await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    router.refresh();
  }

  async function resetPassword() {
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    alert("Parol yangilandi");
    router.refresh();
  }

  return (
    <div className="row">
      <input className="input" style={{ width: 140 }} value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="btn btn-ghost" type="button" onClick={resetPassword}>Parolni almashtirish</button>
      <button className="btn btn-danger" type="button" onClick={removeUser}>O‘chirish</button>
    </div>
  );
}
