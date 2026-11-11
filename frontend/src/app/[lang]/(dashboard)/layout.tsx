import type { ReactNode } from "react";
import { Sidebar } from "@/components/home/Sidebar";

// Shared frame for the logged-in app (Home now; Wallet, Transactions… later).
// The Sidebar lives here so it stays in place when moving between these pages.
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
