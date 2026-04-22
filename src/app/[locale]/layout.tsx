import Link from "next/link";
import { dictionary, isLocale, type Locale } from "@/lib/i18n";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "@/components/common/LogoutButton";

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = (isLocale(params.locale) ? params.locale : "uz") as Locale;
  const dict = dictionary[locale];
  const session = getSession();

  return (
    <div>
      <div className="container">
        <div className="header">
          <div className="grid" style={{ gap: 8 }}>
            <Link href={`/${locale}`}>
              <strong>{dict.appName}</strong>
            </Link>
            {session ? (
              <div className="small muted">
                {session.fullName} · {session.username} · {session.role}
              </div>
            ) : null}
          </div>

          <div className="row small muted">
            <span>{dict.language}:</span>
            <Link href={`/uz`} className="badge">UZ</Link>
            <Link href={`/ru`} className="badge">RU</Link>
            {session ? <LogoutButton label={dict.logout} redirectTo={`/${locale}/login`} /> : null}
          </div>
        </div>

        {session ? (
          <div className="nav space-bottom">
            <Link href={`/${locale}`}>{dict.dashboard}</Link>
            {session.role === "ADMIN" ? (
              <>
                <Link href={`/${locale}/admin`}>{dict.adminPanel}</Link>
                <Link href={`/${locale}/admin/users`}>{dict.users}</Link>
                <Link href={`/${locale}/admin/questions`}>{dict.questions}</Link>
                <Link href={`/${locale}/admin/results`}>{dict.results}</Link>
                <Link href={`/${locale}/leaderboard`}>{dict.leaderboard}</Link>
              </>
            ) : (
              <>
                <Link href={`/${locale}/student`}>{dict.studentPanel}</Link>
                <Link href={`/${locale}/student/tests`}>{dict.tests}</Link>
                <Link href={`/${locale}/student/history`}>{dict.history}</Link>
                <Link href={`/${locale}/student/profile`}>{dict.profile}</Link>
                <Link href={`/${locale}/leaderboard`}>{dict.leaderboard}</Link>
              </>
            )}
          </div>
        ) : null}
      </div>
      {children}
    </div>
  );
}
