import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { dictionary, isLocale } from "@/lib/i18n";
import { LogoutButton } from "@/components/common/LogoutButton";

export default function StudentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = requireSession();
  const locale = isLocale(params.locale) ? params.locale : "uz";
  const dict = dictionary[locale];

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 className="page-title">{dict.studentPanel}</h1>
          <p className="muted">{session.fullName}</p>
        </div>
        <LogoutButton label={dict.logout} redirectTo={`/${locale}/login`} />
      </div>

      <div className="nav space-bottom">
        <Link href={`/${locale}/student`}>{dict.dashboard}</Link>
        <Link href={`/${locale}/student/tests`}>{dict.tests}</Link>
        <Link href={`/${locale}/student/history`}>{dict.history}</Link>
        <Link href={`/${locale}/student/profile`}>{dict.profile}</Link>
        <Link href={`/${locale}/leaderboard`}>{dict.leaderboard}</Link>
      </div>

      {children}
    </div>
  );
}
