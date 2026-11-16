"use client";

import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/store/store";

export function StoreProvider({ children }: { children: ReactNode }) {
  // One store per mounted tree, created on first render and kept across re-renders.
  const [store] = useState(makeStore);
  return <Provider store={store}>{children}</Provider>;
}
