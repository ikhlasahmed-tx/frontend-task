import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { hasLocale, locales } from "@/i18n/config";
import { I18nProvider } from "@/i18n/I18nProvider";
import { dictionaries, getT } from "@/i18n/server";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("meta.appTitle"), description: t("meta.appDescription") };
}

// Pre-render every page once per language.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();

  return (
    <html lang={locale} className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <I18nProvider key={locale} locale={locale} dictionary={dictionaries[locale]}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
