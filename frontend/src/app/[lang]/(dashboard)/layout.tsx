import type { ReactNode } from "react";
import { Sidebar } from "@/components/home/Sidebar";

// Shared frame for the logged-in app (Home now; Wallet, Transactions… later).
// The Sidebar lives here so it stays in place when moving between these pages.
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1">
      <Sidebar />
      {/* pb-16 keeps the last section clear of the h-16 bottom tab bar below lg */}
      <main className="flex min-w-0 flex-1 flex-col pb-16 lg:pb-0">{children}</main>
    </div>
  );
}
