import Link from "next/link";

export function LanguageSwitcher({ path }: { path: string }) {
  return (
    <div className="row small muted">
      <Link href={`/uz${path}`} className="badge">UZ</Link>
      <Link href={`/ru${path}`} className="badge">RU</Link>
    </div>
  );
}
