import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { dictionary, isLocale } from "@/lib/i18n";
import { LogoutButton } from "@/components/common/LogoutButton";

export default function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  requireRole("ADMIN");
  const locale = isLocale(params.locale) ? params.locale : "uz";
  const dict = dictionary[locale];

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 className="page-title">{dict.adminPanel}</h1>
          <p className="muted">Test platformasini boshqarish markazi</p>
        </div>
        <LogoutButton label={dict.logout} redirectTo={`/${locale}/login`} />
      </div>

      <div className="nav space-bottom">
        <Link href={`/${locale}/admin`}>{dict.dashboard}</Link>
        <Link href={`/${locale}/admin/users`}>{dict.users}</Link>
        <Link href={`/${locale}/admin/subjects`}>Fanlar</Link>
        <Link href={`/${locale}/admin/questions`}>{dict.questions}</Link>
        <Link href={`/${locale}/admin/tests`}>{dict.tests}</Link>
        <Link href={`/${locale}/admin/import`}>Bulk import</Link>
        <Link href={`/${locale}/admin/results`}>{dict.results}</Link>
        <Link href={`/${locale}/leaderboard`}>{dict.leaderboard}</Link>
      </div>

      {children}
    </div>
  );
}