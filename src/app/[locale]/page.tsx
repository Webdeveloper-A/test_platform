import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { isLocale } from "@/lib/i18n";

export default function LocaleHomePage({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? params.locale : "uz";
  const session = getSession();

  if (!session) {
    redirect(`/${locale}/login`);
  }

  if (session.role === "ADMIN") {
    redirect(`/${locale}/admin`);
  }

  redirect(`/${locale}/student`);
}
