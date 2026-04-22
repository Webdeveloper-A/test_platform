"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateUserForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, username, password, role }),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || "Xatolik");
      return;
    }
    setFullName("");
    setUsername("");
    setPassword("");
    setRole("STUDENT");
    setMessage("Saqlandi.");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>{"Foydalanuvchi yaratish"}</h2>
      <div className="grid grid-2">
        <div>
          <label className="label">F.I.Sh.</label>
          <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <label className="label">Login</label>
          <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-2 space-top">
        <div>
          <label className="label">Parol</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label className="label">Rol</label>
          <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="STUDENT">STUDENT</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
      </div>
      {message ? <p className="small muted">{message}</p> : null}
      <button className="btn btn-primary space-top" type="submit">Saqlash</button>
    </form>
  );
}
