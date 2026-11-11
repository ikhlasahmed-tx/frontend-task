import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, LOCALE_COOKIE, type Locale } from "@/i18n/config";

// The language for a URL that has none: the one used last, else the browser's, else English.
function pickLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (saved && hasLocale(saved)) return saved;

  // shortcut: takes the order of Accept-Language ("ru-RU,ru;q=0.9,en;q=0.8") as the preference order
  // and ignores q-values, use @formatjs/intl-localematcher if more languages are added.
  for (const part of (request.headers.get("accept-language") ?? "").split(",")) {
    const code = part.trim().slice(0, 2).toLowerCase();
    if (hasLocale(code)) return code;
  }
  return defaultLocale;
}

// Runs before the page renders.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = pathname.split("/")[1] ?? "";

  // No language in the URL: add one. /login → /en/login (the query string is kept).
  if (!hasLocale(locale)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${pickLocale(request)}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  // Home: visitors without a session cookie go straight to login, so they never see the Home frame flash.
  // Only checks that the cookie exists; the page itself still asks the backend whether it is valid.
  // Add the other logged-in pages (Wallet, Transactions…) here when they exist.
  if (pathname === `/${locale}` && !request.cookies.has("session")) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // Remember the language of the page being opened.
  if (request.cookies.get(LOCALE_COOKIE)?.value !== locale) {
    const response = NextResponse.next();
    response.cookies.set(LOCALE_COOKIE, locale, { maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    return response;
  }
}

// Everything except the API, Next's own files, and static files (anything with a dot, e.g. /assets/logo.svg).
export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
