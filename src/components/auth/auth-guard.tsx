"use client";

import type { ReactNode } from "react";

import { useAuthGuard } from "@/hooks/use-auth-guard";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { hydrated, isAuthenticated } = useAuthGuard();

  if (!hydrated || !isAuthenticated) {
    return (
      <div className="grid min-h-screen place-items-center">
        <p className="text-sm text-zinc-500">Checking session...</p>
      </div>
    );
  }

  return <>{children}</>;
}
