"use client";

import { useParams } from "next/navigation";
import { useCallback } from "react";
import { localePath } from "./config";

// For Client Components: `const path = useLocalePath()`, then `router.push(path("/login"))` → "/ru/login".
// Keeps the user in the language of the page they are on. Server Components use getLocalePath() instead.
export function useLocalePath() {
  const { lang } = useParams<{ lang: string }>();
  // Stable between renders, so it is safe in effect dependency lists.
  return useCallback((path: string) => localePath(lang, path), [lang]);
}
