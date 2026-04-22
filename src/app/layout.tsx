import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customs Test Platform",
  description: "Bojxona statistikasi test platformasi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
