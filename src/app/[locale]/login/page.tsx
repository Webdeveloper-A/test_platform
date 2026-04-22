import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { dictionary, isLocale } from "@/lib/i18n";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? params.locale : "uz";
  const session = getSession();

  if (session) {
    redirect(session.role === "ADMIN" ? `/${locale}/admin` : `/${locale}/student`);
  }

  return (
    <div className="center-screen">
      <LoginForm locale={locale} labels={dictionary[locale]} />
    </div>
  );
}
