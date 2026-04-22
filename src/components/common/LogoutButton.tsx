"use client";

export function LogoutButton({ label, redirectTo }: { label: string; redirectTo: string }) {
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = redirectTo;
  }

  return (
    <button className="btn btn-secondary" onClick={handleLogout} type="button">
      {label}
    </button>
  );
}
