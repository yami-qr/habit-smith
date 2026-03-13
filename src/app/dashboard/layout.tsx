import type { ReactNode } from "react";

import { AuthGuard } from "@/components/auth/auth-guard";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffffff,_#f3f4f6_42%,_#e5e7eb)]">
        <div className="mx-auto flex w-full max-w-[1440px]">
          <AppSidebar />
          <div className="min-h-screen w-full">
            <Topbar />
            <main className="p-4 md:p-8">{children}</main>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
